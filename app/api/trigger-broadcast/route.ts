import { NextResponse } from "next/server";
import webpush, { WebPushError } from "web-push";
import { PushSubscriptionData } from "../save-subscription/route";

webpush.setVapidDetails(
  "mailto:support@medika-lestari.com",
  process.env.VAPID_PUBLIC_KEY || "",
  process.env.PRIVATE_VAPID_KEY || "",
);

// Simulasi database (Gunakan database asli di lingkungan produksi)
let subscriptionsDB: PushSubscriptionData[] = [];

export async function POST() {
  const payload = JSON.stringify({
    title: "Kesehatan Anda Prioritas Kami",
    body: "Jangan tunda konsultasi kesehatan bersama dokter spesialis RS Medika Lestari.",
    icon: "/medikalestari.png",
    badge: "/medikalestari.png",
  });

  try {
    for (const sub of subscriptionsDB) {
      try {
        await webpush.sendNotification(sub, payload);
      } catch (error: unknown) {
        // Type narrowing untuk mengenali error dari web-push tanpa 'any'
        const webPushError = error as WebPushError;

        if (
          webPushError.statusCode === 410 ||
          webPushError.statusCode === 404
        ) {
          console.log(`[Push] Token kedaluwarsa, menghapus: ${sub.endpoint}`);
          subscriptionsDB = subscriptionsDB.filter(
            (s) => s.endpoint !== sub.endpoint,
          );
        } else {
          console.error(
            "[Push] Gagal mengirim notifikasi:",
            webPushError.message,
          );
        }
      }
    }

    return NextResponse.json({
      message: "Broadcast notifikasi berhasil dipicu!",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengirim broadcast" },
      { status: 500 },
    );
  }
}
