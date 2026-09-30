"use client";

import { useEffect } from "react";
import {
  registerServiceWorker,
  clearServiceWorkerCaches,
  forceUpdateServiceWorker,
} from "@/lib/service-worker-register";

interface ServiceWorkerInitializerProps {
  debug?: boolean;
}

export function ServiceWorkerInitializer({
  debug = false,
}: ServiceWorkerInitializerProps) {
  useEffect(() => {
    // Fungsi untuk memicu notifikasi dengan jeda 1 menit & batasan 1 hari sekali
    const triggerDailyNotification = (reg: ServiceWorkerRegistration) => {
      const NOTIF_KEY = "last_notification_sent_time";
      const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 24 jam dalam milidetik
      const ONE_MINUTE_MS = 60 * 1000; // 1 menit delay

      const lastSent = localStorage.getItem(NOTIF_KEY);
      const now = Date.now();

      // Cek apakah belum pernah dikirim ATAU sudah lewat 24 jam
      if (!lastSent || now - parseInt(lastSent, 10) > ONE_DAY_MS) {
        if (debug) {
          console.log(
            "[SW Init] Notifikasi dijadwalkan muncul dalam 1 menit...",
          );
        }

        setTimeout(() => {
          // Kirim notifikasi via Service Worker
          reg.showNotification("Jika kamu sedang Sakit!", {
            body: "Ayo segera periksa ke Rumah Sakit Medika Lestari",
            icon: "/public/medikalestari.png", 
          });

          // Catat timestamp pengiriman terakhir ke localStorage
          localStorage.setItem(NOTIF_KEY, Date.now().toString());

          if (debug) {
            console.log("[SW Init] Notifikasi berhasil dikirim!");
          }
        }, ONE_MINUTE_MS);
      } else if (debug) {
        console.log(
          "[SW Init] Notifikasi sudah dikirim hari ini. Melewati pemicu.",
        );
      }
    };

    // Register service worker
    const registerSW = async () => {
      try {
        const reg = await registerServiceWorker();

        if (debug) {
          console.log("[SW Init] Service Worker berhasil didaftarkan");
        }

        // Cek jika permission sudah dizinkan dari awal
        if (
          typeof window !== "undefined" &&
          "Notification" in window &&
          Notification.permission === "granted" &&
          reg
        ) {
          triggerDailyNotification(reg);
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

      // Request notification permission jika belum ditentukan
      if ("Notification" in globalThis.window) {
        if (globalThis.window.Notification?.permission === "default") {
          globalThis.window.Notification.requestPermission().then(
            (permission) => {
              if (permission === "granted") {
                navigator.serviceWorker.ready.then((reg) => {
                  triggerDailyNotification(reg);
                });
              }
            },
          );
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

  return null;
}
