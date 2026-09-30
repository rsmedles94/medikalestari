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

// Koleksi variasi pesan harian (tanpa emoji)
const RANDOM_MESSAGES = [
  {
    title: "Jika kamu sedang Sakit!",
    body: "Ayo segera periksa ke Rumah Sakit Medika Lestari.",
  },
  {
    title: "Jaga Kesehatanmu Hari Ini",
    body: "Jangan tunda konsultasi kesehatan bersama dokter spesialis RS Medika Lestari.",
  },
  {
    title: "Sudah Cek Kesehatan Minggu Ini?",
    body: "Kunjungi RS Medika Lestari untuk layanan perawatan terbaik keluarga Anda.",
  },
  {
    title: "Butuh Layanan Medis?",
    body: "Jadwalkan janji temu dokter dengan cepat dan mudah di RS Medika Lestari.",
  },
  {
    title: "Kesehatan Anda Prioritas Kami",
    body: "Periksakan kondisi kesehatan rutin Anda di Rumah Sakit Medika Lestari.",
  },
];

export function ServiceWorkerInitializer({
  debug = false,
}: ServiceWorkerInitializerProps) {
  useEffect(() => {
    const triggerDailyRandomNotification = (reg: ServiceWorkerRegistration) => {
      const NOTIF_KEY = "last_notification_sent_time";
      const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 24 jam

      const lastSent = localStorage.getItem(NOTIF_KEY);
      const now = Date.now();

      // Cek apakah belum pernah dikirim ATAU sudah lewat 24 jam
      if (!lastSent || now - parseInt(lastSent, 10) > ONE_DAY_MS) {
        // 1. Pilih pesan secara acak
        const randomIndex = Math.floor(Math.random() * RANDOM_MESSAGES.length);
        const selectedMessage = RANDOM_MESSAGES[randomIndex];

        // 2. Tentukan waktu delay secara acak (antara 1 menit hingga 30 menit)
        const minDelayMs = 1 * 60 * 1000;  // 1 menit
        const maxDelayMs = 30 * 60 * 1000; // 30 menit
        const randomDelayMs =
          Math.floor(Math.random() * (maxDelayMs - minDelayMs + 1)) + minDelayMs;

        if (debug) {
          console.log(
            `[SW Init] Notifikasi harian dijadwalkan muncul dalam ${(
              randomDelayMs / 60000
            ).toFixed(1)} menit dengan pesan: "${selectedMessage.title}"`
          );
        }

        setTimeout(() => {
          // Kirim notifikasi via Service Worker
          reg.showNotification(selectedMessage.title, {
            body: selectedMessage.body,
            icon: "/medikalestari.png",
            badge: "/medikalestari.png",
          });

          // Catat timestamp pengiriman terakhir ke localStorage
          localStorage.setItem(NOTIF_KEY, Date.now().toString());

          if (debug) {
            console.log("[SW Init] Notifikasi harian berhasil dikirim!");
          }
        }, randomDelayMs);
      } else if (debug) {
        console.log(
          "[SW Init] Notifikasi sudah dikirim dalam 24 jam terakhir. Melewati pemicu."
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

        if (
          typeof window !== "undefined" &&
          "Notification" in window &&
          Notification.permission === "granted" &&
          reg
        ) {
          triggerDailyRandomNotification(reg);
        }
      } catch (error) {
        console.error("[SW Init] Gagal register Service Worker:", error);
      }
    };

    registerSW();

    // Listen untuk request permission jika belum ditentukan
    if (typeof globalThis !== "undefined" && globalThis.window) {
      if ("Notification" in globalThis.window) {
        if (globalThis.window.Notification?.permission === "default") {
          globalThis.window.Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              navigator.serviceWorker.ready.then((reg) => {
                triggerDailyRandomNotification(reg);
              });
            }
          });
        }
      }
    }
  }, [debug]);

  return null;
}