import { AUTH_PROVIDER } from "../../config/providers";
import type { AuthAdapter } from "./types";
import { mockAuthAdapter } from "./mockAuthAdapter";

export function getAuthAdapter(): AuthAdapter {
  if (AUTH_PROVIDER === "mock") {
    return mockAuthAdapter;
  }
  throw new Error(`Auth provider "${AUTH_PROVIDER}" is not configured yet.`);
}

export type { AuthAdapter, AuthUser, AuthSession, Plan } from "./types";
