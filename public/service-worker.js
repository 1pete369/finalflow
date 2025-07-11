self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('chatify-cache').then((cache) => {
        return cache.addAll([
          '/',
          '/manifest.json',
          '/logo.png',
          '/icon-192x192.png',
          '/icon-512x512.png',
          // Only cache files you know exist inside /public
        ]);
      }).catch((error) => {
        console.error('Caching failed:', error);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  
  self.addEventListener('activate', (event) => {
    const cacheWhitelist = ['chatify-cache'];
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });
  