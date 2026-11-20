import { promises as fs } from "fs";
import path from "path";

export interface PushSubscriptionData {
  endpoint: string;
  expirationTime?: number | null;
  keys: { p256dh: string; auth: string };
}

// Penyimpanan subscription yang DIPAKAI BERSAMA oleh semua route.
// - Cache di globalThis: sama untuk save-subscription & send-notification, tahan hot-reload.
// - Disimpan juga ke file .data/push-subscriptions.json (jalan di VPS / server sendiri).
// - Di hosting serverless (mis. Vercel) file tidak persisten: ganti isi fungsi di bawah
//   dengan database (Prisma, Supabase, Upstash Redis, dll). Signature fungsinya tetap.
const FILE = path.join(process.cwd(), ".data", "push-subscriptions.json");

const g = globalThis as unknown as { __pushSubs?: PushSubscriptionData[] };

async function load(): Promise<PushSubscriptionData[]> {
  if (g.__pushSubs) return g.__pushSubs;

  let list: PushSubscriptionData[] = [];
  try {
    const parsed: unknown = JSON.parse(await fs.readFile(FILE, "utf8"));
    if (Array.isArray(parsed)) list = parsed.filter(isValidSubscription);
  } catch {
    // file belum ada: mulai dari kosong
  }
  g.__pushSubs = list;
  return list;
}

async function persist(list: PushSubscriptionData[]) {
  try {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(list, null, 2));
  } catch (error) {
    console.warn(
      "[Push] Tidak bisa menulis file, data hanya tersimpan di memori:",
      (error as Error).message,
    );
  }
}

export function isValidSubscription(
  value: unknown,
): value is PushSubscriptionData {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Partial<PushSubscriptionData>;
  return (
    typeof v.endpoint === "string" &&
    v.endpoint.startsWith("https://") &&
    typeof v.keys?.p256dh === "string" &&
    typeof v.keys?.auth === "string"
  );
}

export async function listSubscriptions() {
  return load();
}

export async function saveSubscription(sub: PushSubscriptionData) {
  const list = await load();
  const entry: PushSubscriptionData = {
    endpoint: sub.endpoint,
    expirationTime: sub.expirationTime ?? null,
    keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
  };
  const index = list.findIndex((s) => s.endpoint === entry.endpoint);
  if (index >= 0) list[index] = entry;
  else list.push(entry);
  await persist(list);
}

export async function removeSubscription(endpoint: string) {
  const list = (await load()).filter((s) => s.endpoint !== endpoint);
  g.__pushSubs = list;
  await persist(list);
}
