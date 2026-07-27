import { getAuthProvider } from "../../config/providers";
import type { AuthAdapter } from "./types";
import { mockAuthAdapter } from "./mockAuthAdapter";
import { supabaseAuthAdapter } from "./supabaseAuthAdapter";

export function getAuthAdapter(): AuthAdapter {
  const provider = getAuthProvider();
  if (provider === "mock") {
    return mockAuthAdapter;
  }
  if (provider === "supabase") {
    return supabaseAuthAdapter;
  }
  throw new Error(`Auth provider "${provider}" is not configured yet.`);
}

export type { AuthAdapter, AuthUser, AuthSession, Plan } from "./types";
