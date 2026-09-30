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

// Daftar variasi pesan untuk testing
const TEST_MESSAGES = [
  {
    title: "Jika kamu sedang Sakit!",
    body: "Ayo segera periksa ke Rumah Sakit Medika Lestari",
  },
  {
    title: "Jaga Kesehatanmu! 🩺",
    body: "Jangan tunda konsultasi kesehatan bersama dokter spesialis RS Medika Lestari.",
  },
  {
    title: "Sudah Cek Kesehatan? 🏥",
    body: "Kunjungi RS Medika Lestari untuk layanan perawatan terbaik keluarga Anda.",
  },
  {
    title: "Butuh Layanan Medis? 🚑",
    body: "Jadwalkan janji temu dokter dengan cepat dan mudah di RS Medika Lestari.",
  },
];

export function ServiceWorkerInitializer({
  debug = false,
}: ServiceWorkerInitializerProps) {
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let messageIndex = 0;

    const startTestingNotifications = (reg: ServiceWorkerRegistration) => {
      const ONE_MINUTE_MS = 60 * 1000; // 1 menit

      if (debug) {
        console.log(
          "[SW Init Test] Memulai pengujian notifikasi setiap 1 menit...",
        );
      }

      // Fungsi untuk mengikis & mengirim pesan berurutan
      const sendNextNotification = () => {
        const currentMsg = TEST_MESSAGES[messageIndex];

        reg.showNotification(currentMsg.title, {
          body: currentMsg.body,
          icon: "/medikalestari.png", // Path gambar dari folder /public
          badge: "/medikalestari.png",
        });

        if (debug) {
          console.log(
            `[SW Init Test] Notifikasi dikirim (${messageIndex + 1}/${TEST_MESSAGES.length}):`,
            currentMsg.title,
          );
        }

        // Pindah ke pesan berikutnya (berputar kembali ke awal jika sudah habis)
        messageIndex = (messageIndex + 1) % TEST_MESSAGES.length;
      };

      // Jalankan pertama kali setelah 1 menit
      intervalId = setInterval(sendNextNotification, ONE_MINUTE_MS);
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
          startTestingNotifications(reg);
        }
      } catch (error) {
        console.error("[SW Init] Gagal register Service Worker:", error);
      }
    };

    registerSW();

    // Listen untuk request permission
    if (typeof globalThis !== "undefined" && globalThis.window) {
      if ("Notification" in globalThis.window) {
        if (globalThis.window.Notification?.permission === "default") {
          globalThis.window.Notification.requestPermission().then(
            (permission) => {
              if (permission === "granted") {
                navigator.serviceWorker.ready.then((reg) => {
                  startTestingNotifications(reg);
                });
              }
            },
          );
        }
      }
    }

    // Cleanup interval saat komponen unmount agar tidak terjadi kebocoran memori
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [debug]);

  return null;
}
