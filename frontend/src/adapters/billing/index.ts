import { getBillingProvider } from "../../config/providers";
import type { BillingAdapter } from "./types";
import { mockBillingAdapter } from "./mockBillingAdapter";

export function getBillingAdapter(): BillingAdapter {
  if (getBillingProvider() === "mock") {
    return mockBillingAdapter;
  }
  throw new Error(`Billing provider "${getBillingProvider()}" is not configured yet.`);
}

export type { BillingAdapter } from "./types";
