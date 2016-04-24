console.log("SW startup");
var CACHE_NAME = 'shri-2016-task3-1';
var urlsToCache = [
  '/',
  'css/index.css',
  'js/index.js',
  '/index.html',
  '/worker.js'
];

this.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

this.addEventListener('fetch', event => {
    const requestURL = new URL(event.request.url);

    if (
        /^\/api\/v1/.test(requestURL.pathname)
        && (event.request.method !== 'GET' && event.request.method !== 'HEAD')
    ) {
        return event.respondWith(fetch(event.request));
    }

    if (
        /^\/api\/v1/.test(requestURL.pathname)
    ) {
        return event.respondWith(
            fetchAndPutToCache(event.request)
        );
    }

    return event.respondWith(
        getFromCache(event.request).catch(fetchAndPutToCache.bind(this, event.request))
    );
});

function fetchAndPutToCache(request) {
    return fetch(request).then(response => {
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
            .then(cache => {
                cache.put(request, responseToCache);
            })
        return response
    })
    .catch(() => {
        return getFromCache(request)
    });
}

function getFromCache(request) {
    return caches.match(request)
        .then((response) => {
            if (response) {
                return response;
            }

            return Promise.reject();
        });
}
