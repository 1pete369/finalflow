/* eslint-disable no-restricted-globals */
const STATIC_CACHE = "static-v5"; // bump to force update

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.addAll([]).catch(() => undefined)
    )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== STATIC_CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

// Only cache SAME-ORIGIN GETs for static assets.
// DO NOT touch cross-origin API calls (Render).
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin) return; // let the browser handle API requests

  event.respondWith(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      const cached = await cache.match(request);
      if (cached) return cached;
      const res = await fetch(request);
      if (res && res.status === 200 && res.type === "basic") {
        cache.put(request, res.clone());
      }
      return res;
    })()
  );
});
