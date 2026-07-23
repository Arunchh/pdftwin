import {
  formatFileLimit,
  FREE_DAILY_DOC_CONVERT_LIMIT,
  FREE_FILE_LIMIT_MB,
  FREE_MERGE_FILE_LIMIT,
  PRO_FILE_LIMIT_MB,
} from "./limits";
import { TOOL_COUNT } from "./tools";

export interface FaqItem {
  question: string;
  answer: string;
  category: FaqCategory;
}

export type FaqCategory =
  | "getting-started"
  | "privacy-security"
  | "limits-pricing"
  | "tools"
  | "subscription";

export const FAQ_CATEGORIES: Record<FaqCategory, string> = {
  "getting-started": "Getting started",
  "privacy-security": "Privacy & security",
  "limits-pricing": "Free plan & limits",
  tools: "Tools & workflows",
  subscription: "Pro & billing",
};

/** General product FAQs — inspired by iLovePDF, Smallpdf, Sejda, PDF24, and ihatepdf help content. */
export const PRODUCT_FAQ: FaqItem[] = [
  {
    category: "getting-started",
    question: "Is PDFTwin free to use?",
    answer: `Yes. All ${TOOL_COUNT} tools are free with no watermark on output and no account required. Pro at $9/month is optional for larger files, unlimited PDF → Word/Excel exports, and merges with more than ${FREE_MERGE_FILE_LIMIT} PDFs.`,
  },
  {
    category: "getting-started",
    question: "Do I need to install software or create an account?",
    answer:
      "No install and no signup for the Free plan. Open a tool in your browser, upload or drop a file, and download the result. Pro checkout runs through PayPal when you choose to upgrade.",
  },
  {
    category: "getting-started",
    question: "Which browsers and devices are supported?",
    answer:
      "PDFTwin works in modern desktop and mobile browsers — Chrome, Firefox, Safari, and Edge. Client-side tools need JavaScript enabled. No browser extension is required.",
  },
  {
    category: "privacy-security",
    question: "Are my files uploaded to your servers?",
    answer:
      "It depends on the tool. Merge, split, rotate, compare, sign, remove pages, images-to-PDF, PDF-to-JPG, PDF-to-text, and OCR run entirely in your browser — files stay on your device. PDF → Word/Excel, compress, watermark, lock/unlock, extract pages, and image convert/resize use secure server processing and are discarded immediately after.",
  },
  {
    category: "privacy-security",
    question: "How long do you keep uploaded files?",
    answer:
      "Server-processed files are held in memory only for the duration of the request, then discarded. We do not store your documents for later download or use them to train AI models. Client-side tools never send file contents to our servers.",
  },
  {
    category: "privacy-security",
    question: "Is PDFTwin safe for confidential documents?",
    answer:
      "For contracts, HR files, or financial records, prefer client-side tools (merge, compare, sign, OCR, etc.) where processing stays in your browser. For server tools, files are encrypted in transit (HTTPS) and deleted after processing — similar to iLovePDF or Smallpdf retention policies, but without watermarks on free output.",
  },
  {
    category: "privacy-security",
    question: "Does PDFTwin add watermarks to free downloads?",
    answer:
      "Never. Free and Pro output is watermark-free. This is a deliberate difference from many freemium PDF sites that stamp logos on free exports.",
  },
  {
    category: "limits-pricing",
    question: "What are the Free plan file size limits?",
    answer: `Free users can upload files up to ${formatFileLimit(FREE_FILE_LIMIT_MB)} per file. Pro raises the limit to ${formatFileLimit(PRO_FILE_LIMIT_MB)} for server-heavy conversions and large documents.`,
  },
  {
    category: "limits-pricing",
    question: "How many PDFs can I merge on the Free plan?",
    answer: `You can merge up to ${FREE_MERGE_FILE_LIMIT} PDFs in one batch on Free. Need to combine more? Upgrade to Pro for unlimited merge batch size. Split, rotate, and compare are not batch-limited on Free.`,
  },
  {
    category: "limits-pricing",
    question: "Is there a daily limit on PDF → Word or Excel?",
    answer: `Free users get ${FREE_DAILY_DOC_CONVERT_LIMIT} PDF → Word or Excel exports per day. OCR, PDF-to-text, image extraction, and all client-side organize tools are not daily-capped. Pro removes the document export cap.`,
  },
  {
    category: "limits-pricing",
    question: "How does PDFTwin compare to iLovePDF or Smallpdf free tiers?",
    answer:
      "Many large PDF sites cap free tasks, add watermarks, or push sign-up mid-workflow. PDFTwin keeps organize and client-side convert tools unlimited with no watermarks. We monetize Pro on server-heavy work — large files, unlimited Word/Excel exports, and big merges — not on trick downloads.",
  },
  {
    category: "tools",
    question: "How does Compare PDF work?",
    answer:
      "Upload two PDFs on the Compare tool page. PDFTwin renders them side by side in your browser using PDF.js. Enable linked scroll to keep both panes aligned, and linked zoom to inspect details at the same magnification. Files are not uploaded for viewing.",
  },
  {
    category: "tools",
    question: "How good is PDF → Word conversion?",
    answer:
      "PDFTwin uses server-side libraries tuned for business documents — layout, tables, and headings are preserved where possible. Complex scans or heavily designed PDFs may need manual cleanup in Word; for scanned pages use OCR first, then edit the text output.",
  },
  {
    category: "tools",
    question: "Which image formats can I convert?",
    answer:
      "Upload PNG, JPG, WebP, GIF, BMP, or TIFF and export as WebP, PNG, or JPEG. You can also extract embedded images from PDFs. Images-to-PDF accepts common image types and exports a combined PDF in your browser.",
  },
  {
    category: "tools",
    question: "What OCR languages are supported?",
    answer:
      "OCR supports English, Spanish, French, German, Dutch, Portuguese, and Italian. OCR runs locally in your browser with Tesseract.js — scanned PDFs and photos never leave your device.",
  },
  {
    category: "tools",
    question: "Is Sign PDF a legally binding e-signature?",
    answer:
      "PDFTwin adds a visual signature image (draw or upload PNG). For regulated contracts or eIDAS-qualified signatures, confirm requirements with your jurisdiction. It is ideal for internal approvals, NDAs, and forms that accept image signatures.",
  },
  {
    category: "tools",
    question: "Can I use PDFTwin offline?",
    answer:
      "Client-side tools may work after the page loads if your browser caches assets, but PDFTwin is designed as an online workspace. Server tools always need a connection. For fully offline PDF work, a desktop app like PDF24 Creator or Sejda Desktop is a better fit.",
  },
  {
    category: "tools",
    question: "What is the workspace file tray?",
    answer:
      "The file tray stores files in your browser (IndexedDB) so you can switch between tools without re-uploading. Data stays on your device until you clear it or remove site data from your browser.",
  },
];

