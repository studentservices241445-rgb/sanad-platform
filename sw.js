const CACHE_NAME = 'sanad-platform-cache-v1';
const basePath = self.location.pathname.replace(/\/sw\.js$/, '');
const urlsToCache = [
  `${basePath}/`,
  `${basePath}/index.html`,
  `${basePath}/summary.html`,
  `${basePath}/summary-order.html`,
  `${basePath}/exam.html`,
  `${basePath}/exam-order.html`,
  `${basePath}/project.html`,
  `${basePath}/project-order.html`,
  `${basePath}/manifest.json`
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).catch(() => {
          return caches.match(`${basePath}/`);
        })
      );
    })
  );
});
