/**
 * Service Worker
 * Optimized caching strategy untuk offline support dan performance
 * 
 * Strategies:
 * - Cache First: Static assets (js, css, images)
 * - Stale While Revalidate: API responses
 * - Network Only: Real-time data
 */

const CACHE_NAMES = {
  STATIC: "rs-medika-static-v1",
  DYNAMIC: "rs-medika-dynamic-v1",
  IMAGES: "rs-medika-images-v1",
  PAGES: "rs-medika-pages-v1",
  API: "rs-medika-api-v1",
};

const STATIC_ASSETS = [
  "/",
  "/offline.html",
  "/globals.css",
  "/favicon.ico",
  "/manifest.json",
];

/**
 * Install event - cache static assets
 */
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...");

  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAMES.STATIC);
        await cache.addAll(STATIC_ASSETS);
  console.log("[SW] Static assets cached");
  await globalThis.skipWaiting?.();
      } catch (error) {
        console.error("[SW] Installation failed:", error);
      }
    })(),
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...");

  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      const CURRENT_CACHES = Object.values(CACHE_NAMES);

      // Delete old cache versions
      await Promise.all(
        cacheNames
          .filter((name) => !CURRENT_CACHES.includes(name))
          .map((name) => {
            console.log(`[SW] Deleting old cache: ${name}`);
            return caches.delete(name);
          }),
      );

      console.log("[SW] Old caches cleaned up");
      // Enable navigation preload for faster navigations
      try {
        await globalThis.registration?.navigationPreload?.enable?.();
      } catch (err) {
        console.warn('[SW] navigationPreload enable failed:', err);
      }
      await globalThis.clients?.claim?.();
    })(),
  );
});

/**
 * Fetch event - implement caching strategies
 */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip chrome extensions dan internal requests
  if (url.protocol === "chrome-extension:") {
    return;
  }

  // Navigation requests (HTML pages) - serve from pages cache first then update in background
  // Fast-path: Next.js client-side page data (App Router / _next/data) - serve from pages cache first
  if (url.pathname.startsWith("/_next/data/")) {
    event.respondWith(cacheFirstStrategy(request, CACHE_NAMES.PAGES));
    return;
  }

  if (request.mode === "navigate" || request.headers.get?.("accept")?.includes("text/html")) {
    event.respondWith(navigationCacheStrategy(event));
    return;
  }

  // Strategy selection based on request type
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request));
  } else if (isImageRequest(url.pathname)) {
    event.respondWith(cacheImageStrategy(request));
  } else if (isApiRequest(url.pathname)) {
    event.respondWith(staleWhileRevalidateStrategy(request));
  } else {
    event.respondWith(networkFirstStrategy(request));
  }
});

/**
 * Navigation Cache Strategy (Stale-While-Revalidate)
 * Return cached HTML immediately for back/forward navigation so the page doesn't reload.
 * Meanwhile fetch in background and update cache so next navigation gets fresh content.
 */
// Accept either a Request or a FetchEvent (use event.preloadResponse if available)
async function navigationCacheStrategy(eventOrRequest) {
  const request = eventOrRequest.request || eventOrRequest;
  const cache = await caches.open(CACHE_NAMES.PAGES);

  try {
    // If navigation preload provided a response, use it and cache it
    try {
      const preloadResp = eventOrRequest.preloadResponse ? await eventOrRequest.preloadResponse : null;
      if (preloadResp) {
        if (preloadResp.ok) {
          await cache.put(request, preloadResp.clone());
        }
        return preloadResp;
      }
    } catch (err) {
      // ignore preload errors
      console.warn('[SW] preloadResponse error:', err);
    }

    const cached = await cache.match(request);

    // Kick off background update regardless
    const fetchAndUpdate = fetch(request)
      .then(async (response) => {
        if (response?.status === 200 && response?.type === "basic") {
          await cache.put(request, response.clone());
        }
        return response;
      })
      .catch(() => null);

    // If we have cached HTML, return it immediately and update in background
    if (cached) {
      void fetchAndUpdate;
      return cached;
    }

    // Otherwise wait for network and cache the result
    const networkResponse = await fetchAndUpdate;
    if (networkResponse) return networkResponse;

    // Fallback to a generic offline page if available
    const offlineCache = await caches.open(CACHE_NAMES.STATIC);
    const offlineResp = await offlineCache.match("/offline.html");
    return offlineResp || new Response("Offline", { status: 503 });
  } catch (error) {
    console.warn(`[SW] Navigation cache failed for ${request.url}:`, error);
    const fallbackCache = await caches.open(CACHE_NAMES.PAGES);
    const fallback = await fallbackCache.match(request);
    if (fallback) return fallback;
    return new Response("Offline", { status: 503 });
  }
}

/**
 * Cache First Strategy
 * Untuk static assets yang tidak pernah berubah
 */
// cacheFirstStrategy optionally accepts a cacheName to use instead of STATIC
async function cacheFirstStrategy(request, cacheName = CACHE_NAMES.STATIC) {
  try {
  const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    if (cached) {
      console.debug(`[SW] Cache hit (static): ${request.url}`);
      return cached;
    }

    const response = await fetch(request);
    if (response?.status === 200 && response?.type === "basic") {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.warn(`[SW] Cache First failed for ${request.url}:`, error);
    throw error;
  }
}

/**
 * Image Caching Strategy
 * Cache images with size limitation
 */
async function cacheImageStrategy(request) {
  try {
    const cache = await caches.open(CACHE_NAMES.IMAGES);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    const response = await fetch(request);

    if (response?.status === 200) {
      // Check if size is reasonable (< 5MB)
      const contentLength = response.headers.get("content-length");
      if (!contentLength || Number.parseInt(contentLength, 10) < 5 * 1024 * 1024) {
        cache.put(request, response.clone());
      }
    }

    return response;
  } catch (error) {
    console.warn(`[SW] Image caching failed for ${request.url}:`, error);
    // Return a placeholder or offline image
    return new Response("Image not available", { status: 503 });
  }
}

/**
 * Stale While Revalidate Strategy
 * Return cached version immediately, update in background
 */
async function staleWhileRevalidateStrategy(request) {
  let cached = null;
  try {
    const cache = await caches.open(CACHE_NAMES.API);
    cached = await cache.match(request);

    const fetchPromise = fetch(request)
      .then((response) => {
        // Update cache with fresh response
        if (response?.status === 200) {
          cache.put(request, response.clone());
        }
        return response;
      })
      .catch((err) => {
        console.warn(`[SW] Fetch failed for ${request.url} during SWR:`, err);
        return null;
      });

    // Return cached immediately if available, otherwise wait for network
    return cached || (await fetchPromise);
  } catch (error) {
    console.warn(`[SW] Stale While Revalidate failed for ${request.url}:`, error);

    if (cached) {
      return cached;
    }

    return new Response("Offline", { status: 503 });
  }
}

/**
 * Network First Strategy
 * Try network first, fallback to cache
 */
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);

    // Cache successful responses
    if (response?.status === 200) {
      const cache = await caches.open(CACHE_NAMES.DYNAMIC);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.warn(`[SW] Network First failed for ${request.url}:`, error);

    // Try cache fallback
    const cache = await caches.open(CACHE_NAMES.DYNAMIC);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    return new Response("Offline", { status: 503 });
  }
}

/**
 * Helper functions
 */
function isStaticAsset(pathname) {
  return /\.(js|css|woff|woff2|ttf|eot|otf)$/i.test(pathname);
}

function isImageRequest(pathname) {
  return /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(pathname);
}

function isApiRequest(pathname) {
  return pathname.startsWith("/api/");
}
