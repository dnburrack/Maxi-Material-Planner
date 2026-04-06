// MaxPlan Service Worker — v1.1.3
const CACHE = 'maxplan-v113';
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg', './version.json'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('version.json')) {
    event.respondWith(fetch(event.request, {cache:'no-store'}).catch(() => caches.match('./version.json')));
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        caches.open(CACHE).then(c => c.put(event.request, response.clone()));
        return response;
      });
    }).catch(() => { if (event.request.mode === 'navigate') return caches.match('./index.html'); })
  );
});
