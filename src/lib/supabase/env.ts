export interface SupabaseEnv {
  url: string;
  key: string;
}

// Reads the client-side Supabase credentials. Both are safe to expose to the
// browser (publishable key + URL); missing values fail fast at first use.
export function getSupabaseEnv(): SupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local.",
    );
  }
  return { url, key };
}