export const SUBSCRIPTION_FAQ: FaqItem[] = [
  {
    category: "subscription",
    question: "When does PDFTwin Pro activate?",
    answer:
      "Pro access begins as soon as PayPal confirms your subscription. Larger file limits and priority processing apply on your next upload.",
  },
  {
    category: "subscription",
    question: "Can I keep using the Free plan?",
    answer:
      "Yes. All tools stay free with no signup and no watermarks. Pro is optional when you need larger files, merges with more than five PDFs, unlimited PDF → Word/Excel exports, or faster server processing.",
  },
  {
    category: "subscription",
    question: "How much does Pro cost and how often am I billed?",
    answer:
      "PDFTwin Pro is $9 USD per month. PayPal bills you automatically each month until you cancel from your PayPal account.",
  },
  {
    category: "subscription",
    question: "Is there a free trial for Pro?",
    answer:
      "There is no separate trial period. The Free plan lets you use every tool at no cost. Upgrade to Pro only when you need the higher limits and extras.",
  },
  {
    category: "subscription",
    question: "What is included in Pro compared to Free?",
    answer: `Free includes all ${TOOL_COUNT} tools with up to ${formatFileLimit(FREE_FILE_LIMIT_MB)} per file, merge up to ${FREE_MERGE_FILE_LIMIT} PDFs at once, ${FREE_DAILY_DOC_CONVERT_LIMIT} PDF → Word or Excel exports per day, and unlimited client-side organize tools. Pro raises the file limit to ${formatFileLimit(PRO_FILE_LIMIT_MB)}, removes merge and daily export caps, and adds priority processing.`,
  },
  {
    category: "subscription",
    question: "How do I cancel my subscription?",
    answer:
      "Sign in to PayPal, go to Settings → Payments → Manage automatic payments, select PDFTwin Pro, and cancel. You keep Pro until the current billing period ends.",
  },
  {
    category: "subscription",
    question: "What payment methods does PayPal accept?",
    answer:
      "PayPal supports major credit and debit cards, bank accounts, and PayPal balance — depending on your country. All payment details stay on PayPal's secure checkout.",
  },
  {
    category: "subscription",
    question: "Can I get a refund?",
    answer:
      "Subscriptions are billed through PayPal. Refund requests are handled under PayPal's buyer and seller policies. Contact support if you need help with a billing issue.",
  },
  {
    category: "subscription",
    question: "Do I need a PDFTwin account to subscribe?",
    answer:
      "Not today. Checkout runs through PayPal. Account linking for subscription management on PDFTwin is planned for a future update.",
  },
  {
    category: "subscription",
    question: "Is checkout secure?",
    answer:
      "Yes. Payment is completed on PayPal's encrypted site. PDFTwin never receives or stores your card number or bank credentials.",
  },
];

export const ALL_FAQ: FaqItem[] = [...PRODUCT_FAQ, ...SUBSCRIPTION_FAQ];

export function faqByCategory(category: FaqCategory): FaqItem[] {
  return ALL_FAQ.filter((item) => item.category === category);
}
