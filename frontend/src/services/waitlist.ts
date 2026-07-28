import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabaseClient";

export interface WaitlistResult {
  duplicate: boolean;
}

export async function joinWaitlist(email: string, name?: string): Promise<WaitlistResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const trimmedName = name?.trim() || undefined;

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("waitlist_signups").insert({
      email: normalizedEmail,
      name: trimmedName ?? null,
      source: "banner",
    });

    if (error) {
      if (error.code === "23505") {
        return { duplicate: true };
      }
      throw new Error(error.message || "Could not join the waitlist. Please try again.");
    }

    return { duplicate: false };
  }

  const response = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: normalizedEmail, name: trimmedName }),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    detail?: string;
    duplicate?: boolean;
  };

  if (!response.ok) {
    throw new Error(payload.detail || "Could not join the waitlist. Please try again.");
  }

  return { duplicate: Boolean(payload.duplicate) };
}
