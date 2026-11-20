// Helper Web Push di sisi browser (dipakai NotificationPrompt & ServiceWorkerInitializer)

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
const SW_PATH = "/sw.js";

export function isPushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const output = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

function sameKey(subscription: PushSubscription, key: Uint8Array) {
  const current = subscription.options?.applicationServerKey;
  if (!current) return false;
  const a = new Uint8Array(current);
  return a.length === key.length && a.every((v, i) => v === key[i]);
}

// navigator.serviceWorker.ready menggantung selamanya kalau belum ada SW yang didaftarkan,
// jadi pastikan SW terdaftar dulu.
export async function getRegistration() {
  const existing = await navigator.serviceWorker.getRegistration();
  if (!existing) await navigator.serviceWorker.register(SW_PATH);
  return navigator.serviceWorker.ready;
}

// Buat (atau pakai ulang) push subscription lalu simpan ke server.
// Izin notifikasi harus sudah "granted" sebelum fungsi ini dipanggil.
export async function subscribeToPush() {
  if (!VAPID_PUBLIC_KEY) {
    throw new Error("NEXT_PUBLIC_VAPID_PUBLIC_KEY belum diisi di .env.local");
  }

  const registration = await getRegistration();
  const key = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

  let subscription = await registration.pushManager.getSubscription();

  // Subscription lama dengan VAPID key berbeda akan ditolak server push: buat ulang.
  if (subscription && !sameKey(subscription, key)) {
    await subscription.unsubscribe();
    subscription = null;
  }

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: key,
    });
  }

  const response = await fetch("/api/save-subscription", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });
  if (!response.ok) {
    throw new Error(
      `Gagal menyimpan subscription ke server (${response.status})`,
    );
  }

  return registration;
}
