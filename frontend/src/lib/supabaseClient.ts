import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getAuthProvider } from "../config/providers";
import { getRuntimeEnv } from "../config/runtimeEnv";

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (getAuthProvider() !== "supabase") {
    throw new Error("Supabase client requested while auth provider is not supabase.");
  }

  const { supabaseUrl, supabaseAnonKey } = getRuntimeEnv();
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
  const { supabaseUrl, supabaseAnonKey } = getRuntimeEnv();
  return getAuthProvider() === "supabase" && Boolean(supabaseUrl && supabaseAnonKey);
}
