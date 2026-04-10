// MaxPlan Service Worker — v1.2.2
const CACHE = 'maxplan-v122';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './version.json',
  'https://cdnjs.cloudflare.com/ajax/libs/quagga/0.12.1/quagga.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => {
      const local = ASSETS.filter(u => !u.startsWith('http'));
      const cdn   = ASSETS.filter(u =>  u.startsWith('http'));
      return c.addAll(local).then(() =>
        Promise.allSettled(cdn.map(u =>
          fetch(u, {cache:'no-cache'}).then(r => { if(r.ok) c.put(u, r); }).catch(()=>{})
        ))
      );
    }).then(() => self.skipWaiting())
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
    e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>caches.match('./version.json')));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(r => {
        if (!r || r.status !== 200 || r.type === 'opaque') return r;
        caches.open(CACHE).then(c => c.put(e.request, r.clone()));
        return r;
      });
    }).catch(() => { if (e.request.mode==='navigate') return caches.match('./index.html'); })
  );
});
