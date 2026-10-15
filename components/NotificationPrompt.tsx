"use client";

import { useState } from "react";

// Fungsi helper untuk VAPID key frontend
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

export function NotificationPrompt() {
  // Perbaikan: Inisialisasi status langsung di useState tanpa useEffect
  const [permissionStatus, setPermissionStatus] = useState<
    NotificationPermission | "loading"
  >(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission;
    }
    return "denied";
  });

  const handleEnableNotification = async () => {
    try {
      // 1. Minta izin ke browser
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);

      if (permission === "granted") {
        // 2. Pastikan Service Worker aktif
        const registration = await navigator.serviceWorker.ready;

        // 3. Ambil VAPID Public Key dari Environment Variables
        const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!publicVapidKey) {
          console.error("VAPID Public Key belum diset di .env.local");
          return;
        }

        // 4. Lakukan Push Subscription
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });

        // 5. Kirim data subscription ke backend API
        await fetch("/api/save-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription),
        });

        alert(
          "Berhasil! Anda sekarang akan menerima pengingat kesehatan harian.",
        );
      } else {
        alert(
          "Izin notifikasi ditolak. Anda bisa mengubahnya kapan saja melalui ikon gembok di samping URL browser.",
        );
      }
    } catch (error) {
      console.error("Gagal mengaktifkan notifikasi:", error);
    }
  };

  // Jika izin sudah diberikan atau browser tidak mendukung, sembunyikan banner
  if (
    permissionStatus === "granted" ||
    permissionStatus === "loading" ||
    permissionStatus === "denied"
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl bg-white p-4 shadow-2xl border border-gray-100 dark:bg-zinc-900 dark:border-zinc-800">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
          🔔
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            Aktifkan Pengingat Kesehatan
          </h4>
          <p className="mt-1 text-xs text-gray-500 dark:text-zinc-400">
            Dapatkan tips medis harian dan info jadwal dokter langsung di
            perangkat Anda.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleEnableNotification}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition"
            >
              Izinkan Notifikasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
