import { NextResponse } from "next/server";

export interface PushSubscriptionData {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// Gunakan 'const' karena array hanya dimutasi isinya (.push), bukan di-reassign
const subscriptionsDB: PushSubscriptionData[] = [];

export async function POST(request: Request) {
  try {
    const subscription: PushSubscriptionData = await request.json();

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json(
        { error: "Data subscription tidak valid" },
        { status: 400 },
      );
    }

    const exists = subscriptionsDB.some(
      (sub) => sub.endpoint === subscription.endpoint,
    );
    if (!exists) {
      subscriptionsDB.push(subscription);
    }

    return NextResponse.json(
      { message: "Subscription berhasil disimpan." },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memproses subscription" },
      { status: 500 },
    );
  }
}
