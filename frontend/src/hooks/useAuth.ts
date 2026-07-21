import { useCallback } from "react";
import { getAuthAdapter } from "../adapters/auth";
import type { Plan } from "../adapters/auth/types";
import { useAuthSession } from "../stores/authStore";
import { entitlementsForUser } from "../services/entitlements";

export function useAuth() {
  const { user } = useAuthSession();
  const adapter = getAuthAdapter();
  const entitlements = entitlementsForUser(user);

  const signUp = useCallback(
    (email: string, password: string) => adapter.signUp(email, password),
    [adapter]
  );

  const signIn = useCallback(
    (email: string, password: string) => adapter.signIn(email, password),
    [adapter]
  );

  const signOut = useCallback(() => adapter.signOut(), [adapter]);

  const setPlan = useCallback((plan: Plan) => adapter.setPlan(plan), [adapter]);

  return {
    user,
    isAuthenticated: Boolean(user),
    entitlements,
    signUp,
    signIn,
    signOut,
    setPlan,
  };
}
