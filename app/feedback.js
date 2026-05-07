/* ============================================================================
 * AI-Exhibits · Reinforcement Learning & Sliding Puzzles
 * Translation-feedback widget — suggests corrections via the user's mail client (no backend, no tracking).
 *
 * © 2026 Dr. Erika Roldán Roa. All rights reserved by the author.
 * Licensed: CC BY-NC-ND 4.0. See LICENSE.
 * ============================================================================ */

(function () {
  'use strict';

  const MAINTAINER = '[redacted]';

  // The button is added once the DOM is ready.
  function init() {
    if (document.getElementById('fbBtn')) return; // idempotent

    const btn = document.createElement('button');
    btn.id = 'fbBtn';
    btn.type = 'button';
    // Native title tooltip — i18n.js picks up data-i18n-title at language change.
    btn.setAttribute('data-i18n-title', 'feedback.suggestCorrection');
    btn.setAttribute('data-i18n-aria-label', 'feedback.suggestCorrection');
    btn.title = 'Suggest a correction';
    btn.setAttribute('aria-label', 'Suggest a correction');
    btn.textContent = '🔧';
    Object.assign(btn.style, {
      position: 'fixed',
      top: '56px',
      right: '14px',
      zIndex: '9998',
      width: '36px',
      height: '36px',
      borderRadius: '999px',
      background: 'rgba(7, 6, 10, 0.88)',
      color: 'rgba(255,255,255,0.92)',
      border: '1px solid rgba(47, 243, 255, 0.35)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px rgba(47,243,255,0.06) inset',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
      fontSize: '16px',
      fontWeight: '600',
      letterSpacing: '0.3px',
      cursor: 'pointer',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
      transition: 'border-color 0.15s, box-shadow 0.15s'
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.borderColor = 'rgba(47,243,255,0.7)';
      btn.style.boxShadow = '0 4px 16px rgba(0,0,0,0.5), 0 0 12px rgba(47,243,255,0.2)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.borderColor = 'rgba(47,243,255,0.35)';
      btn.style.boxShadow = '0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px rgba(47,243,255,0.06) inset';
    });
    btn.addEventListener('click', openModal);
    document.body.appendChild(btn);
  }

  function openModal() {
    if (document.getElementById('fbOverlay')) return;
    const lang = (document.documentElement.lang || 'fr').toUpperCase();
    const pageUrl = location.href;
    const pageTitle = document.title || '(untitled)';

    const overlay = document.createElement('div');
    overlay.id = 'fbOverlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      background: 'rgba(0,0,0,0.75)',
      zIndex: '10000',
      display: 'grid',
      placeItems: 'center',
      padding: '20px',
      overflowY: 'auto'
    });

    overlay.innerHTML = `
      <div role="dialog" aria-modal="true" aria-labelledby="fbTitle"
        style="background:#0b0714; color:rgba(255,255,255,0.92); padding:26px 28px; border-radius:18px;
               max-width:560px; width:100%; box-shadow: 0 24px 64px rgba(0,0,0,0.6);
               font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
               border:1px solid rgba(47,243,255,0.25);">
        <h3 id="fbTitle" style="margin:0 0 6px; font-size:20px; font-weight:900;">
          🔧 Suggest a correction
        </h3>
        <p style="margin:0 0 16px; font-size:13px; color:rgba(255,255,255,0.65); line-height:1.45;">
          Help us improve the <strong>${lang}</strong> content. Fill the fields below — clicking "Send" opens your
          email client with a prepared message. Dr. Roldán reviews every suggestion and applies
          approved changes to the repo.
        </p>
        <label style="display:block;margin:12px 0 4px;font-size:12px;font-weight:700;letter-spacing:0.3px;color:rgba(47,243,255,0.9);">
          Current text · what you see on the page
        </label>
        <textarea id="fbOrig" rows="2" style="${inputStyle()}"></textarea>

        <label style="display:block;margin:12px 0 4px;font-size:12px;font-weight:700;letter-spacing:0.3px;color:rgba(112,255,122,0.9);">
          Proposed text ·  what it should say
        </label>
        <textarea id="fbProp" rows="2" style="${inputStyle()}" required></textarea>

        <label style="display:block;margin:12px 0 4px;font-size:12px;font-weight:700;letter-spacing:0.3px;color:rgba(255,255,255,0.7);">
          Your name (optional) ·  for attribution in the commit
        </label>
        <input id="fbName" type="text" style="${inputStyle()}" placeholder="First name · Institution" />

        <label style="display:block;margin:12px 0 4px;font-size:12px;font-weight:700;letter-spacing:0.3px;color:rgba(255,255,255,0.7);">
          Note (optional) ·  dialect, register, technical precision
        </label>
        <textarea id="fbNote" rows="2" style="${inputStyle()}"></textarea>

        <div style="display:flex;justify-content:space-between;margin-top:20px;gap:12px;">
          <button id="fbCancel" type="button" style="${cancelStyle()}">Cancel</button>
          <button id="fbSend" type="button" style="${sendStyle()}">Open email →</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.getElementById('fbOrig').focus();

    document.getElementById('fbCancel').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', escClose);

    document.getElementById('fbSend').addEventListener('click', () => {
      const orig = document.getElementById('fbOrig').value.trim();
      const prop = document.getElementById('fbProp').value.trim();
      const name = document.getElementById('fbName').value.trim();
      const note = document.getElementById('fbNote').value.trim();
      if (!prop) {
        alert('Please enter the proposed text.');
        document.getElementById('fbProp').focus();
        return;
      }
      const subject = `[AI-Exhibits RL · ${lang}] Translation correction`;
      const body =
        `Language: ${lang}\n` +
        `Page:     ${pageTitle}\n` +
        `URL:      ${pageUrl}\n\n` +
        `---\nCurrent text:\n${orig || '(not provided)'}\n\n` +
        `Proposed text:\n${prop}\n\n` +
        `Reviewer: ${name || '(anonymous)'}\n\n` +
        `Note:\n${note || '(none)'}\n`;
      const href = 'mailto:' + MAINTAINER +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      // Try to open the mail client AND show a copy-paste fallback in-place,
      // so kiosk / Chromebook / no-mail-handler devices don't lose the user's input.
      try { window.location.href = href; } catch (_) {}
      showMailFallback(href, subject, body);
    });

    function showMailFallback(href, subject, body) {
      const dialog = overlay.querySelector('[role="dialog"]');
      if (!dialog) return;
      if (dialog.querySelector('#fbFallback')) return;
      // Hide the form fields and action buttons; replace with fallback panel.
      Array.from(dialog.children).forEach((el) => {
        if (el.tagName !== 'H3') el.style.display = 'none';
      });
      const fallback = document.createElement('div');
      fallback.id = 'fbFallback';
      fallback.style.cssText = 'margin-top:16px;padding:14px;border-radius:10px;background:rgba(112,255,122,0.06);border:1px solid rgba(112,255,122,0.35);font-size:13px;line-height:1.5;';
      fallback.innerHTML =
        '<div style="font-weight:700;margin-bottom:8px;color:rgba(112,255,160,0.95);">Message prepared ✓</div>' +
        '<div style="margin-bottom:10px;">If your mail client just opened, you can close this. Otherwise, <strong>copy the text below</strong> and email it to <code style="background:rgba(255,255,255,0.08);padding:1px 5px;border-radius:4px;">' + MAINTAINER + '</code>.</div>' +
        '<textarea readonly id="fbFallbackText" style="width:100%;box-sizing:border-box;height:130px;padding:8px;border-radius:8px;background:rgba(0,0,0,0.4);color:#fff;border:1px solid rgba(255,255,255,0.2);font-family:ui-monospace,monospace;font-size:11px;"></textarea>' +
        '<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">' +
        '  <button id="fbCopyBtn" type="button" style="padding:8px 16px;border-radius:999px;background:rgba(47,243,255,0.18);color:rgba(47,243,255,0.95);border:1px solid rgba(47,243,255,0.4);font-weight:600;cursor:pointer;font-size:12px;">Copy to clipboard</button>' +
        '  <a id="fbOpenAnchor" href="' + href + '" style="padding:8px 16px;border-radius:999px;background:transparent;color:rgba(255,255,255,0.75);border:1px solid rgba(255,255,255,0.25);font-weight:600;text-decoration:none;font-size:12px;">Try mail again</a>' +
        '  <button id="fbDoneBtn" type="button" style="margin-left:auto;padding:8px 16px;border-radius:999px;background:linear-gradient(110deg,#ff3bd4,#2ff3ff);color:#07060a;border:none;font-weight:900;cursor:pointer;font-size:12px;">Done</button>' +
        '</div>';
      dialog.appendChild(fallback);
      const ta = fallback.querySelector('#fbFallbackText');
      ta.value = 'To: ' + MAINTAINER + '\nSubject: ' + subject + '\n\n' + body;
      fallback.querySelector('#fbCopyBtn').addEventListener('click', () => {
        ta.select();
        const btn = fallback.querySelector('#fbCopyBtn');
        const done = () => { btn.textContent = 'Copied ✓'; };
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(ta.value).then(done).catch(() => { document.execCommand('copy'); done(); });
          } else {
            document.execCommand('copy'); done();
          }
        } catch (_) { /* ignore */ }
      });
      fallback.querySelector('#fbDoneBtn').addEventListener('click', close);
    }

    function close() {
      overlay.remove();
      document.removeEventListener('keydown', escClose);
    }
    function escClose(e) { if (e.key === 'Escape') close(); }
  }

  function inputStyle() {
    return 'width:100%;box-sizing:border-box;padding:10px 12px;border-radius:10px;' +
           'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.14);' +
           'color:#fff;font-family:inherit;font-size:13px;line-height:1.4;resize:vertical;';
  }
  function cancelStyle() {
    return 'padding:10px 18px;border-radius:999px;background:transparent;color:rgba(255,255,255,0.7);' +
           'border:1px solid rgba(255,255,255,0.2);font-weight:600;cursor:pointer;font-family:inherit;font-size:13px;';
  }
  function sendStyle() {
    return 'padding:10px 22px;border-radius:999px;background:linear-gradient(110deg,#ff3bd4,#2ff3ff);' +
           'color:#07060a;border:none;font-weight:900;letter-spacing:0.5px;cursor:pointer;font-family:inherit;font-size:13px;' +
           'box-shadow:0 0 20px rgba(255,59,212,0.35);';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
