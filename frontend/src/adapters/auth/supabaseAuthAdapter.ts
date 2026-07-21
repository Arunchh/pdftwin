import type { AuthAdapter, AuthSession, AuthUser, Plan } from "./types";
import { getSupabaseClient } from "../../lib/supabaseClient";
import { readSession, writeSession } from "../../stores/authStore";

interface ProfileRow {
  plan: Plan;
}

function profilePlan(value: string | null | undefined): Plan {
  return value === "pro" ? "pro" : "free";
}

async function fetchProfilePlan(userId: string): Promise<Plan> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .maybeSingle<ProfileRow>();

  if (error) {
    throw new Error(error.message);
  }

  return profilePlan(data?.plan);
}

async function toAuthUser(userId: string, email: string): Promise<AuthUser> {
  const plan = await fetchProfilePlan(userId);
  return { id: userId, email, plan };
}

export const supabaseAuthAdapter: AuthAdapter = {
  getSession(): AuthSession {
    return readSession();
  },

  async signUp(email, password) {
    const normalized = email.trim().toLowerCase();
    if (!normalized || password.length < 6) {
      throw new Error("Use a valid email and a password with at least 6 characters.");
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email: normalized,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    const user = data.user;
    if (!user) {
      throw new Error("Sign up did not return a user. Check your email to confirm your account.");
    }

    const authUser = await toAuthUser(user.id, user.email ?? normalized);
    writeSession(authUser);
    return authUser;
  },

  async signIn(email, password) {
    const normalized = email.trim().toLowerCase();
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalized,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    const user = data.user;
    if (!user) {
      throw new Error("Sign in failed.");
    }

    const authUser = await toAuthUser(user.id, user.email ?? normalized);
    writeSession(authUser);
    return authUser;
  },

  async signOut() {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    writeSession(null);
  },

  async setPlan(plan) {
    const session = readSession();
    if (!session.user) {
      throw new Error("Sign in to change your plan.");
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from("profiles")
      .update({ plan })
      .eq("id", session.user.id);

    if (error) {
      throw new Error(error.message);
    }

    const updated = { ...session.user, plan };
    writeSession(updated);
    return updated;
  },
};

export async function syncSupabaseSession(): Promise<void> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    writeSession(null);
    return;
  }

  const user = data.session?.user;
  if (!user) {
    writeSession(null);
    return;
  }

  try {
    const authUser = await toAuthUser(user.id, user.email ?? "");
    writeSession(authUser);
  } catch {
    writeSession(null);
  }
}

export function listenForSupabaseAuthChanges(): () => void {
  const supabase = getSupabaseClient();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (_event, session) => {
    if (!session?.user) {
      writeSession(null);
      return;
    }

    try {
      const authUser = await toAuthUser(session.user.id, session.user.email ?? "");
      writeSession(authUser);
    } catch {
      writeSession(null);
    }
  });

  return () => subscription.unsubscribe();
}
