import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client
// Priority: Service Role Key (untuk production/admin) → fallback ke Anon Key (untuk development)
export function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
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

  return createClient(url, key);
}
