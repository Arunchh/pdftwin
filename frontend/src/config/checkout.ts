import { formatFileLimit, PRO_FILE_LIMIT_MB } from "./limits";
import { PRICING_PLANS } from "./pricing";

export const PRO_PLAN = PRICING_PLANS.find((plan) => plan.id === "pro")!;

export const CHECKOUT_PRICE = PRO_PLAN.price;
export const CHECKOUT_PERIOD = PRO_PLAN.period;
export const CHECKOUT_CURRENCY = "USD";

/** Set VITE_CHECKOUT_LIVE=true when backend PayPal billing is wired up. */
export const CHECKOUT_LIVE = import.meta.env.VITE_CHECKOUT_LIVE === "true";

export type CheckoutStep = "plan" | "confirm" | "pay" | "redirecting" | "success" | "cancelled";

export const CHECKOUT_TRUST_ITEMS = [
  {
    title: "PayPal secure checkout",
    description: "Payment details stay on PayPal — we never see your card or bank info.",
    icon: "shield" as const,
  },
  {
    title: "Cancel anytime",
    description: "Manage or cancel your subscription directly from your PayPal account.",
    icon: "refresh" as const,
  },
  {
    title: "No hidden fees",
    description: `${CHECKOUT_PRICE}/${CHECKOUT_PERIOD.replace("per ", "")}. No setup charges or surprise add-ons.`,
    icon: "receipt" as const,
  },
  {
    title: "Private by design",
    description: "Your documents and images are still processed in memory and never stored on our servers.",
    icon: "lock" as const,
  },
] as const;

export { SUBSCRIPTION_FAQ as CHECKOUT_FAQ } from "./faq";

export const PRO_CHECKOUT_SUMMARY = {
  name: "PDFTwin Pro",
  tagline: "Monthly subscription",
  fileLimit: formatFileLimit(PRO_FILE_LIMIT_MB),
  priceLabel: `${CHECKOUT_PRICE} ${CHECKOUT_CURRENCY}`,
  billingNote: "Billed monthly through PayPal until you cancel.",
};

export type CheckoutTrustIcon = (typeof CHECKOUT_TRUST_ITEMS)[number]["icon"];
