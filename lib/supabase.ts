import { createClient } from "@supabase/supabase-js";

function normalizeSupabaseUrl(raw?: string | null): string | null {
  if (!raw) return null;
  // remove trailing slashes
  let normalized = raw.replace(/\/+$|\s+$/g, "");
  // if someone mistakenly included /rest/v1, strip it
  normalized = normalized.replace(/\/rest\/v1$/i, "");
  return normalized;
}

// Custom fetch agar Next.js TIDAK menyimpan cache hasil request Supabase.
// Tanpa ini, fetch yang dijalankan di Server Component akan kena
// Next.js Data Cache (default force-cache) sehingga data basi di production
// meskipun di Supabase sudah berubah.
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

// Server-side Supabase client
// Priority: Service Role Key (untuk production/admin) → fallback ke Anon Key (untuk development)
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

  // Gunakan Service Role Key jika tersedia, jika tidak gunakan Anon Key
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