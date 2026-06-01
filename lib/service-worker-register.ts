/**
 * Service Worker Registrator
 * Register dan manage service worker lifecycle
 */

export async function registerServiceWorker(): Promise<void> {
  // Check if browser supports service workers
  if (globalThis.window === undefined || !("serviceWorker" in navigator)) {
    console.warn("[SW] Service Worker tidak didukung di browser ini");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none", // Always check for updates
    });

    console.log("[SW] Service Worker berhasil didaftarkan:", registration);

    // Listen for updates
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener("statechange", () => {
        if (
          newWorker.state === "activated" &&
          navigator.serviceWorker.controller
        ) {
          console.log("[SW] Service Worker update siap digunakan");
          // Notify user bahwa update tersedia
          notifyUpdateAvailable();
        }
      });
    });

    // Check for updates periodically
    setInterval(() => {
      registration.update();
    }, 60 * 1000); // Check every minute
  } catch (error) {
    console.error("[SW] Gagal mendaftarkan Service Worker:", error);
  }
}

/**
 * Unregister service worker (useful for development)
 */
export async function unregisterServiceWorker(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
      console.log("[SW] Service Worker unregistered");
    }
  } catch (error) {
    console.error("[SW] Gagal unregister Service Worker:", error);
  }
}

/**
 * Notify user about available update
 */
function notifyUpdateAvailable(): void {
  // Emit custom event untuk dihandle oleh app
  const event = new CustomEvent("sw-update-available");
  globalThis.window?.dispatchEvent(event);

  // Optional: Show notification
  if (Notification.permission === "granted") {
    new Notification("Update Tersedia", {
      body: "Versi terbaru website sudah siap. Silakan refresh halaman.",
      icon: "/favicon.ico",
    });
  }
}

/**
 * Force update service worker
 */
export async function forceUpdateServiceWorker(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;

  const registrations = await navigator.serviceWorker.getRegistrations();
  for (const registration of registrations) {
    await registration.update();
  }
}

/**
 * Clear all service worker caches
 */
export async function clearServiceWorkerCaches(): Promise<void> {
  if (!("caches" in globalThis.window || {})) return;

  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
    console.log("[SW] Semua cache berhasil dihapus");
  } catch (error) {
    console.error("[SW] Gagal menghapus cache:", error);
  }
}
