"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/service-worker-register";
import { isPushSupported, subscribeToPush } from "@/lib/push-client";

interface ServiceWorkerInitializerProps {
  debug?: boolean;
}

const SYNC_KEY = "push_subscription_synced";

// Tugas komponen ini hanya:
// 1. mendaftarkan service worker
// 2. kalau user SUDAH pernah mengizinkan notifikasi, pastikan subscription-nya
//    tersimpan di server (sekali per sesi)
// Permintaan izin ada di NotificationPrompt (harus dari klik user), dan pengiriman
// notifikasi dilakukan server lewat /api/send-notification, bukan timer di halaman.
export function ServiceWorkerInitializer({
  debug = false,
}: ServiceWorkerInitializerProps) {
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        await registerServiceWorker();
        if (cancelled) return;
        if (debug) console.log("[SW Init] Service Worker berhasil didaftarkan");

        if (!isPushSupported() || Notification.permission !== "granted") return;

        try {
          if (sessionStorage.getItem(SYNC_KEY)) return;
        } catch {
          // sessionStorage bisa tidak tersedia: lanjut saja
        }

        await subscribeToPush();
        if (debug)
          console.log("[SW Init] Push subscription tersinkron ke server");

        try {
          sessionStorage.setItem(SYNC_KEY, "1");
        } catch {
          // abaikan
        }
      } catch (error) {
        console.error(
          "[SW Init] Gagal menyiapkan Service Worker / Push:",
          error,
        );
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [debug]);

  return null;
}
