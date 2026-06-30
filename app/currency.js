/* ============================================================================
 * AI-Exhibits · Reinforcement Learning & Sliding Puzzles
 * Currency module — EUR-default / CHF-optional toggle, dependency-free.
 *
 * © 2026 Dr. Erika Roldán Roa. All rights reserved by the author.
 * Licensed: CC BY-NC-ND 4.0. See LICENSE.
 * ============================================================================ */

/* ============================================================================
   CURRENCY TOGGLE — single currency at a time (NEVER a CHF/€ pair)

   Cost is computed in CHF (the base unit). EUR = CHF × CHF_TO_EUR.
   Default = EUR. Choice persists in localStorage (key 'rl-hub-currency',
   mirroring the i18n key 'rl-hub-lang') and is shared across pages.

   Pages with cost figures:
     • inject a toggle into .langSelectorWrap (next to the language switcher)
     • listen for 'currency:applied' to re-render their cost figures
     • call window.currency.applyTokens(root) to fill {cur}/{vXxx} tokens that
       i18n wrote into the DOM (tooltips, prose).
   ============================================================================ */
(function () {
  const SUPPORTED = ['EUR'];
  const DEFAULT = 'EUR';
  const STORAGE_KEY = 'rl-hub-currency';
  // Costs are ORDER-OF-MAGNITUDE estimates (shown with a leading "~"), EUR only.
  //   cost = (Q-updates) x (~1e-11 EUR per update)
  //   per-update: 1000 EUR laptop / (3 yr ~ 1e8 s) / (1e6 updates.s^-1) ~ 1e-11
  //               (hardware-amortised ~1e-12 dominates electricity ~1e-18; the
  //                same figure falls out of AWS t3.medium pricing per update)
  //   step-budgets: Demo ~1e7, Reliable ~1e9-1e10, Guaranteed ~7e13 updates --
  //     the last is a convergence-guarantee budget, conservative against the
  //     worst-case asynchronous-Q sample complexity ~1e15 (Li-Wei-Cai-Chi-Wei
  //     2024, the bound already cited in the paper).
  //   => Demo ~1e-4, Reliable ~1e-2, Guaranteed ~7e2 EUR.
  // Each factor is uncertain by ~10x, so each figure is good to ONE order of
  // magnitude. The lesson is the five-order gap from Demo to Guaranteed.
  const CHF_TO_EUR = 1.0; // identity: EUR-only, kept for the convert() signature

  // Tier step-budgets (formula-derived, order-of-magnitude) x ~1e-11 per update:
  const TIERS = {
    // Demo: ~1e7 updates (~1 s of training) -> ~0,0001
    demo:     { chf: 0.0001, decimals: 4 },
    // Reliable: ~1e9-1e10 updates (minutes) -> ~0,01
    reliable: { chf: 0.01,   decimals: 2 },
    // Guaranteed: ~7e13 updates (convergence-guarantee budget, ~81 days) -> ~700
    proven:   { chf: 700,    round10: true },
  };

  let current = getInitial();

  function getInitial() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.includes(saved)) return saved;
    } catch (e) { /* localStorage unavailable */ }
    return DEFAULT;
  }

  function get() { return current; }

  function decSep() {
    const lang = (document.documentElement.lang || 'fr').slice(0, 2).toLowerCase();
    return lang === 'en' ? '.' : ',';
  }

  // The currency symbol/code, written AFTER the number ("0,01 €" / "0,01 CHF").
  function symbol() { return current === 'EUR' ? '€' : 'CHF'; }

  // Convert a CHF base amount to the selected currency.
  function convert(chfAmount) {
    return current === 'EUR' ? chfAmount * CHF_TO_EUR : chfAmount;
  }

  // Format a numeric amount (already in the selected currency) as a decimal
  // string with the active locale separator. `opts`: {decimals, round10,
  // maxDigits}. No currency symbol is appended here — callers add it.
  function formatNumber(amount, opts) {
    opts = opts || {};
    let s;
    if (opts.round10) {
      s = String(Math.round(amount / 10) * 10);
    } else if (typeof opts.decimals === 'number') {
      s = amount.toFixed(opts.decimals);
    } else {
      // Generic: avoid scientific notation, trim trailing zeros.
      const maxDigits = typeof opts.maxDigits === 'number' ? opts.maxDigits : 9;
      if (amount === 0) s = '0';
      else if (amount < 0.000001) s = amount.toFixed(maxDigits).replace(/\.?0+$/, '');
      else if (amount < 0.001) s = amount.toFixed(6);
      else if (amount < 1) s = amount.toFixed(4);
      else s = amount.toFixed(2);
    }
    return s.replace('.', decSep());
  }

  // Full "value + symbol" string for a CHF base amount, e.g. "0,01 €".
  function format(chfAmount, opts) {
    return formatNumber(convert(chfAmount), opts) + ' ' + symbol();
  }

  // Tier value strings in the SELECTED currency (value + symbol).
  function tierValue(name) {
    const t = TIERS[name];
    if (!t) return '';
    return format(t.chf, t);
  }

  // Token map for prose/tooltip substitution. Keys are placeholders authored
  // identically in all 4 translation JSONs; values are currency-correct.
  //   {cur}      → "€" or "CHF"  (symbol/code only)
  //   {vDemo}    → "0,0001 €"  / "0,0001 CHF"
  //   {vReliable}→ "0,01 €"    / "0,01 CHF"
  //   {vProven}  → "730 €"     / "700 CHF"
  function tokens() {
    return {
      '{cur}': symbol(),
      '{vDemo}': tierValue('demo'),
      '{vReliable}': tierValue('reliable'),
      '{vProven}': tierValue('proven'),
    };
  }

  // Fill currency tokens in any element that carries the raw template. We store
  // the original template on a data-attribute so repeated currency switches
  // re-render from the source (not from already-substituted text).
  //   - textContent templates: mark with data-currency-tpl (auto-captured)
  //   - attribute templates (e.g. data-tip): mark with
  //     data-currency-attr="data-tip" (auto-captured)
  // Substitute currency tokens in an arbitrary string. Idempotent: once tokens
  // are gone, re-running is a no-op. Used by callers that render their own HTML
  // (e.g. the glossary def bodies) so they don't need data-attributes.
  function fill(str) {
    const map = tokens();
    let out = String(str);
    for (const k in map) out = out.split(k).join(map[k]);
    return out;
  }

  function applyTokens(root) {
    root = root || document;
    const sub = fill;
    // Attribute templates (tooltips etc.)
    root.querySelectorAll('[data-currency-attr]').forEach(el => {
      const attr = el.getAttribute('data-currency-attr');
      let tpl = el.getAttribute('data-currency-src');
      if (tpl === null) {
        tpl = el.getAttribute(attr) || '';
        el.setAttribute('data-currency-src', tpl);
      }
      el.setAttribute(attr, sub(tpl));
    });
    // Text-content templates
    root.querySelectorAll('[data-currency-tpl]').forEach(el => {
      let tpl = el.getAttribute('data-currency-src');
      if (tpl === null) {
        tpl = el.innerHTML;
        el.setAttribute('data-currency-src', tpl);
      }
      if (/[<>]/.test(tpl)) el.innerHTML = sub(tpl);
      else el.textContent = sub(tpl);
    });
  }

  function set(cur) {
    if (!SUPPORTED.includes(cur)) cur = DEFAULT;
    current = cur;
    try { localStorage.setItem(STORAGE_KEY, cur); } catch (e) { /* ignore */ }
    syncToggleUI();
    // Re-fill tokens (tooltips/prose) from their captured source templates so
    // the currency symbol/values follow the new selection.
    applyTokens(document);
    document.dispatchEvent(new CustomEvent('currency:applied', { detail: { currency: cur } }));
  }

  function syncToggleUI() {
    document.querySelectorAll('.currencyToggle [data-cur]').forEach(btn => {
      const on = btn.getAttribute('data-cur') === current;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  // Inject the toggle into the .langSelectorWrap (next to the language switcher)
  // on pages that opt in by calling window.currency.mountToggle().
  function mountToggle() {
    const wrap = document.querySelector('.langSelectorWrap');
    if (!wrap || wrap.querySelector('.currencyToggle')) return;
    const aria = (window.i18n && window.i18n.t)
      ? window.i18n.t('common.currencyToggleLabel', 'Devise / Currency')
      : 'Devise / Currency';
    const group = document.createElement('div');
    group.className = 'currencyToggle';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', aria);
    group.setAttribute('data-i18n-aria-label', 'common.currencyToggleLabel');
    group.innerHTML =
      '<button type="button" data-cur="EUR" aria-pressed="true">€</button>' +
      '<button type="button" data-cur="CHF" aria-pressed="false">CHF</button>';
    group.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => set(btn.getAttribute('data-cur')));
    });
    wrap.appendChild(group);
    syncToggleUI();
    return group;
  }

  window.currency = {
    get, set, mountToggle, applyTokens, fill, tokens,
    format, formatNumber, convert, tierValue,
    symbol, decSep,
    CHF_TO_EUR, SUPPORTED, DEFAULT, STORAGE_KEY,
  };

  // i18n rewrites attributes/text on every 'i18n:applied'; re-fill tokens after.
  document.addEventListener('i18n:applied', () => {
    // Drop cached source templates so freshly-translated text is recaptured.
    document.querySelectorAll('[data-currency-src]').forEach(el => el.removeAttribute('data-currency-src'));
    applyTokens(document);
    syncToggleUI();
  });
})();
