import { createClient } from "@supabase/supabase-js";

function normalizeSupabaseUrl(raw?: string | null): string | null {
  if (!raw) return null;
  // logic hapus trailing slash
  let normalized = raw.replace(/\/+$|\s+$/g, "");
  // logic hapus endpoint /rest/v1 jika tidak sengaja disertakan
  normalized = normalized.replace(/\/rest\/v1$/i, "");
  return normalized;
}

// logic custom fetch untuk mematikan next.js data cache agar data selalu fresh di production
const noStoreFetch: typeof fetch = (input, init) => {
  return fetch(input, { ...init, cache: "no-store" });
};

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || null;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null;

const supabaseUrl = normalizeSupabaseUrl(rawSupabaseUrl);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("[Supabase] Missing or invalid configuration:", {
    NEXT_PUBLIC_SUPABASE_URL: rawSupabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? "SET" : "MISSING",
  });
  throw new Error(
    "Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set and NEXT_PUBLIC_SUPABASE_URL does NOT include /rest/v1",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: noStoreFetch,
  },
});

// logic inisialisasi client sisi server dengan prioritas service role key lalu anon key
export function createServerSupabaseClient() {
  const urlRaw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const url = normalizeSupabaseUrl(urlRaw);
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    const error = new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL environment variable",
    );
    console.error("[Supabase Server]", error.message);
    throw error;
  }

  // logic pilih service role key jika ada jika kosong gunakan anon key
  const key = serviceRoleKey || anonKey;

  if (!key) {
    const error = new Error(
      "Missing Supabase keys. Ensure SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is set.",
    );
    console.error("[Supabase Server]", error.message);
    throw error;
  }

  if (!serviceRoleKey) {
    console.warn(
      "[Supabase Server] ⚠️  Using ANON_KEY fallback. For production, set SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(url, key, {
    global: {
      fetch: noStoreFetch,
    },
  });
}
