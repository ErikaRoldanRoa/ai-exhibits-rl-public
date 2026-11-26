#!/usr/bin/env python3
"""Verify that request.html keeps FORM_LOCKED = true by default and renders
the backend request_id on the success screen as plain text without executing
markup across Chromium, WebKit, and Firefox at phone and desktop viewports.
"""
from __future__ import annotations

import argparse
import functools
import http.server
import json
import sys
import threading
import unittest
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent.parent
ENGINES = ("chromium", "webkit", "firefox")
VIEWPORTS = (("phone", 390, 844), ("desktop", 1280, 800))
MARKER = "<img src=x onerror=window.__pwned=1>"


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args) -> None:
        pass


class RequestSuccessEscapeTest(unittest.TestCase):
    site_dir: Path = ROOT

    @classmethod
    def setUpClass(cls) -> None:
        handler = functools.partial(QuietHandler, directory=str(cls.site_dir))
        cls.httpd = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
        cls.thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.thread.start()
        cls.base_url = f"http://127.0.0.1:{cls.httpd.server_address[1]}"
        cls.pw = sync_playwright().start()
        cls.browsers = {name: getattr(cls.pw, name).launch() for name in ENGINES}

    @classmethod
    def tearDownClass(cls) -> None:
        try:
            for b in getattr(cls, "browsers", {}).values():
                try:
                    b.close()
                except Exception:
                    pass
            cls.pw.stop()
        finally:
            cls.httpd.shutdown()
            cls.httpd.server_close()

    def _make_context(self, browser, width: int, height: int, stub_state: dict):
        ctx = browser.new_context(
            viewport={"width": width, "height": height},
            service_workers="block",
        )
        raw_html = (self.site_dir / "request.html").read_text(encoding="utf-8")

        def handle_route(route) -> None:
            url = route.request.url
            if url == self.base_url + "/request.html?unlock_for_test=1":
                self.assertIn("const FORM_LOCKED = true;", raw_html)
                unlocked = raw_html.replace("const FORM_LOCKED = true;", "const FORM_LOCKED = false;", 1)
                route.fulfill(status=200, content_type="text/html; charset=utf-8", body=unlocked)
                return
            if url.startswith(self.base_url):
                route.continue_()
                return
            if "script.google.com" in url:
                stub_state["calls"] += 1
                route.fulfill(
                    status=200,
                    content_type="application/json; charset=utf-8",
                    body=json.dumps({"status": "ok", "request_id": stub_state["request_id"]}),
                )
                return
            route.abort()

        ctx.route("**/*", handle_route)
        return ctx

    def _fill_and_submit(self, page) -> None:
        page.fill("#organizer_name", "Camille Martin")
        page.fill("#organizer_email", "camille@example.org")
        page.fill("#organizer_institution", "Collège Rousseau")
        page.fill("#organizer_country", "Suisse")
        page.fill("#event_name", "Atelier Puzzle")
        page.check('input[name="event_scope"][value="permanent"]')
        page.fill("#audience", "24 élèves de 15 ans")
        page.click('[data-chips="languages"] .chip[data-value="fr"]')
        page.check("#consent_institution")
        page.check("#consent_data")
        page.click("#submitBtn")
        page.wait_for_selector("#successScreen.visible", timeout=5000)

    def test_1_form_stays_locked_by_default(self) -> None:
        for engine_name in ENGINES:
            browser = self.browsers[engine_name]
            for vp_name, width, height in VIEWPORTS:
                label = f"{engine_name}:{vp_name}"
                stub_state = {"request_id": "REQ-UNUSED", "calls": 0}
                ctx = self._make_context(browser, width, height, stub_state)
                try:
                    page = ctx.new_page()
                    page.goto(self.base_url + "/request.html", wait_until="domcontentloaded")
                    self.assertTrue(
                        page.evaluate("FORM_LOCKED === true && document.body.classList.contains('form-locked')"),
                        f"form not locked by default in {label}",
                    )
                    self.assertEqual(
                        page.evaluate("getComputedStyle(document.getElementById('requestForm')).display"),
                        "none",
                        f"requestForm should be hidden while locked in {label}",
                    )
                    page.evaluate(
                        "document.getElementById('requestForm').dispatchEvent(new Event('submit', {bubbles:true, cancelable:true}))"
                    )
                    self.assertEqual(stub_state["calls"], 0, f"locked form called backend in {label}")
                    self.assertEqual(
                        page.locator("#submitStatus").get_attribute("data-state"),
                        "bad",
                        f"locked submit did not set bad status in {label}",
                    )
                finally:
                    ctx.close()

    def test_2_success_path_escapes_request_id(self) -> None:
        for engine_name in ENGINES:
            browser = self.browsers[engine_name]
            for vp_name, width, height in VIEWPORTS:
                label = f"{engine_name}:{vp_name}"
                stub_state = {"request_id": MARKER, "calls": 0}
                ctx = self._make_context(browser, width, height, stub_state)
                try:
                    page = ctx.new_page()
                    errors: list[str] = []
                    page.on("pageerror", lambda err: errors.append(str(err)))

                    page.goto(self.base_url + "/request.html?unlock_for_test=1", wait_until="domcontentloaded")
                    self._fill_and_submit(page)
                    page.wait_for_timeout(150)

                    pwned = page.evaluate("window.__pwned")
                    self.assertIsNone(pwned, f"window.__pwned set ({pwned!r}) in {label}")
                    self.assertEqual(errors, [], f"pageerror in {label}: {errors}")
                    self.assertEqual(stub_state["calls"], 1, f"expected 1 stubbed POST in {label}")
                    self.assertEqual(
                        page.locator("#successId img").count(),
                        0,
                        f"unexpected <img> inside #successId in {label}",
                    )
                    self.assertEqual(
                        page.locator("#successId strong").text_content(),
                        MARKER,
                        f"request_id markup not shown as literal text in {label}",
                    )
                    self.assertTrue(
                        page.evaluate("document.getElementById('successId').offsetWidth > 0"),
                        f"#successId not visible in {label}",
                    )

                    stub_state["request_id"] = "REQ-2026-0042"
                    page.goto(self.base_url + "/request.html?unlock_for_test=1", wait_until="domcontentloaded")
                    self._fill_and_submit(page)
                    self.assertEqual(
                        page.locator("#successId strong").text_content(),
                        "REQ-2026-0042",
                        f"ordinary request_id broken in {label}",
                    )
                    self.assertIn(
                        "REQ-2026-0042",
                        page.locator("#successId").inner_text(),
                        f"ordinary request_id not visible in {label}",
                    )
                finally:
                    ctx.close()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--site-dir", type=Path, default=ROOT)
    args, _ = parser.parse_known_args()
    RequestSuccessEscapeTest.site_dir = args.site_dir.resolve()
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(RequestSuccessEscapeTest)
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    return 0 if result.wasSuccessful() else 1


if __name__ == "__main__":
    sys.exit(main())
