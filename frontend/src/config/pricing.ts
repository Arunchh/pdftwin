import { formatFileLimit, FREE_FILE_LIMIT_MB, PRO_FILE_LIMIT_MB } from "./limits";

export interface PricingPlan {
  id: "free" | "pro";
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  comingSoon?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need for everyday PDF tasks — no signup required.",
    features: [
      "All 5 core PDF tools",
      `Up to ${formatFileLimit(FREE_FILE_LIMIT_MB)} per file`,
      "Secure in-memory processing",
      "Works in any modern browser",
    ],
    cta: "Start for free",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "For teams and power users who handle large documents every day.",
    features: [
      "Everything in Free",
      `Up to ${formatFileLimit(PRO_FILE_LIMIT_MB)} per file`,
      "Priority processing queue",
      "Batch operations & saved presets",
      "Usage history & email support",
    ],
    cta: "Upgrade with PayPal",
    highlighted: true,
  },
];

export const TRUST_ITEMS = [
  {
    title: "Encrypted uploads",
    description: "Every transfer uses HTTPS — your files travel securely.",
    icon: "shield" as const,
  },
  {
    title: "Zero permanent storage",
    description: "Documents are processed in memory, then discarded immediately.",
    icon: "timer" as const,
  },
  {
    title: "Instant access",
    description: "No account, no install. Open a tool and start in seconds.",
    icon: "zap" as const,
  },
  {
    title: "Global filenames",
    description: "Hindi, Arabic, Japanese, and more stay intact on download.",
    icon: "globe" as const,
  },
] as const;

export type TrustIcon = (typeof TRUST_ITEMS)[number]["icon"];
