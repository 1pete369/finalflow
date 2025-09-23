// public/service-worker.js
/* eslint-disable no-restricted-globals */
const STATIC_CACHE = "static-v4"; // bump to force update when file changes

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      // Optional: pre-cache critical same-origin assets
      return cache.addAll([
        // "/", // enable if you want
        // "/favicon.ico",
      ]).catch(() => undefined);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// Only handle SAME-ORIGIN GET requests for static assets.
// DO NOT touch cross-origin (e.g., https://grindflow-server-1.onrender.com)
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin) return; // let browser handle cross-origin (API) requests

  // Basic cache-first for static files; network fallback
  event.respondWith(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      const cached = await cache.match(request);
      if (cached) return cached;
      try {
        const res = await fetch(request);
        // Only cache successful, basic/opaque safe responses
        if (res && res.status === 200 && res.type === "basic") {
          cache.put(request, res.clone());
        }
        return res;
      } catch (e) {
        // Optionally return a fallback page/asset
        throw e;
      }
    })()
  );
});
