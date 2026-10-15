"use client";

import { useEffect } from "react";

// Konversi VAPID Public Key dari string base64 ke Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushSubscriber() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window)
    ) {
      return;
    }

    const registerAndSubscribe = async () => {
      try {
        // 1. Registrasi Service Worker
        const registration = await navigator.serviceWorker.register("/sw.js");
        await navigator.serviceWorker.ready;

        // 2. Minta izin notifikasi jika belum diberikan
        let permission = Notification.permission;
        if (permission === "default") {
          permission = await Notification.requestPermission();
        }

        if (permission !== "granted") {
          console.log("Izin notifikasi ditolak.");
          return;
        }

        // 3. Ambil VAPID Public Key dari backend Anda (Ganti string di bawah dengan public key dari server Anda)
        const publicVapidKey = "MASUKKAN_VAPID_PUBLIC_KEY_ANDA_DI_SINI";
        if (publicVapidKey === "MASUKKAN_VAPID_PUBLIC_KEY_ANDA_DI_SINI") {
          console.warn("VAPID Public Key belum dikonfigurasi.");
          return;
        }

        // 4. Lakukan Subscribe ke Push Manager browser
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });

        // 5. Kirim objek subscription ini ke backend Anda agar disimpan ke database
        await fetch("/api/save-subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscription),
        });

        console.log("Berhasil berlangganan Web Push!");
      } catch (error) {
        console.error("Gagal melakukan setup Web Push:", error);
      }
    };

    registerAndSubscribe();
  }, []);

  return null;
}
