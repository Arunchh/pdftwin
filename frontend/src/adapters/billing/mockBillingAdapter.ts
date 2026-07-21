import { readSession } from "../../stores/authStore";
import type { BillingAdapter } from "./types";

export const mockBillingAdapter: BillingAdapter = {
  async getSubscription() {
    const { user } = readSession();
    if (!user) {
      return { plan: "free", status: "inactive" };
    }
    return {
      plan: user.plan,
      status: user.plan === "pro" ? "preview" : "inactive",
    };
  },

  async startCheckout() {
    return { preview: true };
  },
};
