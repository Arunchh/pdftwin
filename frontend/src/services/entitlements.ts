import { FREE_FILE_LIMIT_MB, PRO_FILE_LIMIT_MB } from "../config/limits";
import type { AuthUser, Plan } from "../adapters/auth/types";

export interface Entitlements {
  plan: Plan;
  fileLimitMb: number;
  fileLimitBytes: number;
  label: string;
  isPro: boolean;
}

export function entitlementsForUser(user: AuthUser | null): Entitlements {
  const plan: Plan = user?.plan ?? "free";
  const fileLimitMb = plan === "pro" ? PRO_FILE_LIMIT_MB : FREE_FILE_LIMIT_MB;
  return {
    plan,
    fileLimitMb,
    fileLimitBytes: fileLimitMb * 1024 * 1024,
    label: plan === "pro" ? "Pro" : "Free",
    isPro: plan === "pro",
  };
}
