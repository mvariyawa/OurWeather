const CACHE_NAME = "ourly-weather-v1";

const FILES = [
  "./",
  "./index.html",
  "./manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
      caches.open(CACHE_NAME)
          .then(cache => cache.addAll(FILES))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
      caches.keys().then(keys =>
          Promise.all(
              keys.map(key => {
                if (key !== CACHE_NAME)
                  return caches.delete(key);
              })
          )
      )
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET")
    return;

  event.respondWith(
      caches.match(event.request).then(cached => {
        return cached || fetch(event.request)
            .then(response => {
              const copy = response.clone();

              if (response.status === 200) {
                caches.open(CACHE_NAME)
                    .then(cache => cache.put(event.request, copy));
              }

              return response;
            });
      })
  );
});