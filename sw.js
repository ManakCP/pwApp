//importScripts('.\\node_modules\\workbox-sw\\build\\importScripts\\workbox-sw.dev.v2.1.2.js');

const staticAssets = [
    './',
    './styles.css',
    './app.js',
    './fallback.json',
    './images/manak_chand_prajapati.jpg'
];

/*const wb = new WorkboxSW();
wb.precache(staticAssets);
wb.router.registerRoute('https://newsapi.org/(.*)', wb.strategies.networkFirst());
wb.router.registerRoute(/.*\.(png|jpg|jpeg|gif)/, wb.strategies.cacheFirst({
    cacheName: 'news-images',
    cacheExpiration: { maxEntries: 20, maxAgeSeconds: 12 * 60 * 60 },
    cacheableResponse: { statuses: [0,200] }
}))*/


self.addEventListener('install', async event => {
    const cache = await caches.open('news-static');
    cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);

    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(request));
    } else {
        event.respondWith(networkFirst(request));        
    }    
})

async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || fetch(request);
}

async function networkFirst(request){
    const cache = await caches.open('news-dynamic');

     try {
         const response = await fetch(request);
         cache.put(request, response.clone());
         return response;
     } catch (error) {
         const cachedResponse = await cache.match(request);
         return cachedResponse || await caches.match('./fallback.json');         
     }
}