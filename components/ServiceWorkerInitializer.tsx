/**
 * Service Worker Inexport function ServiceWorkerInitializer({ 
  debug = false 
}: ServiceWorkerInitializerProps) {
  useEffect(() => {zer Component
 * Register service worker saat aplikasi load
 */

"use client";

import { useEffect, useState } from "react";
import {
  registerServiceWorker,
  clearServiceWorkerCaches,
  forceUpdateServiceWorker,
} from "@/lib/service-worker-register";

interface ServiceWorkerInitializerProps {
  debug?: boolean;
}

interface CacheStats {
  [cacheName: string]: {
    count: number;
    urls: string[];
  };
}

export function ServiceWorkerInitializer({
  debug = false,
}: ServiceWorkerInitializerProps) {
  useEffect(() => {
    // Register service worker
    const registerSW = async () => {
      try {
        await registerServiceWorker();

        if (debug) {
          console.log("[SW Init] Service Worker berhasil didaftarkan");
        }
      } catch (error) {
        console.error("[SW Init] Gagal register Service Worker:", error);
      }
    };

    registerSW();

    // Listen untuk update notifications
    const handleUpdate = () => {
      if (debug) {
        console.log("[SW Init] Update tersedia");
      }
    };

    if (typeof globalThis !== "undefined" && globalThis.window) {
      globalThis.window.addEventListener("sw-update-available", handleUpdate);

      // Request notification permission
      if ("Notification" in globalThis.window) {
        if (globalThis.window.Notification?.permission === "default") {
          globalThis.window.Notification.requestPermission();
        }
      }

      return () => {
        globalThis.window?.removeEventListener(
          "sw-update-available",
          handleUpdate,
        );
      };
    }
  }, [debug]);

  // Jangan render apa-apa
  return null;
}

/**
 * Development Helper: Cache Debugger Component
 * Hanya untuk development/testing
 */
export function CacheDebugger() {
  const [cacheStats, setCacheStats] = useState<CacheStats | null>(null);
  const [showDebugger, setShowDebugger] = useState(false);

  useEffect(() => {
    // Listen untuk keyboard shortcut (Ctrl+Shift+D)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.code === "KeyD") {
        e.preventDefault();
        setShowDebugger((prev) => !prev);
      }
    };

    if (typeof globalThis !== "undefined" && globalThis.window) {
      globalThis.window.addEventListener("keydown", handleKeyDown);
      return () => {
        globalThis.window?.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, []);

  const fetchCacheStats = async () => {
    if (typeof globalThis === "undefined" || !("caches" in globalThis)) {
      alert("Caches API tidak didukung");
      return;
    }

    try {
      const cacheNames = await globalThis.caches.keys();
      const stats: CacheStats = {};

      for (const cacheName of cacheNames) {
        const cache = await globalThis.caches.open(cacheName);
        const keys = await cache.keys();
        stats[cacheName] = {
          count: keys.length,
          urls: keys.map((req) => req.url),
        };
      }

      setCacheStats(stats);
    } catch (error) {
      console.error("Error fetching cache stats:", error);
      alert("Error: " + String(error));
    }
  };

  const handleClearCache = async () => {
    if (confirm("Clear semua cache?")) {
      await clearServiceWorkerCaches();
      alert("Cache cleared!");
      setCacheStats(null);
    }
  };

  const handleForceUpdate = async () => {
    await forceUpdateServiceWorker();
    alert("Update check dilakukan");
  };

  if (!showDebugger) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        backgroundColor: "#000",
        color: "#00ff00",
        padding: "20px",
        borderRadius: "8px",
        fontFamily: "monospace",
        fontSize: "12px",
        maxWidth: "400px",
        maxHeight: "60vh",
        overflowY: "auto",
        zIndex: 9999,
        border: "2px solid #00ff00",
      }}
    >
      <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
        Cache Debugger (Ctrl+Shift+D untuk close)
      </div>

      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={fetchCacheStats}
          style={{
            padding: "5px 10px",
            marginRight: "5px",
            backgroundColor: "#00ff00",
            color: "#000",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          📊 Stats
        </button>
        <button
          onClick={handleClearCache}
          style={{
            padding: "5px 10px",
            marginRight: "5px",
            backgroundColor: "#ff0000",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          🗑️ Clear
        </button>
        <button
          onClick={handleForceUpdate}
          style={{
            padding: "5px 10px",
            backgroundColor: "#0066ff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          🔄 Update
        </button>
      </div>

      {cacheStats && (
        <div>
          <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Caches:</div>
          {Object.entries(cacheStats).map(([name, data]) => (
            <div key={name} style={{ marginBottom: "10px" }}>
              <div>
                {name} ({data.count} items)
              </div>
              <div style={{ fontSize: "10px", marginLeft: "10px" }}>
                {data.urls.slice(0, 3).map((url, index) => {
                  const urlKey = `${name}-${index}`;
                  return (
                    <div key={urlKey} style={{ color: "#0f0" }}>
                      {new URL(url).pathname}
                    </div>
                  );
                })}
                {data.urls.length > 3 && (
                  <div>... +{data.urls.length - 3} more</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
