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
    description: "Everything a small team needs to convert, organize, and protect business files.",
    features: [
      "All 12 conversion and PDF tools",
      `Up to ${formatFileLimit(FREE_FILE_LIMIT_MB)} per file`,
      "PDF, Word, Excel, and image exports",
      "Secure in-memory processing",
      "No account required",
    ],
    cta: "Start for free",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "For businesses that process large documents and image assets every day.",
    features: [
      "Everything in Free",
      `Up to ${formatFileLimit(PRO_FILE_LIMIT_MB)} per file`,
      "Priority processing queue",
      "Batch conversions & saved presets",
      "Email support for your team",
    ],
    cta: "Upgrade with PayPal",
    highlighted: true,
  },
];

export const TRUST_ITEMS = [
  {
    title: "Encrypted uploads",
    description: "Every transfer uses HTTPS — contracts and assets travel securely.",
    icon: "shield" as const,
  },
  {
    title: "Zero permanent storage",
    description: "Files are processed in memory, then discarded immediately.",
    icon: "timer" as const,
  },
  {
    title: "Instant access",
    description: "No install or IT rollout. Open a tool and convert in seconds.",
    icon: "zap" as const,
  },
  {
    title: "Global filenames",
    description: "Hindi, Arabic, Japanese, and more stay intact on download.",
    icon: "globe" as const,
  },
] as const;

export type TrustIcon = (typeof TRUST_ITEMS)[number]["icon"];
