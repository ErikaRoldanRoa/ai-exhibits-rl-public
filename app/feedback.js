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
    const btn = document.getElementById('fbBtn');
    if (!btn) return;
    btn.addEventListener('click', openModal);
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
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

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
    title.textContent = '🔧 ' + tr('feedback.title', 'Envoyer un retour');
    Object.assign(title.style, { margin: '0 0 6px 0', fontSize: '18px', fontWeight: '700', color: 'rgba(47,243,255,0.95)' });
    card.appendChild(title);

    const sub = document.createElement('div');
    sub.textContent = tr('feedback.subtitle',
      "Traduction, bug, commentaire ou suggestion — tout aide.");
    Object.assign(sub.style, { fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginBottom: '14px', lineHeight: '1.5' });
    card.appendChild(sub);

    const mkLabel = (txt) => {
      const l = document.createElement('label');
      l.textContent = txt;
      Object.assign(l.style, { display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px', marginTop: '12px', letterSpacing: '0.3px' });
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

    // Context — auto-filled, not editable
    const ctx = document.createElement('div');
    ctx.textContent = tr('feedback.context', 'Page :') + ' ' + location.pathname + '  ·  ' + tr('feedback.langLabel', 'Langue :') + ' ' + lang.toUpperCase();
    Object.assign(ctx.style, { fontFamily: 'ui-monospace, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.55)', padding: '6px 10px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', marginBottom: '4px' });
    card.appendChild(ctx);

    // Issue type
    card.appendChild(mkLabel(tr('feedback.type', "Type")));
    const typeSel = document.createElement('select');
    Object.assign(typeSel.style, mkInputStyles);
    typeSel.style.appearance = 'none';
    typeSel.innerHTML =
      '<option value="translation">' + tr('feedback.type.translation', 'Traduction') + '</option>' +
      '<option value="factual">' + tr('feedback.type.factual', 'Erreur factuelle') + '</option>' +
      '<option value="accessibility">' + tr('feedback.type.a11y', 'Accessibilité') + '</option>' +
      '<option value="broken-link">' + tr('feedback.type.brokenLink', 'Lien cassé') + '</option>' +
      '<option value="comment">' + tr('feedback.type.comment', 'Commentaire') + '</option>' +
      '<option value="suggestion">' + tr('feedback.type.suggestion', 'Suggestion') + '</option>' +
      '<option value="other">' + tr('feedback.type.other', 'Autre') + '</option>';
    card.appendChild(typeSel);

    // What's wrong
    card.appendChild(mkLabel(tr('feedback.issue', "Qu'est-ce qui ne va pas ? *")));
    const issueText = document.createElement('textarea');
    Object.assign(issueText.style, mkInputStyles, { minHeight: '70px', resize: 'vertical' });
    issueText.maxLength = 1000;
    card.appendChild(issueText);

    // Suggested fix
    card.appendChild(mkLabel(tr('feedback.fix', 'Suggestion de correction')));
    const fixText = document.createElement('textarea');
    Object.assign(fixText.style, mkInputStyles, { minHeight: '70px', resize: 'vertical' });
    fixText.maxLength = 1000;
    card.appendChild(fixText);

    // Optional reporter
    const reporterRow = document.createElement('div');
    Object.assign(reporterRow.style, { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' });
    const nameWrap = document.createElement('div');
    nameWrap.appendChild(mkLabel(tr('feedback.name', 'Votre nom (optionnel)')));
    const nameInp = document.createElement('input');
    nameInp.type = 'text'; nameInp.maxLength = 100;
    Object.assign(nameInp.style, mkInputStyles);
    nameWrap.appendChild(nameInp);
    const emailWrap = document.createElement('div');
    emailWrap.appendChild(mkLabel(tr('feedback.email', 'Votre email (optionnel)')));
    const emailInp = document.createElement('input');
    emailInp.type = 'email'; emailInp.maxLength = 120;
    Object.assign(emailInp.style, mkInputStyles);
    emailWrap.appendChild(emailInp);
    reporterRow.appendChild(nameWrap);
    reporterRow.appendChild(emailWrap);
    card.appendChild(reporterRow);

    // Honeypot
    const hp = document.createElement('input');
    hp.type = 'text'; hp.name = 'hp';
    Object.assign(hp.style, { position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: '0', pointerEvents: 'none' });
    hp.setAttribute('tabindex', '-1');
    hp.setAttribute('aria-hidden', 'true');
    card.appendChild(hp);

    // Status pill
    const status = document.createElement('div');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    Object.assign(status.style, { fontSize: '12px', minHeight: '18px', margin: '12px 0 4px', textAlign: 'center', fontWeight: '600' });
    card.appendChild(status);
    const setStatus = (state, text) => {
      status.textContent = text || '';
      const colors = { ok: 'rgba(112,255,138,0.95)', bad: 'rgba(255,138,138,0.95)', checking: 'rgba(255,255,255,0.7)' };
      status.style.color = colors[state] || '';
    };

    // Actions
    const actions = document.createElement('div');
    Object.assign(actions.style, { display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' });
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.textContent = tr('feedback.cancel', 'Annuler');
    Object.assign(cancelBtn.style, { padding: '10px 18px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.18)', background: 'transparent', color: 'rgba(255,255,255,0.85)', cursor: 'pointer', fontSize: '13px' });
    cancelBtn.addEventListener('click', close);

    const sendBtn = document.createElement('button');
    sendBtn.type = 'button';
    sendBtn.textContent = tr('feedback.send', 'Envoyer');
    Object.assign(sendBtn.style, { padding: '10px 22px', borderRadius: '999px', border: '1px solid rgba(47,243,255,0.7)', background: 'linear-gradient(135deg, rgba(47,243,255,0.18), rgba(255,59,212,0.12))', color: 'rgba(255,255,255,0.98)', cursor: 'pointer', fontSize: '13px', fontWeight: '700', letterSpacing: '0.2px' });
    sendBtn.addEventListener('click', async () => {
      const txt = (issueText.value || '').trim();
      if (txt.length < 3) {
        setStatus('bad', tr('feedback.errEmpty', "Décrivez l'erreur en quelques mots."));
        return;
      }
      sendBtn.disabled = true;
      setStatus('checking', tr('feedback.sending', 'Envoi en cours…'));
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
          }),
          redirect: 'follow',
        });
        const data = await res.json();
        if (data && data.status === 'ok' && data.correction_id) {
          setStatus('ok', tr('feedback.thanks', 'Merci. Votre suggestion a été enregistrée.'));
          setTimeout(close, 1500);
        } else {
          setStatus('bad', tr('feedback.errGeneric', 'Échec. Réessayez plus tard.'));
          sendBtn.disabled = false;
        }
      } catch (err) {
        setStatus('bad', tr('feedback.errNetwork', 'Erreur réseau. Réessayez plus tard.'));
        sendBtn.disabled = false;
      }
    });
    actions.appendChild(cancelBtn);
    actions.appendChild(sendBtn);
    card.appendChild(actions);

    // Escape to close
    const escHandler = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', escHandler);
    overlay._escHandler = escHandler;

    overlay.appendChild(card);
    document.body.appendChild(overlay);
    setTimeout(() => { try { issueText.focus(); } catch(e){} }, 60);
  }

  function close() {
    const ov = document.getElementById('fbOverlay');
    if (ov) {
      if (ov._escHandler) document.removeEventListener('keydown', ov._escHandler);
      ov.remove();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
