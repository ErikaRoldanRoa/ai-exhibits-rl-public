#!/usr/bin/env python3
"""
test_dmvm_banner.py — regression test for the DMVM-reader banner on the public hub.

CONTRACT (index.html):
  - The banner appears ONLY during a DMVM reading session (arrived via ?ref=dmvm).
  - It survives refresh / in-tab navigation (per-tab sessionStorage flag).
  - It is dismissable with the × button (clears the session flag).
  - It NEVER leaks into a later normal visit — even if the permanent
    localStorage flag (ai_exhibits_dmvm_reader, kept for analytics) is set.
  - The banner text carries no spoiler (no "twelve states" / "douze états").

RUN
  cd public/ && python3 tools/test_dmvm_banner.py
  (requires: playwright + chromium)
"""
import subprocess, sys, time, os

PORT = 8802
PUBLIC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = f"http://localhost:{PORT}/index.html"


def main():
    from playwright.sync_api import sync_playwright
    srv = subprocess.Popen(["python3", "-m", "http.server", str(PORT)],
                           cwd=PUBLIC, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.5)
    R = []
    def ck(name, cond): R.append((name, bool(cond)))
    disp = lambda pg: pg.evaluate("()=>{const e=document.getElementById('dmvmBanner');return e?getComputedStyle(e).display:'MISSING';}")
    try:
        with sync_playwright() as p:
            b = p.chromium.launch()

            # A — arrive via the DMVM door
            A = b.new_context(); pA = A.new_page()
            pA.goto(URL + "?ref=dmvm", wait_until="networkidle"); time.sleep(1.6)
            text = pA.evaluate("()=>{const e=document.getElementById('dmvmBanner');return e?e.innerText.trim():'';}")
            ck("A banner visible on ?ref=dmvm", disp(pA) != "none")
            ck("A session flag set", pA.evaluate("()=>sessionStorage.getItem('ai_exhibits_dmvm_session')") == "true")
            ck("A ?ref stripped from URL", "ref=dmvm" not in pA.url)
            ck("A no spoiler in banner text",
               not any(w in text.lower() for w in ["douze", "twelve", "états", "etats", "states"]))

            # A2 — survives refresh in the same tab session (URL no longer has ?ref)
            pA.goto(URL, wait_until="networkidle"); time.sleep(1.2)
            ck("A2 banner survives in-session refresh", disp(pA) != "none")

            # A3 — × dismisses and stays dismissed
            pA.evaluate("()=>{const c=document.getElementById('dmvmClose'); if(c)c.click();}"); time.sleep(0.5)
            ck("A3 × dismisses banner", disp(pA) == "none")
            pA.goto(URL, wait_until="networkidle"); time.sleep(1.0)
            ck("A4 stays dismissed after ×", disp(pA) == "none")
            A.close()

            # B — normal visit with the permanent flag pre-set: banner must NOT appear
            B = b.new_context()
            B.add_init_script("localStorage.setItem('ai_exhibits_dmvm_reader','true');")
            pB = B.new_page(); pB.goto(URL, wait_until="networkidle"); time.sleep(1.2)
            ck("B no banner on normal visit despite permanent flag", disp(pB) == "none")
            B.close(); b.close()
    finally:
        srv.terminate()

    npass = sum(1 for _, c in R if c)
    for n, c in R:
        print(f"[{'PASS' if c else 'FAIL'}] {n}")
    print(f"\n{npass}/{len(R)} checks passed")
    sys.exit(0 if npass == len(R) else 1)


if __name__ == "__main__":
    main()
