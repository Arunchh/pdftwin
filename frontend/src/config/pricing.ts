import {
  formatFileLimit,
  FREE_DAILY_DOC_CONVERT_LIMIT,
  FREE_FILE_LIMIT_MB,
  FREE_MERGE_FILE_LIMIT,
  PRO_FILE_LIMIT_MB,
} from "./limits";
import { TOOL_COUNT } from "./tools";

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
      `All ${TOOL_COUNT} conversion and PDF tools`,
      `Up to ${formatFileLimit(FREE_FILE_LIMIT_MB)} per file`,
      `Merge up to ${FREE_MERGE_FILE_LIMIT} PDFs at once`,
      `${FREE_DAILY_DOC_CONVERT_LIMIT} PDF → Word or Excel exports per day`,
      "Client-side tools run on your device — no upload",
      "No watermark, no account required",
    ],
    cta: "Start for free",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "For businesses that process large documents and heavy conversions every day.",
    features: [
      "Everything in Free",
      `Up to ${formatFileLimit(PRO_FILE_LIMIT_MB)} per file`,
      "Unlimited merge batch size",
      "Unlimited PDF → Word & Excel exports",
      "Priority processing queue",
      "Batch conversions & saved presets",
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
