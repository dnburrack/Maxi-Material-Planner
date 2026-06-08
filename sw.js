// MaxPlan Service Worker — v1.5.2
const CACHE  = 'maxplan-v152';
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg', './version.json'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); });
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('message', event => { if(event.data?.type==='SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', event => {
  if(event.request.method!=='GET') return;
  if(event.request.url.includes('version.json')){ event.respondWith(fetch(event.request,{cache:'no-store'}).catch(()=>caches.match('./version.json'))); return; }
  event.respondWith(caches.match(event.request).then(cached=>{
    if(cached) return cached;
    return fetch(event.request).then(r=>{ if(!r||r.status!==200||r.type==='opaque') return r; caches.open(CACHE).then(c=>c.put(event.request,r.clone())); return r; });
  }).catch(()=>{ if(event.request.mode==='navigate') return caches.match('./index.html'); }));
});
