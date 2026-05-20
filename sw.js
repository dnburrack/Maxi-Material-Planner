// MaxPlan Service Worker — v1.4.5
// IMPORTANT: self.skipWaiting() is NOT called automatically on install.
// It is ONLY called when the page sends an explicit SKIP_WAITING message
// (i.e. the user taps the Update button and the waiting SW is confirmed ready).
// This prevents auto-updates — the user chooses when to apply them.

const CACHE  = 'maxplan-v145';
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg', './version.json'];

self.addEventListener('install', event => {
  // Cache all assets but do NOT skip waiting.
  // The new SW stays in the 'waiting' state until the page sends SKIP_WAITING.
  event.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  // Delete old caches and claim all clients
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Only skip waiting when the user explicitly taps Update
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  // version.json — always network-first so update checks are never stale
  if (event.request.url.includes('version.json')) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .catch(() => caches.match('./version.json'))
    );
    return;
  }

  // Everything else — cache-first (offline capable)
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        caches.open(CACHE).then(c => c.put(event.request, response.clone()));
        return response;
      });
    }).catch(() => {
      if (event.request.mode === 'navigate') return caches.match('./index.html');
    })
  );
});
