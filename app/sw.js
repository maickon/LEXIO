/**
 * LEXIO — Service Worker
 * Estratégia: Cache-first para assets, network-first para dados externos
 */

const CACHE_NAME = 'lexio-v1';
const CACHE_STATIC = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/db.js',
  '/js/state.js',
  '/js/ui.js',
  '/js/audio.js',
  '/js/pages.js',
  '/js/app.js',
  '/data/config.js',
  '/data/words.js',
  '/data/habits.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap'
];

// ── INSTALL: pre-cache static shell ──────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_STATIC.map(url => new Request(url, { cache: 'reload' })))
        .catch(err => console.warn('[SW] Some resources failed to cache:', err));
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: clean old caches ───────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: cache-first strategy ──────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET, browser extensions, external APIs
  if (request.method !== 'GET') return;
  if (url.origin !== location.origin &&
      !url.origin.includes('fonts.googleapis.com') &&
      !url.origin.includes('fonts.gstatic.com') &&
      !url.origin.includes('images.unsplash.com')) return;

  // Images from Unsplash: cache when fetched, serve from cache
  if (url.origin.includes('unsplash.com')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(request).then(cached => {
          if (cached) return cached;
          return fetch(request).then(res => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          }).catch(() => new Response('', { status: 404 }));
        })
      )
    );
    return;
  }

  // App shell + assets: cache-first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        if (res.ok) {
          caches.open(CACHE_NAME).then(cache => cache.put(request, res.clone()));
        }
        return res;
      }).catch(() => caches.match('/index.html'));
    })
  );
});

// ── PUSH NOTIFICATIONS ───────────────────────────
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title   = data.title   || 'LEXIO';
  const body    = data.body    || '⚡ Hora de estudar inglês!';
  const icon    = data.icon    || '/icons/icon-192.png';
  const badge   = data.badge   || '/icons/icon-192.png';
  const url     = data.url     || '/';

  event.waitUntil(
    self.registration.showNotification(title, {
      body, icon, badge,
      data: { url },
      vibrate: [100, 50, 100],
      actions: [
        { action: 'open',    title: 'Estudar agora' },
        { action: 'dismiss', title: 'Mais tarde' }
      ]
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
