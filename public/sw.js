const STATIC_CACHE = 'show-tracker-static-1766089112815';
const DYNAMIC_CACHE = 'show-tracker-dynamic-1766089112815';
const VERSION = 'v2025-12-18T20-18-32-14b1ddb'; // Update this when you deploy changes

const urlsToCache = [
  '/',
  '/assets/android-chrome-192x192.png',
  '/assets/android-chrome-512x512.png',
  '/assets/apple-touch-icon.png',
  '/assets/favicon-16x16.png',
  '/assets/favicon-32x32.png',
  '/assets/favicon.ico'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Service worker installing version:', VERSION);
  
  // Force the new service worker to activate immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service worker installed successfully');
        // Notify all clients about the new version
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'SW_UPDATE_AVAILABLE',
              version: VERSION
            });
          });
        });
      })
  );
});

// Fetch event - network first strategy for better updates
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Don't cache API requests to avoid stale data
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        // If offline and API request fails, return a helpful message
        return new Response(
          JSON.stringify({ 
            error: 'You are offline. Please check your connection and try again.',
            offline: true
          }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      })
    );
    return;
  }

  // Don't cache Vercel Speed Insights scripts - let them load fresh
  if (url.pathname.startsWith('/_vercel/speed-insights/')) {
    event.respondWith(fetch(request));
    return;
  }

  // Network first strategy for all resources
  event.respondWith(
    fetch(request)
      .then(response => {
        // If successful, cache the response for offline use
        if (response.ok) {
          const responseClone = response.clone();
          
          // Only cache certain types of resources
          if (shouldCache(request)) {
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
        }
        return response;
      })
      .catch(() => {
        // If network fails, try to serve from cache
        return caches.match(request).then(response => {
          if (response) {
            return response;
          }
          
          // If no cache and it's a navigation request, return offline page
          if (request.mode === 'navigate') {
            return caches.match('/').then(cachedResponse => {
              return cachedResponse || new Response(
                '<html><body><h1>You are offline</h1><p>Please check your connection and try again.</p></body></html>',
                {
                  status: 200,
                  headers: { 'Content-Type': 'text/html' }
                }
              );
            });
          }
          
          // For other requests, return a basic error
          return new Response('Network error', { status: 503 });
        });
      })
  );
});

// Helper function to determine what should be cached
function shouldCache(request) {
  const url = new URL(request.url);
  
  // Cache static assets and images
  if (url.pathname.startsWith('/_next/static/') || 
      url.pathname.startsWith('/assets/') ||
      url.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    return true;
  }
  
  // Cache the main page for offline use
  if (url.pathname === '/' && request.mode === 'navigate') {
    return true;
  }
  
  // Don't cache JavaScript chunks aggressively - let them update
  if (url.pathname.startsWith('/_next/static/chunks/') && url.pathname.endsWith('.js')) {
    return false;
  }
  
  return false;
}

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service worker activating version:', VERSION);
  
  // Take control of all clients immediately
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ]).then(() => {
      console.log('Service worker activated successfully');
      // Notify all clients that the new service worker is active
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            version: VERSION
          });
        });
      });
    })
  );
});
