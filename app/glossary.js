/* ============================================================================
 * AI-Exhibits · Reinforcement Learning & Sliding Puzzles
 * Shared chip-based glossary — same widget across hub + all three trainers.
 * The glossary GROWS per mission: each page declares which chips to show.
 *
 * © 2026 Dr. Erika Roldán Roa. All rights reserved by the author.
 * Licensed: CC BY-NC-ND 4.0. See LICENSE.
 * ============================================================================ */

(function () {
  'use strict';

  // chipKey → { i18n key for chip label, i18n key for body HTML }
  // Hub terms reuse the existing hub.glossary.* HTML strings + hub.intel.chip.* labels.
  // Mission terms reuse the per-mission glossary keys we already ship.
  const REGISTRY = {
    agent:          { label: 'hub.intel.chip.agent',          body: 'hub.glossary.agent' },
    state:          { label: 'hub.intel.chip.state',          body: 'hub.glossary.state' },
    action:         { label: 'hub.intel.chip.action',         body: 'hub.glossary.action' },
    policy:         { label: 'hub.intel.chip.policy',         body: 'hub.glossary.policy' },
    rl:             { label: 'hub.intel.chip.rl',             body: 'hub.glossary.rl' },
    q:              { label: 'hub.intel.chip.q',              body: 'hub.glossary.q' },
    episode:        { label: 'ex2x3.glossary.episode.term',        body: 'ex2x3.glossary.episode.def' },
    propagation:    { label: 'ex2x3.glossary.propagation.term',    body: 'ex2x3.glossary.propagation.def' },
    convergence:    { label: 'ex2x3.glossary.convergence.term',    body: 'ex2x3.glossary.convergence.def' },
    curse:          { label: 'ex3x3.glossary.curse.term',          body: 'ex3x3.glossary.curse.def' },
    generalisation: { label: 'ex3x3.glossary.generalisation.term', body: 'ex3x3.glossary.generalisation.def' },
    budget:         { label: 'ex3x3.glossary.budget.term',         body: 'ex3x3.glossary.budget.def' },
  };

  function tr(key, fallback) {
    if (window.i18n && typeof window.i18n.t === 'function') {
      return window.i18n.t(key, fallback);
    }
    return fallback || '';
  }

  // For a mission term whose body is a plain text def (no upper-case keyword
  // header), wrap it the same way the hub bodies are rendered so all panels
  // share one visual rhythm.
  function bodyHtml(key) {
    const labelKey = REGISTRY[key].label;
    const bodyKey  = REGISTRY[key].body;
    const labelText = tr(labelKey, key);
    const bodyText  = tr(bodyKey, '');
    // Hub bodies are already rich HTML with a `<div class="mono">HEADER</div>`;
    // detect that and pass through. Mission `def` strings are plain prose — wrap them.
    if (/<div\s+class=["']mono["']/.test(bodyText)) return bodyText;
    return '<div class="mono" style="opacity:.9; margin-bottom:6px;">' +
           labelText.toUpperCase() +
           '</div><div>' + bodyText + '</div>';
  }

  function buildMarkup(rootEl, chipKeys, defaultActive) {
    const titleHtml =
      '<div class="vocabWrap">' +
        '<div class="vocabTitle mono" style="display:flex; align-items:center; justify-content:space-between; gap:12px;">' +
          '<span data-i18n="glossary.cardTitle">Glossaire — termes Q-learning</span>' +
          '<button class="btn ghost mono" type="button" data-glossary-toggle data-i18n="glossary.show">Afficher</button>' +
        '</div>' +
        '<div class="vocabChips" role="tablist"></div>' +
        '<div class="vocabPanel hidden" role="tabpanel"></div>' +
      '</div>';
    rootEl.innerHTML = titleHtml;

    const chipsBox = rootEl.querySelector('.vocabChips');
    const panel = rootEl.querySelector('.vocabPanel');
    const toggleBtn = rootEl.querySelector('[data-glossary-toggle]');

    chipKeys.forEach((k, idx) => {
      const reg = REGISTRY[k];
      if (!reg) { return; }
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip' + (k === defaultActive ? ' active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('data-term', k);
      btn.setAttribute('aria-selected', k === defaultActive ? 'true' : 'false');
      btn.setAttribute('data-i18n', reg.label);
      btn.textContent = tr(reg.label, k);
      chipsBox.appendChild(btn);
    });

    function setActive(term) {
      Array.from(chipsBox.querySelectorAll('.chip')).forEach(b => {
        const on = b.dataset.term === term;
        b.classList.toggle('active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      panel.innerHTML = bodyHtml(term);
      panel.setAttribute('data-active-term', term);
    }

    function expandPanelIfHidden() {
      if (!panel.classList.contains('hidden')) return;
      panel.classList.remove('hidden');
      if (toggleBtn) {
        toggleBtn.setAttribute('data-i18n', 'glossary.hide');
        toggleBtn.textContent = tr('glossary.hide', 'Masquer');
      }
    }

    chipsBox.addEventListener('click', e => {
      const btn = e.target.closest('.chip[data-term]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      expandPanelIfHidden();
      setActive(btn.dataset.term);
    }, true);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const hidden = panel.classList.toggle('hidden');
        toggleBtn.setAttribute('data-i18n', hidden ? 'glossary.show' : 'glossary.hide');
        toggleBtn.textContent = tr(hidden ? 'glossary.show' : 'glossary.hide', hidden ? 'Afficher' : 'Masquer');
      });
    }

    // Re-render on language change so chips + body follow the active language.
    document.addEventListener('i18n:applied', () => {
      const active = chipsBox.querySelector('.chip.active');
      const term = active ? active.dataset.term : defaultActive;
      // Update chip labels
      Array.from(chipsBox.querySelectorAll('.chip[data-term]')).forEach(b => {
        const reg = REGISTRY[b.dataset.term];
        if (reg) b.textContent = tr(reg.label, b.dataset.term);
      });
      // Re-render active body
      if (term) panel.innerHTML = bodyHtml(term);
    });

    setActive(defaultActive);
  }

  function render(rootEl, opts) {
    if (!rootEl) return;
    const chips = (opts && opts.chips) || ['agent', 'state', 'action', 'q'];
    const defaultActive = (opts && opts.defaultActive) || chips[0];
    buildMarkup(rootEl, chips, defaultActive);
  }

  window.AIGlossary = { render: render, REGISTRY: REGISTRY };
})();
