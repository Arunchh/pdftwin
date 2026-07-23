import { formatFileLimit, FREE_DAILY_DOC_CONVERT_LIMIT, FREE_FILE_LIMIT_MB, PRO_FILE_LIMIT_MB } from "../../config/limits";
import type { Messages } from "../types";

const freeLimit = formatFileLimit(FREE_FILE_LIMIT_MB);
const proLimit = formatFileLimit(PRO_FILE_LIMIT_MB);

export const en: Messages = {
  meta: {
    siteName: "PDFTwin",
    homeTitle: "PDFTwin — Business File Conversion | PDF, Word, Excel & WebP",
    homeDescription:
      "PDFTwin is the one-stop file conversion workspace for businesses. Convert PDFs, images, merge documents, compare revisions, and protect files in your browser.",
    pricingTitle: "Pricing | PDFTwin",
    pricingDescription:
      "Start free with all twelve business file tools. Upgrade to PDFTwin Pro for larger files and unlimited PDF exports.",
    formatsTitle: "Supported Formats | PDFTwin",
    formatsDescription:
      "See every document and image format PDFTwin converts for business teams — PDF, Word, Excel, WebP, and more.",
    toolTitleSuffix: "PDFTwin",
  },
  language: {
    label: "Language",
    en: "English",
    es: "Español",
    fr: "Français",
    nl: "Nederlands",
  },
  nav: {
    allTools: "All tools",
    convert: "Convert",
    organize: "Organize",
    protect: "Protect",
    formats: "Formats",
    pricing: "Pricing",
    signIn: "Sign in",
    account: "Account",
    upgradePro: "Upgrade to Pro",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    main: "Main",
  },
  hero: {
    titleLead: "One workspace for every",
    titleHighlight: " file format your business touches",
    description:
      "Convert PDFs to Word and Excel, export WebP-ready images, compare contract revisions side by side, merge reports, and protect confidential files — without switching tools.",
    openWorkspace: "Open the workspace",
    seeFormats: "See supported formats",
    footnote: "Pro adds higher limits and priority processing for growing teams.",
    statTools: "Business tools",
    statFreeLimit: "Free per file",
    statInstall: "Install required",
  },
  toolGrid: {
    heading: "One upload, every business format",
    subheading:
      "Pick a tool below and upload once. Switch between PDF and image tasks without starting over.",
    categoryHints: {
      convert: "Turn PDFs and images into the formats your team delivers to clients",
      organize: "Combine, split, compare, and pull pages from business documents",
      security: "Protect confidential contracts and financial files",
    },
    categories: {
      convert: "Convert & Export",
      organize: "Organize Documents",
      security: "Protect Files",
    },
  },
  trust: [
    {
      title: "Encrypted uploads",
      description: "Every transfer uses HTTPS — contracts and assets travel securely.",
    },
    {
      title: "Zero permanent storage",
      description: "Files are processed in memory, then discarded immediately.",
    },
    {
      title: "Instant access",
      description: "No install or IT rollout. Open a tool and convert in seconds.",
    },
    {
      title: "Global filenames",
      description: "Hindi, Arabic, Japanese, and more stay intact on download.",
    },
  ],
  formats: {
    heading: "Formats your business already uses",
    subheading:
      "PDFTwin covers everyday document and image workflows — so your team stops jumping between single-purpose tools.",
    highlights: [
      "PDF → Word, Excel, or image assets",
      "Word (DOCX) → PDF for client-ready delivery",
      "PNG, JPG, GIF, BMP → WebP, PNG, or JPEG",
      "Compress, watermark, merge, split, and rotate PDFs",
      "Side-by-side PDF compare with linked scroll & zoom",
      "Password-protect sensitive business files",
    ],
    inputs: [
      { ext: "PDF", use: "Documents, reports, contracts" },
      { ext: "DOCX", use: "Editable exports from PDF" },
      { ext: "XLSX", use: "Tables and structured data" },
      { ext: "PNG", use: "Lossless graphics and screenshots" },
      { ext: "JPG", use: "Photos and compressed images" },
      { ext: "WebP", use: "Web-ready, lightweight images" },
      { ext: "GIF", use: "Simple graphics and animations" },
      { ext: "BMP / TIFF", use: "Legacy and print workflows" },
    ],
  },
  pricing: {
    heading: "Pricing built for business teams",
    subheading:
      "Start free with every conversion tool. Upgrade to Pro when you need bigger files and unlimited PDF exports — billed securely through PayPal.",
    bestForTeams: "Best for teams",
    trustFooter:
      "Trusted checkout. PayPal handles payment security, subscription billing, and cancellation — so you stay in control.",
    faqHeading: "Subscription FAQ",
    checkoutSuccess: "Thanks! Your PayPal subscription is being activated.",
    checkoutCancelled: "Checkout was cancelled. You can try again anytime.",
    freePeriod: "forever",
    proPeriod: "month",
    plans: {
      free: {
        name: "Free",
        description: "Everything a small team needs to convert, organize, and protect business files.",
        cta: "Start for free",
        features: [
          "All 12 conversion and PDF tools",
          `Up to ${freeLimit} per file`,
          `${FREE_DAILY_DOC_CONVERT_LIMIT} PDF → Word or Excel exports per day`,
          "Merge, split & rotate on your device — no upload",
          "No watermark, no account required",
        ],
      },
      pro: {
        name: "Pro",
        description: "For businesses that process large documents and heavy conversions every day.",
        cta: "Upgrade with PayPal",
        features: [
          "Everything in Free",
          `Up to ${proLimit} per file`,
          "Unlimited PDF → Word & Excel exports",
          "Priority processing queue",
          "Batch conversions & saved presets",
        ],
      },
    },
    faq: [
      {
        question: "Which tools run on my device vs. your servers?",
        answer:
          "Merge, split, rotate, and compare run entirely in your browser — files never leave your device. PDF → Word, PDF → Excel, compress, watermark, lock/unlock, and image tools use secure server processing and are discarded immediately after.",
      },
      {
        question: "What happens when I hit the daily Word/Excel export limit?",
        answer: `Free users can export ${FREE_DAILY_DOC_CONVERT_LIMIT} PDFs to Word or Excel per day. Image extraction and other tools are not capped. Upgrade to Pro for unlimited document exports.`,
      },
      {
        question: "How much does Pro cost?",
        answer:
          "PDFTwin Pro is $9 USD per month. PayPal bills you automatically each month until you cancel from your PayPal account.",
      },
    ],
  },
  footer: {
    tools: "Tools",
    formats: "Formats",
    pricing: "Pricing",
    signIn: "Sign in",
    account: "Account",
    privacy: "Privacy",
    terms: "Terms",
    faq: "FAQ",
    upgradePro: "Upgrade to Pro",
    note: "Files are processed in memory and never stored permanently. Pro subscriptions are billed securely through PayPal — cancel anytime from your PayPal account.",
    tagline: "The one-stop file conversion workspace for modern businesses.",
  },
  tools: {
    "convert-extract": {
      name: "Document Conversion",
      shortLabel: "Convert",
      description: "Export PDFs to Word, Excel, or web-ready image assets for your team",
    },
    "image-convert": {
      name: "Image Conversion",
      shortLabel: "Images",
      description: "Convert PNG, JPG, GIF, and BMP files to WebP, PNG, or JPEG in one step",
    },
    "compress-pdf": {
      name: "Compress PDF",
      shortLabel: "Compress",
      description: "Reduce PDF file size for email attachments and faster client downloads",
    },
    "word-to-pdf": {
      name: "Word to PDF",
      shortLabel: "Word→PDF",
      description: "Convert DOCX proposals and contracts into share-ready PDF files",
    },
    "image-resize": {
      name: "Resize Images",
      shortLabel: "Resize",
      description: "Resize and compress images for email, web, and slide decks",
    },
    "pdf-compare": {
      name: "Compare PDFs",
      shortLabel: "Compare",
      description: "View two PDFs side by side with linked scroll and zoom for contract review",
    },
    "arrange-merge": {
      name: "Merge & Arrange",
      shortLabel: "Merge",
      description: "Combine proposals, invoices, and reports into a single client-ready PDF",
    },
    split: {
      name: "Split PDF",
      shortLabel: "Split",
      description: "Break large contracts and decks into separate files by page range",
    },
    "extract-pages": {
      name: "Extract Pages",
      shortLabel: "Extract",
      description: "Pull only the pages you need into a new PDF for sharing or approval",
    },
    "rotate-pdf": {
      name: "Rotate Pages",
      shortLabel: "Rotate",
      description: "Rotate all pages or selected pages by 90°, 180°, or 270°",
    },
    "watermark-pdf": {
      name: "Watermark PDF",
      shortLabel: "Watermark",
      description: "Add a confidential or draft watermark across every page",
    },
    "lock-unlock": {
      name: "Lock & Unlock",
      shortLabel: "Protect",
      description: "Add password protection to confidential files or remove restrictions securely",
    },
  },
  seoLanding: {
    benefitsTitle: "Why use PDFTwin",
    stepsTitle: "How it works",
    faqTitle: "Frequently asked questions",
    relatedTitle: "Related tools",
  },
};
