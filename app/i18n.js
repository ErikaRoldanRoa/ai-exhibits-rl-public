/* ============================================================================
 * AI-Exhibits · Reinforcement Learning & Sliding Puzzles
 * Internationalisation system — locale switch, translation loader, DOM hydration.
 *
 * © 2026 Dr. Erika Roldán Roa. All rights reserved by the author.
 * Licensed: CC BY-NC-ND 4.0. See LICENSE.
 * ============================================================================ */

/* ============================================================================
   RL MISSION HUB — i18n (vanilla, dependency-free)
   Supported: fr (live), en, de, it (skeletons)
   Lookup order: ?lang=xx → localStorage → DEFAULT (fr)
   ============================================================================ */
(function () {
  const SUPPORTED = ['fr', 'en', 'de', 'it'];
  const DEFAULT = 'fr';
  const STORAGE_KEY = 'rl-hub-lang';
  let currentDict = null;

  function getInitialLang() {
    // 1. URL override: ?lang=xx
    const urlLang = new URLSearchParams(location.search).get('lang');
    if (urlLang && SUPPORTED.includes(urlLang)) return urlLang;
    // 2. User's previous choice (persists across visits)
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
    // 3. Browser's preferred language (auto-detected)
    const browserLangs = navigator.languages || [navigator.language || ''];
    for (const bl of browserLangs) {
      const two = (bl || '').slice(0, 2).toLowerCase();
      if (SUPPORTED.includes(two)) return two;
    }
    // 4. Fallback
    return DEFAULT;
  }

  function byPath(obj, path) {
    if (!obj || !path) return null;
    return path.split('.').reduce(
      (o, k) => (o && o[k] !== undefined && o[k] !== null) ? o[k] : null,
      obj
    );
  }

  async function loadTranslations(lang) {
    // Honour an optional base path so files in subfolders (e.g. /print/) can
    // still reach /translations/. Set window.__i18nBase before this script
    // loads, e.g. <script>window.__i18nBase='../';</script>.
    const base = (typeof window !== 'undefined' && window.__i18nBase) || './';
    try {
      const res = await fetch(`${base}translations/${lang}.json`, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn(`[i18n] Could not load ${lang}.json (${e.message})`);
      if (lang !== DEFAULT) return loadTranslations(DEFAULT);
      return {};
    }
  }

  function applyTranslations(dict) {
    currentDict = dict;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = byPath(dict, key);
      if (val === null || val === undefined) return; // keep default text
      if (/[<>]/.test(String(val))) el.innerHTML = val;
      else el.textContent = val;
    });
    ['title', 'aria-label', 'placeholder', 'data-tooltip', 'data-tip'].forEach(attr => {
      const sel = `[data-i18n-${attr.replace(/[^a-z0-9-]/gi, '')}]`;
      document.querySelectorAll(sel).forEach(el => {
        const key = el.getAttribute(`data-i18n-${attr.replace(/[^a-z0-9-]/gi, '')}`);
        const val = byPath(dict, key);
        if (val !== null && val !== undefined) el.setAttribute(attr, val);
      });
    });
  }

  async function setLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT;
    const dict = await loadTranslations(lang);
    applyTranslations(dict);
    document.documentElement.lang = lang;
    document.body && (document.body.dataset.lang = lang);
    localStorage.setItem(STORAGE_KEY, lang);
    const sel = document.getElementById('langSelector');
    if (sel) sel.value = lang;
    document.dispatchEvent(new CustomEvent('i18n:applied', { detail: { lang, dict } }));
  }

  function t(key, fallback) {
    const v = byPath(currentDict, key);
    return (v !== null && v !== undefined) ? v : (fallback !== undefined ? fallback : key);
  }

  window.i18n = { setLang, getInitialLang, t, SUPPORTED, DEFAULT };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setLang(getInitialLang()));
  } else {
    setLang(getInitialLang());
  }
})();
