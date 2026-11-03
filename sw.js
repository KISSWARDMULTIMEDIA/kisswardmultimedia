const CACHE_NAME = "kissward-site-v4";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./privacy-policy.html",
  "./manifest.webmanifest",
  "./assets/css/style.css",
  "./assets/css/privacy.css",
  "./assets/js/main.js",
  "./assets/fonts/bricolage-grotesque-400800-latin.woff2",
  "./assets/fonts/inter-400600-latin.woff2",
  "./img/brand/logo-96.webp",
  "./img/brand/logo-192.webp",
  "./img/brand/logo-loop-still.webp",
  "./img/kisswardmultimedia-logo.png",
  "./img/icon-192x192.png",
  "./img/icon-512x512.png",
  "./img/apps/orbtanker-192.webp",
  "./img/apps/bible-192.webp",
  "./img/work/01-480.webp",
  "./img/work/02-480.webp",
  "./img/work/03-480.webp"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((hit) => hit || caches.match("./index.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
