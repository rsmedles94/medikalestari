"use client";

import { useState, useSyncExternalStore } from "react";
import { isPushSupported, subscribeToPush } from "@/lib/push-client";

type PermissionValue = NotificationPermission | "unsupported";

// Status izin dibaca langsung dari browser lewat useSyncExternalStore:
// server selalu "unsupported" sehingga tidak ada hydration mismatch.
const subscribePermission = (onChange: () => void) => {
  let cancelled = false;
  let status: PermissionStatus | undefined;

  // event "change" ikut memperbarui banner kalau izin diubah lewat ikon gembok
  navigator.permissions
    ?.query({ name: "notifications" })
    .then((s) => {
      if (cancelled) return;
      status = s;
      s.addEventListener("change", onChange);
    })
    .catch(() => {});

  return () => {
    cancelled = true;
    status?.removeEventListener("change", onChange);
  };
};
const getPermissionSnapshot = (): PermissionValue =>
  isPushSupported() ? Notification.permission : "unsupported";
const getPermissionServerSnapshot = (): PermissionValue => "unsupported";

export function NotificationPrompt() {
  const permission = useSyncExternalStore(
    subscribePermission,
    getPermissionSnapshot,
    getPermissionServerSnapshot,
  );
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEnableNotification = async () => {
    setState("loading");
    setErrorMessage("");

    try {
      // 1. Minta izin (harus dari klik user)
      const result = await Notification.requestPermission();
      if (result !== "granted") {
        setState("idle");
        return;
      }

      // 2. Subscribe ke push dan simpan ke server
      const registration = await subscribeToPush();

      // 3. Notifikasi langsung sebagai bukti notifikasi sudah aktif
      await registration.showNotification("Notifikasi aktif", {
        body: "Terima kasih! Anda akan menerima pengingat kesehatan dari RS Medika Lestari.",
        icon: "/medikalestari.png",
        badge: "/medikalestari.png",
        tag: "welcome",
      });

      setState("idle");
    } catch (error) {
      console.error("Gagal mengaktifkan notifikasi:", error);
      setErrorMessage((error as Error).message || "Terjadi kesalahan.");
      setState("error");
    }
  };

  // Tampil saat izin belum ditentukan, atau saat izin sudah diberikan tapi pendaftarannya gagal
  const visible = permission === "default" || state === "error";
  if (!visible) return null;

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
          {state === "error" && (
            <p className="mt-2 text-xs text-red-600">
              Gagal mengaktifkan: {errorMessage}
            </p>
          )}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleEnableNotification}
              disabled={state === "loading"}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition disabled:opacity-60"
            >
              {state === "loading"
                ? "Mengaktifkan..."
                : state === "error"
                  ? "Coba Lagi"
                  : "Izinkan Notifikasi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
