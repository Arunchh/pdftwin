export interface BillingSubscription {
  plan: "free" | "pro";
  status: "active" | "inactive" | "preview";
  renewsAt?: string;
}

export interface BillingAdapter {
  getSubscription(): Promise<BillingSubscription>;
  startCheckout(): Promise<{ checkoutUrl?: string; preview: boolean }>;
}
