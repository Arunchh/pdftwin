import { BILLING_PROVIDER } from "../../config/providers";
import type { BillingAdapter } from "./types";
import { mockBillingAdapter } from "./mockBillingAdapter";

export function getBillingAdapter(): BillingAdapter {
  if (BILLING_PROVIDER === "mock") {
    return mockBillingAdapter;
  }
  throw new Error(`Billing provider "${BILLING_PROVIDER}" is not configured yet.`);
}

export type { BillingAdapter, BillingSubscription } from "./types";
