import { NextResponse } from "next/server";
import { isValidSubscription, saveSubscription } from "@/lib/push-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body harus JSON" }, { status: 400 });
  }

  if (!isValidSubscription(body)) {
    return NextResponse.json(
      { error: "Subscription tidak valid" },
      { status: 400 },
    );
  }

  await saveSubscription(body);
  return NextResponse.json({ success: true });
}
