import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { AUTH_PROVIDER } from "../config/providers";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (AUTH_PROVIDER !== "supabase") {
    throw new Error("Supabase client requested while auth provider is not supabase.");
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Add them to frontend/.env."
    );
  }

  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return client;
}

export function isSupabaseConfigured(): boolean {
  return AUTH_PROVIDER === "supabase" && Boolean(supabaseUrl && supabaseAnonKey);
}
