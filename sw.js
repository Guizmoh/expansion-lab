// Service worker : rend l'appli installable et utilisable hors connexion.
// Service worker: makes the app installable and usable offline.
const CACHE = "expansion-lab-v3";
const CORE = ["./", "./en/", "./mpc-expansion-maker.html", "./favicon.svg", "./manifest.webmanifest",
  "./assets/site.css", "./assets/site.js", "./icons/icon-192.png", "./icons/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Réseau d'abord (toujours la dernière version), cache si hors ligne.
// Network first (always latest), cache when offline.
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req, { ignoreSearch: true })));
});
