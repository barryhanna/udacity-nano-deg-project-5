const cacheName = 'restaurant-site-cache-v1';

const urlsToCache = [
    '/',
    '/index.html',
    '/restaurant.html',
    '/css/styles.css',
    '/data/restaurants.json',
    '/js/',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/js/register.js',
    '/img/placeholder.jpg'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(cacheName).then(function(cache) {
          console.log('Opened cache');
          return cache.addAll(urlsToCache);
        })
        .catch(function(error) {
          console.log(`Failed to open cache: ${error}`);
        })
    );
});

self.addEventListener('fetch', function(event) {
  let request = event.request;
  let cachedURL = new URL(event.request.url);

  // check if request is for restaurant.html
  if(event.request.url.indexOf("restaurant.html") > -1) {
    request = new Request("restaurant.html");
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }

      var fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(
        function(response) {
          if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            var responseToCache = response.clone();

            caches.open(cacheName)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(function(error) {
            if(event.request.url.indexOf(".jpg") > -1) {
              return caches.match("/img/placeholder.jpg");
            }
            return new Response('Internet connection down.' , {
              status: 404,
              statusText: 'Internet connection down.'
            });
        })
      })
    );
  });