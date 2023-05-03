if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('service-worker.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
// Service Worker fetch event
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      // Clone the request
      var fetchRequest = event.request.clone();
      // Try to fetch the request from the network
      return fetch(fetchRequest).then(function(response) {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        // Clone the response
        var responseToCache = response.clone();
        // Cache the response
        caches.open('my-cache').then(function(cache) {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
