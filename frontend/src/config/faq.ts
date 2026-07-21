import { formatFileLimit, FREE_FILE_LIMIT_MB, PRO_FILE_LIMIT_MB } from "./limits";

export interface FaqItem {
  question: string;
  answer: string;
}

export const SUBSCRIPTION_FAQ: FaqItem[] = [
  {
    question: "When does PDFTwin Pro activate?",
    answer:
      "Pro access begins as soon as PayPal confirms your subscription. Larger file limits and priority processing apply on your next upload.",
  },
  {
    question: "Can I keep using the Free plan?",
    answer:
      "Yes. All twelve conversion and PDF tools stay free with no signup. Pro is optional when you need bigger files, WebP batch exports, or faster processing.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "Sign in to PayPal, go to Settings → Payments → Manage automatic payments, select PDFTwin Pro, and cancel. You keep Pro until the current billing period ends.",
  },
  {
    question: "What payment methods does PayPal accept?",
    answer:
      "PayPal supports major credit and debit cards, bank accounts, and PayPal balance — depending on your country. All payment details stay on PayPal's secure checkout.",
  },
  {
    question: "Are my PDF files stored after I subscribe?",
    answer:
      "No. Pro does not change how files are handled. Documents are processed in memory and discarded immediately — the same privacy model as the Free plan.",
  },
  {
    question: "What is included in Pro compared to Free?",
    answer: `Free includes all twelve tools — PDF conversion, image conversion, Word to PDF, resize, compress, watermark, rotate, side-by-side compare, merge, split, extract, and protect — with up to ${formatFileLimit(FREE_FILE_LIMIT_MB)} per file. Pro raises the limit to ${formatFileLimit(PRO_FILE_LIMIT_MB)}, adds priority processing, batch-friendly workflows, and email support.`,
  },
  {
    question: "Is there a free trial for Pro?",
    answer:
      "There is no separate trial period. The Free plan lets you use every tool at no cost. Upgrade to Pro only when you need the higher limits and extras.",
  },
  {
    question: "How much does Pro cost and how often am I billed?",
    answer:
      "PDFTwin Pro is $7 USD per month. PayPal bills you automatically each month until you cancel from your PayPal account.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Subscriptions are billed through PayPal. Refund requests are handled under PayPal's buyer and seller policies. Contact us at support if you need help with a billing issue.",
  },
  {
    question: "Do I need a PDFTwin account to subscribe?",
    answer:
      "Not today. Checkout runs through PayPal. Account linking for subscription management on PDFTwin is planned for a future update.",
  },
  {
    question: "What happens if a monthly payment fails?",
    answer:
      "PayPal will retry the charge and notify you by email. If payment cannot be collected, Pro access may pause until billing is resolved in PayPal.",
  },
  {
    question: "Can I upgrade, downgrade, or switch back to Free?",
    answer:
      "You can cancel Pro anytime in PayPal and continue using the Free plan immediately. There is no long-term contract.",
  },
  {
    question: "Is checkout secure?",
    answer:
      "Yes. Payment is completed on PayPal's encrypted site. PDFTwin never receives or stores your card number or bank credentials.",
  },
  {
    question: "How does PDF compare work?",
    answer:
      "Upload two PDFs on the Compare tool page. PDFTwin renders them side by side in your browser. Toggle linked scroll to keep both panes aligned as you read, and linked zoom to inspect details at the same magnification.",
  },
  {
    question: "Which image formats can I convert?",
    answer:
      "Upload PNG, JPG, WebP, GIF, BMP, or TIFF and export as WebP, PNG, or JPEG. You can also extract embedded images from PDFs and choose the same output formats.",
  },
  {
    question: "Which browsers and devices are supported?",
    answer:
      "PDFTwin works in modern desktop and mobile browsers — Chrome, Firefox, Safari, and Edge. No install required.",
  },
];
