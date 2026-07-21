import { useEffect } from "react";
import { AUTH_PROVIDER } from "../../config/providers";
import { isSupabaseConfigured } from "../../lib/supabaseClient";
import {
  listenForSupabaseAuthChanges,
  syncSupabaseSession,
} from "../../adapters/auth/supabaseAuthAdapter";

export default function AuthProvider() {
  useEffect(() => {
    if (AUTH_PROVIDER !== "supabase" || !isSupabaseConfigured()) {
      return;
    }

    let cancelled = false;

    syncSupabaseSession().catch(() => {
      if (!cancelled) {
        /* session sync failed — auth store stays empty */
      }
    });

    const unsubscribe = listenForSupabaseAuthChanges();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return null;
}
