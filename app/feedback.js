/* =============================================================================
   AI-Exhibits · Reinforcement Learning & Sliding Puzzles

   🔧 Suggest a correction — backend-routed form.

   POSTs to the AI-Exhibits backend's `submitCorrection` action, which writes
   a row to the Corrections Sheet tab. No mailto, no participant emails
   exposed; reporter email is optional and only used if Dr. Roldán needs
   clarification.

   © 2026 Dr. Erika Roldán Roa. CC BY-NC-ND 4.0.
   ============================================================================= */
(function(){
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbxR84v8EDB4bV5icuTFLuRPZn5g0fwYmQd9fm0vPKkOGERLzldZwkV0JTup3UxFX5g/exec';

  function init() {
    // Bind every feedback trigger: the header button (#fbBtn) and any floating
    // FAB (.fbFab) added on long-scroll pages so feedback stays reachable from
    // the bottom of the page, not only the top toolbar.
    const triggers = document.querySelectorAll('#fbBtn, .fbFab');
    if (!triggers.length) return;
    Array.prototype.forEach.call(triggers, (btn) => btn.addEventListener('click', openModal));
    try { setupNeverCover(triggers); } catch (e) {}
  }

  // Never-cover: a fixed floating trigger (the .fbFab on long index/exhibit pages
  // and the fixed #fbBtn on mission/request pages) must never sit on top of
  // content. Ported from the marmottes gold standard: (1) reserve a bottom spacer
  // so page-end controls never scroll under the button; (2) during scroll the
  // trigger goes ghost (clicks pass through) + dimmed; (3) at rest, if it still
  // overlaps a link/button/text it stays dimmed but clickable — never hidden.
  function setupNeverCover(triggers) {
    const fixed = Array.prototype.filter.call(triggers, (t) => {
      try { return getComputedStyle(t).position === 'fixed'; } catch (e) { return false; }
    });
    if (!fixed.length) return;

    if (!document.getElementById('fbCoverStyle')) {
      const st = document.createElement('style');
      st.id = 'fbCoverStyle';
      st.textContent =
        '.fbDim{opacity:0.28!important;transition:opacity 0.25s ease-out;}' +
        '.fbScrolling{pointer-events:none!important;}' +
        '@media (prefers-reduced-motion: reduce){.fbDim{transition:none;}}';
      document.head.appendChild(st);
    }

    // Reserve space at the page bottom so end-of-page content clears the FAB.
    try {
      if (document.documentElement.scrollHeight > window.innerHeight + 40 && !document.getElementById('fbSpacer')) {
        const sp = document.createElement('div');
        sp.id = 'fbSpacer';
        sp.setAttribute('aria-hidden', 'true');
        sp.style.height = (window.innerWidth <= 600 ? '64px' : '76px');
        document.body.appendChild(sp);
      }
    } catch (e) {}

    const overlaps = (el) => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return false;
      const pts = [
        [r.left + 6, r.top + 6], [r.right - 6, r.top + 6],
        [r.left + 6, r.bottom - 6], [r.right - 6, r.bottom - 6],
        [(r.left + r.right) / 2, (r.top + r.bottom) / 2],
      ];
      const prev = el.style.pointerEvents;
      el.style.pointerEvents = 'none';
      let hit = false;
      for (let i = 0; i < pts.length && !hit; i++) {
        const p = document.elementFromPoint(pts[i][0], pts[i][1]);
        if (!p || p === document.body || p === document.documentElement) continue;
        if (p.closest && p.closest('a,button,summary,input,select,textarea,label')) { hit = true; break; }
        // Direct text only — a large container whose text is elsewhere doesn't count.
        for (let c = p.firstChild; c; c = c.nextSibling) {
          if (c.nodeType === 3 && c.textContent.trim()) { hit = true; break; }
        }
      }
      el.style.pointerEvents = prev;
      return hit;
    };
    const setPresence = () => {
      fixed.forEach((t) => { if (overlaps(t)) t.classList.add('fbDim'); else t.classList.remove('fbDim'); });
    };
    let dimTimer = null;
    window.addEventListener('scroll', () => {
      fixed.forEach((t) => { t.classList.add('fbScrolling'); t.classList.add('fbDim'); });
      clearTimeout(dimTimer);
      dimTimer = setTimeout(() => {
        fixed.forEach((t) => t.classList.remove('fbScrolling'));
        setPresence();
      }, 650);
    }, { passive: true });
    window.addEventListener('resize', () => {
      clearTimeout(dimTimer);
      dimTimer = setTimeout(() => {
        fixed.forEach((t) => t.classList.remove('fbScrolling'));
        setPresence();
      }, 300);
    });
    setTimeout(setPresence, 200);
  }

  function tr(key, fallback) {
    return (window.i18n && window.i18n.t) ? window.i18n.t(key, fallback) : fallback;
  }
  function currentLang() {
    return (document.documentElement.lang || 'fr').slice(0, 2).toLowerCase();
  }

  function openModal() {
    if (document.getElementById('fbOverlay')) return;
    const lang = currentLang();
    // Remember what had focus so we can restore it when the modal closes.
    const prevFocus = document.activeElement;

    // Idempotency key: one UUID per modal open, re-sent on every retry. If the
    // row is committed but the response is dropped (302 → googleusercontent lost
    // on flaky wifi) and the user resubmits, the backend returns the SAME
    // correction_id for a repeat client_id instead of writing a duplicate row.
    let clientId = '';
    try { clientId = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : ''; } catch (e) { clientId = ''; }
    if (!clientId) { clientId = 'c-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10); }

    // Shared send state: inFlight guards close/cancel during a request; ac is the
    // in-flight AbortController (15s timeout + genuine cancel); queuedCount bounds
    // the soft-retry loop on {ok,queued} responses that can never yield an id.
    let inFlight = false, ac = null, queuedCount = 0;

    // Keyboard focus visibility (WCAG 2.4.7) + narrow-screen reporter stacking.
    // Injected once; !important beats the inline outline:none reset on the fields.
    if (!document.getElementById('fbFocusStyle')) {
      const st = document.createElement('style');
      st.id = 'fbFocusStyle';
      st.textContent =
        '#fbOverlay input:focus-visible,#fbOverlay textarea:focus-visible,#fbOverlay select:focus-visible{' +
          'outline:2px solid rgba(47,243,255,0.9)!important;outline-offset:1px;' +
          'border-color:rgba(47,243,255,0.9)!important;box-shadow:0 0 0 3px rgba(47,243,255,0.22);}' +
        '#fbOverlay button:focus-visible{outline:2px solid rgba(47,243,255,0.95);outline-offset:2px;' +
          'box-shadow:0 0 0 3px rgba(47,243,255,0.22);}' +
        '#fbOverlay button:focus:not(:focus-visible){outline:none;}' +
        '@media (max-width:480px){#fbOverlay .fbReporterRow{grid-template-columns:1fr!important;}}';
      document.head.appendChild(st);
    }

    const overlay = document.createElement('div');
    overlay.id = 'fbOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'fbTitle');
    Object.assign(overlay.style, {
      position: 'fixed', inset: '0', zIndex: '99999',
      background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    });
    // No backdrop-to-close: an accidental click on the backdrop must never
    // discard an in-progress comment. Close only via Cancel or Escape, both
    // routed through confirmClose() (unsaved-work guard + in-flight guard).

    const card = document.createElement('div');
    Object.assign(card.style, {
      background: 'rgba(14, 11, 22, 0.98)',
      border: '1px solid rgba(47, 243, 255, 0.35)',
      borderRadius: '14px',
      maxWidth: '560px', width: '100%',
      maxHeight: '90vh', overflowY: 'auto',
      padding: '22px 26px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.65)',
      color: 'rgba(255,255,255,0.92)',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    });

    const title = document.createElement('h3');
    title.id = 'fbTitle';
    // Decorative emoji wrapped in aria-hidden so the dialog's accessible name
    // (via aria-labelledby) is just the translated title, not "wrench Envoyer…".
    const titleIcon = document.createElement('span');
    titleIcon.setAttribute('aria-hidden', 'true');
    titleIcon.textContent = '🔧 ';
    title.appendChild(titleIcon);
    title.appendChild(document.createTextNode(tr('feedback.title', 'Envoyer un retour')));
    Object.assign(title.style, { margin: '0 0 6px 0', fontSize: '18px', fontWeight: '700', color: 'rgba(47,243,255,0.95)' });
    card.appendChild(title);

    const sub = document.createElement('div');
    sub.textContent = tr('feedback.subtitle',
      "Traduction, bug, commentaire ou suggestion — tout aide.");
    Object.assign(sub.style, { fontSize: '12px', color: 'rgba(255,255,255,0.78)', marginBottom: '14px', lineHeight: '1.5' });
    card.appendChild(sub);

    const mkLabel = (txt, forId) => {
      const l = document.createElement('label');
      l.textContent = txt;
      if (forId) l.htmlFor = forId;
      Object.assign(l.style, { display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.72)', marginBottom: '4px', marginTop: '12px', letterSpacing: '0.3px' });
      return l;
    };
    const mkInputStyles = {
      width: '100%', padding: '9px 11px',
      background: 'rgba(7,6,10,0.85)',
      border: '1px solid rgba(255,255,255,0.16)',
      borderRadius: '8px',
      color: 'rgba(255,255,255,0.92)',
      fontSize: '13px', fontFamily: 'inherit',
      outline: 'none', boxSizing: 'border-box',
    };
    // Live 'n / 1000' character counter under each textarea.
    const mkCounter = () => {
      const c = document.createElement('div');
      Object.assign(c.style, { fontSize: '10px', color: 'rgba(255,255,255,0.5)', textAlign: 'right', marginTop: '2px' });
      c.setAttribute('aria-hidden', 'true');
      return c;
    };
    // Live counter with proximity warning: amber near the 1000-char cap, red at
    // it, so the silent maxLength truncation is never a surprise (marmottes gold).
    const updateCount = (field, el) => {
      const n = field.value ? field.value.length : 0;
      el.textContent = n + ' / 1000';
      el.style.color = n >= 1000 ? 'rgba(255,138,138,0.95)'
        : (n >= 900 ? 'rgba(224,168,58,0.95)' : 'rgba(255,255,255,0.5)');
    };

    // Context — auto-filled, not editable
    const ctx = document.createElement('div');
    ctx.textContent = tr('feedback.context', 'Page :') + ' ' + location.pathname + '  ·  ' + tr('feedback.langLabel', 'Langue :') + ' ' + lang.toUpperCase();
    Object.assign(ctx.style, { fontFamily: 'ui-monospace, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.72)', padding: '6px 10px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', marginBottom: '4px' });
    card.appendChild(ctx);

    // Issue type
    card.appendChild(mkLabel(tr('feedback.type', "Type"), 'fbType'));
    const typeSel = document.createElement('select');
    typeSel.id = 'fbType';
    Object.assign(typeSel.style, mkInputStyles);
    typeSel.style.appearance = 'none';
    typeSel.style.webkitAppearance = 'none';
    // appearance:none strips the native dropdown caret — restore a chevron.
    typeSel.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='none' stroke='%23bfc3c9' stroke-width='1.6' d='M1 1.5 6 6.5 11 1.5'/%3E%3C/svg%3E\")";
    typeSel.style.backgroundRepeat = 'no-repeat';
    typeSel.style.backgroundPosition = 'right 11px center';
    typeSel.style.paddingRight = '30px';
    // 'comment' first = default, matching the widget's stated purpose (a plain
    // comment must not be mis-filed as a 'translation' ticket).
    typeSel.innerHTML =
      '<option value="comment">' + tr('feedback.type.comment', 'Commentaire') + '</option>' +
      '<option value="suggestion">' + tr('feedback.type.suggestion', 'Suggestion') + '</option>' +
      '<option value="translation">' + tr('feedback.type.translation', 'Traduction') + '</option>' +
      '<option value="factual">' + tr('feedback.type.factual', 'Erreur factuelle') + '</option>' +
      '<option value="accessibility">' + tr('feedback.type.a11y', 'Accessibilité') + '</option>' +
      '<option value="broken-link">' + tr('feedback.type.brokenLink', 'Lien cassé') + '</option>' +
      '<option value="design">' + tr('feedback.type.design', 'Design / mise en page') + '</option>' +
      '<option value="other">' + tr('feedback.type.other', 'Autre') + '</option>';
    card.appendChild(typeSel);

    // What's wrong (the only required field)
    card.appendChild(mkLabel(tr('feedback.issue', "Qu'est-ce qui ne va pas ? *"), 'fbIssue'));
    const issueText = document.createElement('textarea');
    issueText.id = 'fbIssue';
    issueText.setAttribute('aria-required', 'true');
    issueText.setAttribute('aria-describedby', 'fbStatus');
    Object.assign(issueText.style, mkInputStyles, { minHeight: '70px', resize: 'vertical' });
    issueText.maxLength = 1000;
    card.appendChild(issueText);
    const issueCount = mkCounter();
    card.appendChild(issueCount);
    issueText.addEventListener('input', () => {
      issueText.removeAttribute('aria-invalid');
      updateCount(issueText, issueCount);
    });
    updateCount(issueText, issueCount);

    // Suggested fix
    card.appendChild(mkLabel(tr('feedback.fix', 'Suggestion de correction'), 'fbFix'));
    const fixText = document.createElement('textarea');
    fixText.id = 'fbFix';
    Object.assign(fixText.style, mkInputStyles, { minHeight: '70px', resize: 'vertical' });
    fixText.maxLength = 1000;
    card.appendChild(fixText);
    const fixCount = mkCounter();
    card.appendChild(fixCount);
    fixText.addEventListener('input', () => updateCount(fixText, fixCount));
    updateCount(fixText, fixCount);

    // Optional reporter
    const reporterRow = document.createElement('div');
    reporterRow.className = 'fbReporterRow';
    Object.assign(reporterRow.style, { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' });
    const nameWrap = document.createElement('div');
    nameWrap.appendChild(mkLabel(tr('feedback.name', 'Votre nom (optionnel)'), 'fbName'));
    const nameInp = document.createElement('input');
    nameInp.id = 'fbName';
    nameInp.type = 'text'; nameInp.maxLength = 100;
    Object.assign(nameInp.style, mkInputStyles);
    nameWrap.appendChild(nameInp);
    const emailWrap = document.createElement('div');
    emailWrap.appendChild(mkLabel(tr('feedback.email', 'Votre email (optionnel)'), 'fbEmail'));
    const emailInp = document.createElement('input');
    emailInp.id = 'fbEmail';
    emailInp.type = 'email'; emailInp.maxLength = 120;
    Object.assign(emailInp.style, mkInputStyles);
    // Clear the invalid flag as soon as the reporter edits the field (mirrors
    // issueText), so assistive tech doesn't keep announcing a fixed error.
    emailInp.addEventListener('input', () => emailInp.removeAttribute('aria-invalid'));
    emailWrap.appendChild(emailInp);
    reporterRow.appendChild(nameWrap);
    reporterRow.appendChild(emailWrap);
    card.appendChild(reporterRow);

    // Honeypot — offscreen, aria-hidden, untabbable. autocomplete='off' is
    // essential: some browsers/password managers autofill unlabeled text inputs
    // regardless of position, and a filled honeypot makes the backend silently
    // drop a legitimate comment as bot traffic ({ok,queued} with no id). Matches
    // the marmottes gold-standard honeypot.
    const hp = document.createElement('input');
    hp.type = 'text'; hp.name = 'hp';
    hp.setAttribute('autocomplete', 'off');
    Object.assign(hp.style, { position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: '0', pointerEvents: 'none' });
    hp.setAttribute('tabindex', '-1');
    hp.setAttribute('aria-hidden', 'true');
    card.appendChild(hp);

    // Status pill
    const status = document.createElement('div');
    status.id = 'fbStatus';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    Object.assign(status.style, { fontSize: '12px', minHeight: '18px', margin: '12px 0 4px', textAlign: 'center', fontWeight: '600' });
    card.appendChild(status);
    const setStatus = (state, text) => {
      status.textContent = text || '';
      const colors = { ok: 'rgba(112,255,138,0.95)', bad: 'rgba(255,138,138,0.95)', checking: 'rgba(255,255,255,0.7)' };
      status.style.color = colors[state] || '';
    };

    // Protected close (Cancel + Escape). Mid-send: FREEZE all close paths so a
    // stray Escape or Cancel can't silently abort+discard a comment the user
    // already clicked Send on (the backend may already be committing the row).
    // The 15s timeout and the success/error message own the request's lifecycle
    // (marmottes gold standard). Cancel is also visually disabled during a send.
    // When idle: if a non-trivial comment is typed, confirm before discarding
    // it (no draft persistence, the backend does not de-dupe on content).
    const confirmClose = () => {
      if (inFlight) return;
      const pending = ((issueText.value || '') + '\n' + (fixText.value || '')).trim();
      if (pending.length >= 3) {
        let ok = true;
        try { ok = window.confirm(tr('feedback.confirmDiscard', 'Abandonner ce commentaire ? Il ne sera pas envoyé.')); } catch (e) {}
        if (!ok) return;
      }
      try { if (ac) ac.abort(); } catch (e) {}
      close();
    };

    // Copy-to-clipboard fallback: shown only when the backend keeps returning
    // {ok,queued} (shared-bucket rate-limit at a live workshop, or a silent
    // drop). Send stays enabled for a retry, but this lets a reporter rescue the
    // text they typed so a throttled comment is never stranded. No hardcoded
    // email here (that address is a separately-queued public-repo patch).
    let copyBtn = null;
    const showCopyFallback = () => {
      if (copyBtn) return;
      copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.textContent = tr('feedback.copyText', 'Copier mon texte');
      Object.assign(copyBtn.style, { display: 'block', margin: '8px auto 0', padding: '8px 16px', borderRadius: '999px', border: '1px solid rgba(47,243,255,0.5)', background: 'transparent', color: 'rgba(47,243,255,0.95)', cursor: 'pointer', fontSize: '12px' });
      copyBtn.addEventListener('click', async () => {
        const payload = ((issueText.value || '') + (fixText.value ? '\n\n' + fixText.value : '')).trim();
        let done = false;
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(payload); done = true; }
        } catch (e) {}
        if (!done) {
          try { issueText.focus(); issueText.select(); done = !!(document.execCommand && document.execCommand('copy')); } catch (e) {}
        }
        if (done) setStatus('ok', tr('feedback.copied', 'Texte copié !'));
      });
      status.insertAdjacentElement('afterend', copyBtn);
    };

    // Actions
    const actions = document.createElement('div');
    Object.assign(actions.style, { display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' });
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.textContent = tr('feedback.cancel', 'Annuler');
    Object.assign(cancelBtn.style, { padding: '10px 18px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.18)', background: 'transparent', color: 'rgba(255,255,255,0.85)', cursor: 'pointer', fontSize: '13px' });
    cancelBtn.addEventListener('click', confirmClose);

    const sendBtn = document.createElement('button');
    sendBtn.type = 'button';
    sendBtn.textContent = tr('feedback.send', 'Envoyer');
    Object.assign(sendBtn.style, { padding: '10px 22px', borderRadius: '999px', border: '1px solid rgba(47,243,255,0.7)', background: 'linear-gradient(135deg, rgba(47,243,255,0.18), rgba(255,59,212,0.12))', color: 'rgba(255,255,255,0.98)', cursor: 'pointer', fontSize: '13px', fontWeight: '700', letterSpacing: '0.2px' });
    sendBtn.addEventListener('click', async () => {
      if (inFlight) return;
      const txt = (issueText.value || '').trim();
      if (txt.length < 3) {
        setStatus('bad', tr('feedback.errEmpty', "Décrivez l'erreur en quelques mots."));
        issueText.setAttribute('aria-invalid', 'true');
        try { issueText.focus(); } catch (e) {}
        return;
      }
      // Optional reporter email: the backend silently drops a malformed address
      // and still returns a correction_id, so the reporter would see 'Merci'
      // while their one follow-up channel is lost. Validate with the SAME regex
      // as the backend and refuse rather than send a dead contact.
      const emailVal = (emailInp.value || '').trim();
      if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        setStatus('bad', tr('feedback.errEmail', 'Vérifiez votre email ou laissez-le vide.'));
        emailInp.setAttribute('aria-invalid', 'true');
        try { emailInp.focus(); } catch (e) {}
        return;
      }
      inFlight = true;
      sendBtn.disabled = true;
      cancelBtn.disabled = true;
      setStatus('checking', tr('feedback.sending', 'Envoi en cours…'));
      // 15s timeout: a hung request on saturated workshop wifi (or a captive
      // portal) must never freeze the widget with Send disabled forever.
      let timer = null;
      try { ac = new AbortController(); } catch (e) { ac = null; }
      if (ac) { timer = setTimeout(() => { try { ac.abort(); } catch (e) {} }, 15000); }
      const reenable = () => { inFlight = false; sendBtn.disabled = false; cancelBtn.disabled = false; };
      const stillOpen = () => document.body.contains(overlay);
      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'submitCorrection',
            url: location.pathname,
            lang: lang,
            issue_type: typeSel.value,
            issue_text: txt,
            suggested_fix: fixText.value,
            reporter_name: nameInp.value,
            reporter_email: emailInp.value,
            hp: hp.value,
            origin: location.origin,
            client_id: clientId,
          }),
          redirect: 'follow',
          signal: ac ? ac.signal : undefined,
        });
        const data = await res.json();
        if (timer) { clearTimeout(timer); timer = null; }
        // User cancelled/aborted mid-send → modal detached; ignore late response
        // (prevents writing status onto detached DOM nodes / a false 'Merci').
        if (!stillOpen()) return;
        if (data && data.status === 'ok' && data.correction_id) {
          inFlight = false;
          cancelBtn.disabled = false;
          setStatus('ok', tr('feedback.thanks', 'Merci. Votre suggestion a été enregistrée.'));
          setTimeout(close, 1500);
        } else if (data && data.status === 'ok' && data.queued) {
          // {ok, queued} without a correction_id = the row was NOT written:
          // honeypot / disallowed origin / too-short / rate-limit (60/hr per
          // origin+lang+path — a whole workshop SHARES one bucket, so this is the
          // COMMON path at a live event, not an edge case). A rate-limit clears
          // with time, so NEVER hard-lock Send — keep it re-enablable for a retry.
          // After a couple of misses, surface a copy-to-clipboard fallback so a
          // throttled comment is never stranded (the textarea also stays filled).
          queuedCount++;
          reenable();
          if (queuedCount >= 2) {
            setStatus('bad', tr('feedback.errUnsaved',
              "Votre retour n'a pas encore pu être enregistré. Réessayez dans un moment, ou copiez votre texte pour ne pas le perdre."));
            showCopyFallback();
          } else {
            setStatus('checking', tr('feedback.busy', 'Trop de retours pour le moment — réessayez dans un instant.'));
          }
        } else {
          reenable();
          setStatus('bad', tr('feedback.errGeneric', 'Échec. Réessayez plus tard.'));
        }
      } catch (err) {
        if (timer) { clearTimeout(timer); timer = null; }
        if (!stillOpen()) return; // aborted via Cancel/Escape: nothing to report
        reenable();
        setStatus('bad', tr('feedback.errNetwork', 'Erreur réseau. Réessayez plus tard.'));
      }
    });
    actions.appendChild(cancelBtn);
    actions.appendChild(sendBtn);
    card.appendChild(actions);

    // Escape to close + Tab focus trap (keep keyboard focus inside the modal).
    const escHandler = (e) => {
      if (e.key === 'Escape') { confirmClose(); return; }
      if (e.key !== 'Tab') return;
      const nodes = card.querySelectorAll('button, [href], input, select, textarea, [tabindex]');
      const focusable = Array.prototype.filter.call(nodes, (el) =>
        el.getAttribute('tabindex') !== '-1' && !el.disabled && el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', escHandler);
    overlay._escHandler = escHandler;
    overlay._prevFocus = prevFocus;

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    // Scroll-lock the page behind the modal (wheel/touch no longer leaks to
    // <body> — worse on long mission/exhibit pages and on mobile).
    overlay._prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Make the rest of the page inert + hidden from screen readers. aria-modal
    // alone does NOT stop VoiceOver/NVDA browse-mode from reaching background
    // content; inert + aria-hidden on every sibling of the overlay does.
    const inerted = [];
    for (let ci = 0; ci < document.body.children.length; ci++) {
      const kid = document.body.children[ci];
      if (kid === overlay) continue;
      if (kid.getAttribute('aria-hidden') === 'true') continue; // already hidden; don't restore by mistake
      try { kid.setAttribute('aria-hidden', 'true'); } catch (e) {}
      try { kid.inert = true; } catch (e) {}
      inerted.push(kid);
    }
    overlay._inerted = inerted;

    setTimeout(() => { try { issueText.focus(); } catch(e){} }, 60);
  }

  function close() {
    const ov = document.getElementById('fbOverlay');
    if (ov) {
      if (ov._escHandler) document.removeEventListener('keydown', ov._escHandler);
      // Restore page scroll.
      document.body.style.overflow = ov._prevOverflow || '';
      // Re-expose the background to screen readers / re-enable interaction.
      if (ov._inerted) {
        for (let i = 0; i < ov._inerted.length; i++) {
          const kid = ov._inerted[i];
          try { kid.removeAttribute('aria-hidden'); } catch (e) {}
          try { kid.inert = false; } catch (e) {}
        }
      }
      const prev = ov._prevFocus;
      ov.remove();
      // Restore focus to the trigger (or wherever focus was) for keyboard users.
      if (prev && typeof prev.focus === 'function') { try { prev.focus(); } catch (e) {} }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
