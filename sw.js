// Nombre de la caché con versión para control de actualizaciones
const CACHE_NAME = 'timecalc-cache-v1';

// Lista de archivos locales y de CDN para precargar en la caché
const CACHE_FILES = [
  // Archivos locales
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  // Dependencias de CDN (CSS)
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
  'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css',
  'https://fonts.googleapis.com/css2?family=Roboto+Condensed&display=swap',
  // Dependencias de CDN (JavaScript)
  'https://code.jquery.com/jquery-3.6.0.min.js',
  'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js',
  'https://code.jquery.com/ui/1.12.1/i18n/datepicker-es.js',
  'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/locale/es.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// Evento de instalación: precarga archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_FILES);
    })
  ).catch(err => console.error("Fallo al precargar la caché:", err));
  self.skipWaiting(); // actúa inmediatamente
});

// Evento de activación: limpia cachés antiguas
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
  self.clients.claim(); // toma control de páginas inmediatamente
});

// Evento de fetch: implementa la estrategia "Stale-While-Revalidate"
self.addEventListener('fetch', event => {
  // Ignorar peticiones que no sean GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        // 1. Petición a la red en segundo plano para obtener la versión más reciente.
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // Si la petición es exitosa, se actualiza la caché.
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => { /* La petición de red falló, probablemente offline. No hacemos nada. */ });

        // 2. Se retorna la respuesta de la caché inmediatamente si existe, si no, se espera la respuesta de la red.
        return cachedResponse || fetchPromise;
      });
    })
  );
});
