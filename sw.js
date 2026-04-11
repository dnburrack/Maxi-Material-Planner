// MaxPlan Service Worker — v1.2.4
const CACHE = 'maxplan-v124';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './version.json'
];
// ZBar WASM loads as ES module from jsDelivr — the SW caches
// whatever the module fetches (JS + .wasm binary) automatically
// via the fetch handler below.

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('version.json')) {
    e.respondWith(
      fetch(e.request, {cache:'no-store'})
        .catch(() => caches.match('./version.json'))
    );
    return;
  }
  // Cache-first for everything — CDN assets (ZBar JS+WASM) cached on first load
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(r => {
        if (!r || r.status !== 200 || r.type === 'opaque') return r;
        caches.open(CACHE).then(c => c.put(e.request, r.clone()));
        return r;
      });
    }).catch(() => {
      if (e.request.mode === 'navigate') return caches.match('./index.html');
    })
  );
});
