/* ============================================================================
 * AI-Exhibits · Reinforcement Learning & Sliding Puzzles
 * PWA service worker — offline cache so the hub works without wifi after first visit.
 *
 * © 2026 Dr. Erika Roldán Roa. All rights reserved by the author.
 * Licensed: CC BY-NC-ND 4.0. See LICENSE.
 * ============================================================================ */

/* =============================================================================
   RL MISSION HUB — Service Worker
   Strategy: network-first for HTML + translations + JS (stay fresh),
             cache-first for CSS/images/fonts (stable assets).
   This lets us roll out content fixes immediately even if users have
   previously visited (old cached version is discarded on next load).
   ============================================================================= */

const CACHE_VERSION = 'v2.69.0-2026-05-12';   // bump on each deploy to invalidate
const CACHE_NAME = `ai-exhibits-rl-${CACHE_VERSION}`;

const PRECACHE = [
  './',
  './index.html',
  './exhibit_2x2.html',
  './exhibit_2x3.html',
  './exhibit_3x3.html',
  './mission1_kit.html',
  './mission2_kit.html',
  './mission3_kit.html',
  './print/fiche_equipe.html',
  './app/styles.css',
  './app/tutorial.js',
  './app/i18n.js',
  './app/feedback.js',
  './app/tooltips.js',
  './app/glossary.js',
  './app/kit-shared.css',
  './app/learn-cards-translations.js',
  './translations/fr.json',
  './translations/en.json',
  './translations/de.json',
  './translations/it.json',
];

// Install: pre-cache core assets + take over immediately.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up ALL old caches and take control of open pages.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

function isDynamicAsset(url) {
  // HTML pages and JSON translation files should always try network first
  // so content updates reach users on next navigation.
  return url.pathname.endsWith('.html')
      || url.pathname.endsWith('.json')
      || url.pathname.endsWith('/');
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (isDynamicAsset(url)) {
    // Network-first for HTML + JSON
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || offlineResponse()))
    );
  } else {
    // Cache-first for static assets (CSS, JS, fonts, images)
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          }
          return res;
        }).catch(() => offlineResponse());
      })
    );
  }
});

function offlineResponse() {
  return new Response(
    'RL Mission Hub — hors ligne. Vérifiez votre connexion.\nRL Mission Hub offline. Please check your connection.',
    { status: 503, statusText: 'Service Unavailable', headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
}
