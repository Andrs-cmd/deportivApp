/* Cache offline: la app funciona sin internet; el plan se busca primero en la red. */
const V = 'pf-v112';
const SHELL = ['./', 'index.html', 'css/app.css', 'js/data.js', 'js/poses.js', 'js/foods.js', 'js/app.js', 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'plan/plan.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  if (url.pathname.endsWith('/plan/plan.json') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    // red primero, cache de respaldo
    e.respondWith(fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(V).then(c => c.put(url.pathname.endsWith('/plan/plan.json') ? 'plan/plan.json' : e.request, copy));
      return r;
    }).catch(() => caches.match(url.pathname.endsWith('/plan/plan.json') ? 'plan/plan.json' : e.request, { ignoreSearch: true })));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
