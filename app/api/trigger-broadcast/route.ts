import { NextResponse } from "next/server";
import webpush from "web-push";
import { listSubscriptions, removeSubscription } from "@/lib/push-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Satu pesan dipilih acak tiap broadcast
const MESSAGES = [
  {
    title: "Jika kamu sedang Sakit!",
    body: "Ayo segera periksa ke Rumah Sakit Medika Lestari.",
  },
  {
    title: "Jaga Kesehatanmu Hari Ini",
    body: "Jangan tunda konsultasi kesehatan bersama dokter spesialis di RS Medika Lestari.",
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

// Hanya pemanggil yang membawa PUSH_SEND_SECRET yang boleh memicu broadcast
function isAuthorized(request: Request) {
  const secret = process.env.PUSH_SEND_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

async function handler(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.PRIVATE_VAPID_KEY;
  if (!publicKey || !privateKey) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_VAPID_PUBLIC_KEY / PRIVATE_VAPID_KEY belum diisi" },
      { status: 500 },
    );
  }

  // setVapidDetails dipanggil di dalam handler (bukan di level modul)
  // supaya build tidak error saat env belum tersedia
  webpush.setVapidDetails(
    "mailto:support@medika-lestari.com",
    publicKey,
    privateKey,
  );

  // Opsional: body JSON { "title": "...", "body": "..." } untuk tes pesan sendiri
  let custom: { title?: string; body?: string } = {};
  try {
    custom = await request.json();
  } catch {
    // tanpa body: pakai pesan acak
  }
  const random = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

  const payload = JSON.stringify({
    title: custom.title ?? random.title,
    body: custom.body ?? random.body,
    icon: "/medikalestari.png",
    badge: "/medikalestari.png",
    url: "/",
  });

  const subscriptions = await listSubscriptions();
  let sent = 0;
  let removed = 0;
  let failed = 0;

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, payload, { TTL: 60 * 60 * 12 });
      sent++;
    } catch (error) {
      const status = (error as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) {
        // subscription sudah tidak berlaku (user mencabut izin / reinstall browser)
        await removeSubscription(sub.endpoint);
        removed++;
      } else {
        failed++;
        console.error("[Push] Gagal kirim:", status, (error as Error).message);
      }
    }
  }

  return NextResponse.json({
    total: subscriptions.length,
    sent,
    removed,
    failed,
  });
}

// GET ikut disediakan karena sebagian layanan cron hanya bisa memanggil GET
export { handler as GET, handler as POST };
