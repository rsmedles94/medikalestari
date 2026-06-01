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
self.addEventListener("install", (event: ExtendableEvent) => {
  console.log("[SW] Installing service worker...");
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAMES.STATIC);
        await cache.addAll(STATIC_ASSETS);
        console.log("[SW] Static assets cached");
        await (self as any).skipWaiting();
      } catch (error) {
        console.error("[SW] Installation failed:", error);
      }
    })(),
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener("activate", (event: ExtendableEvent) => {
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
      await (self as any).clients.claim();
    })(),
  );
});

/**
 * Fetch event - implement caching strategies
 */
self.addEventListener("fetch", (event: FetchEvent) => {
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
 * Cache First Strategy
 * Untuk static assets yang tidak pernah berubah
 */
async function cacheFirstStrategy(request: Request): Promise<Response> {
  try {
    const cache = await caches.open(CACHE_NAMES.STATIC);
    const cached = await cache.match(request);

    if (cached) {
      console.debug(`[SW] Cache hit (static): ${request.url}`);
      return cached;
    }

    const response = await fetch(request);
    if (response.status === 200 && response.type === "basic") {
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
async function cacheImageStrategy(request: Request): Promise<Response> {
  try {
    const cache = await caches.open(CACHE_NAMES.IMAGES);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    const response = await fetch(request);
    
    if (response.status === 200) {
      // Check if size is reasonable (< 5MB)
      const contentLength = response.headers.get("content-length");
      if (!contentLength || parseInt(contentLength) < 5 * 1024 * 1024) {
        cache.put(request, response.clone());
      }
    }

    return response;
  } catch (error) {
    console.warn(`[SW] Image caching failed for ${request.url}`);
    // Return a placeholder or offline image
    return new Response("Image not available", { status: 503 });
  }
}

/**
 * Stale While Revalidate Strategy
 * Return cached version immediately, update in background
 */
async function staleWhileRevalidateStrategy(
  request: Request,
): Promise<Response> {
  try {
    const cache = await caches.open(CACHE_NAMES.API);
    const cached = await cache.match(request);

    const fetchPromise = fetch(request).then((response) => {
      // Update cache with fresh response
      if (response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    });

    // Return cached immediately if available, otherwise wait for network
    return cached || (await fetchPromise);
  } catch (error) {
    console.warn(
      `[SW] Stale While Revalidate failed for ${request.url}:`,
      error,
    );

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
async function networkFirstStrategy(request: Request): Promise<Response> {
  try {
    const response = await fetch(request);

    // Cache successful responses
    if (response.status === 200) {
      const cache = await caches.open(CACHE_NAMES.DYNAMIC);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.warn(`[SW] Network First failed for ${request.url}`);

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
function isStaticAsset(pathname: string): boolean {
  return /\.(js|css|woff|woff2|ttf|eot|otf)$/i.test(pathname);
}

function isImageRequest(pathname: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(pathname);
}

function isApiRequest(pathname: string): boolean {
  return pathname.startsWith("/api/");
}
