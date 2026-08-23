import { formatFileLimit, FREE_DAILY_DOC_CONVERT_LIMIT, FREE_FILE_LIMIT_MB, FREE_MERGE_FILE_LIMIT, PRO_FILE_LIMIT_MB } from "../../config/limits";
import type { Messages } from "../types";

const freeLimit = formatFileLimit(FREE_FILE_LIMIT_MB);
const proLimit = formatFileLimit(PRO_FILE_LIMIT_MB);

export const en: Messages = {
  meta: {
    siteName: "PDFTwin",
    homeTitle: "PDFTwin — Compare PDFs Side by Side Free | PDF Tools for Business",
    homeDescription:
      "Compare two PDFs online with linked scroll, zoom, and single-page review — runs in your browser, files never uploaded for viewing. Merge, split, convert, sign, and protect documents in one workspace.",
    pricingTitle: "Pricing | PDFTwin",
    pricingDescription:
      "Start free with all business file tools. Upgrade to PDFTwin Pro for larger files and unlimited PDF exports.",
    formatsTitle: "Supported Formats | PDFTwin",
    formatsDescription:
      "See every document and image format PDFTwin converts for business teams — PDF, Word, Excel, WebP, and more.",
    toolsIndexTitle: "All PDF Tools — Compare, Merge, Convert & Edit | PDFTwin",
    toolsIndexDescription:
      "Browse all 18 PDFTwin tools: compare PDFs side by side, merge, split, convert to Word, OCR, watermark, sign, compress, and more — free in your browser.",
    toolTitleSuffix: "PDFTwin",
  },
  language: {
    label: "Language",
    en: "English",
    es: "Español",
    fr: "Français",
    nl: "Nederlands",
    pt: "Português",
  },
  nav: {
    allTools: "All tools",
    pdfFrom: "From PDF",
    toPdf: "To PDF",
    pdfOps: "Edit PDF",
    formats: "Formats",
    pricing: "Pricing",
    signIn: "Sign in",
    account: "Account",
    upgradePro: "Upgrade to Pro",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    main: "Main",
    browseToolIndex: "Browse full tool index",
  },
  hero: {
    titleLead: "Compare two PDFs",
    titleHighlight: " side by side — free in your browser",
    description:
      "Review contract revisions and design proofs with linked scroll, real zoom, and single-page mode. When you are done comparing, extract pages, merge approvals, convert to Word, and sign — without leaving PDFTwin.",
    compareNow: "Compare PDFs now",
    seeAllTools: "Browse all tools",
    seeCompareGuide: "Compare PDF guide",
    footnote: "Compare runs locally with PDF.js — viewing never uploads your files. Pro adds higher limits for conversion tools.",
    trustChips: [
      "Client-side PDF compare",
      "Linked scroll & zoom",
      "No account required",
    ],
    visualCaption: "Linked scroll · Zoom · Single-page review",
  },
  home: {
    workflow: {
      heading: "From first draft to signed PDF",
      subheading:
        "After you compare, these tools finish the review workflow without switching apps.",
      steps: [
        {
          title: "Extract what changed",
          description: "Pull only the pages you need into a new PDF for approval or redlines.",
          toolId: "extract-pages",
        },
        {
          title: "Merge the final pack",
          description: "Combine approved sections, cover pages, and appendices into one client-ready file.",
          toolId: "arrange-merge",
        },
        {
          title: "Sign and protect",
          description: "Add your signature and password-protect the finished document before sending.",
          toolId: "sign-pdf",
        },
      ],
    },
    complementary: {
      heading: "More tools for document workflows",
      subheading:
        "Scan by the job — convert a file, reshape the pages, or lock it before you send.",
      groups: {
        export: {
          title: "Export from PDF",
          description: "Need a Word file, spreadsheet, image, or selectable text from a PDF?",
        },
        create: {
          title: "Create a PDF",
          description: "Start from Word or photos — or convert and resize images before you share them.",
        },
        pages: {
          title: "Reshape the pages",
          description: "Split a file, pull pages out, drop extras, rotate, or merge several PDFs.",
        },
        finish: {
          title: "Finish and protect",
          description: "Compress for email, watermark a draft, add a signature, or lock the file.",
        },
      },
    },
  },
  toolsIndex: {
    heading: "All PDFTwin tools",
    subheading:
      "Every business PDF and conversion tool in one place — grouped the same way as the navigation menu. Pick a tool to open its workspace.",
    breadcrumb: "All tools",
    compareCta: "Compare PDFs now",
    homeCta: "Back to home workspace",
  },
  compare: {
    setupTitle: "Choose two PDFs to compare",
    setupDescription:
      "Add your left and right PDFs in the panel on the right, then click Compare to open the side-by-side viewer.",
    setupAwaitingFiles: "Add both PDFs using the upload slots on the right, then click Compare.",
    setupReadyHint: "Both PDFs are ready — click Compare in the panel on the right.",
    fileTrayTitle: "Your documents",
    fileTrayDescription: "Add a left and right PDF, then compare them side by side.",
    leftSlotLabel: "Left",
    rightSlotLabel: "Right",
    leftSlotPlaceholder: "Drop your left PDF here",
    rightSlotPlaceholder: "Drop your right PDF here",
    browsePdf: "Browse PDF",
    slotEmptyHint: "PDF only · drag and drop or browse",
    compareButton: "Compare",
    leftLabel: "Left PDF",
    rightLabel: "Right PDF",
    remove: "Remove",
    addFromTray: "Add PDFs to the workspace tray above, then pick a file here.",
    enterReview: "Open compare viewer",
    changeDocuments: "Change documents",
    swapDocuments: "Swap left and right",
    scrollLinked: "Scroll linked",
    scrollIndependent: "Scroll independent",
    zoomLinked: "Zoom linked",
    zoomIndependent: "Zoom independent",
    zoomOut: "Zoom out",
    zoomIn: "Zoom in",
    zoomOutRight: "Zoom out right pane",
    zoomInRight: "Zoom in right pane",
    fitWidth: "Fit width",
    viewContinuous: "Continuous scroll",
    viewSinglePage: "Single page",
    pageOf: "Page {current} of {total}",
    prevPage: "Previous page",
    nextPage: "Next page",
    fullscreen: "Full screen",
    exitFullscreen: "Exit full screen",
    loading: "Loading PDF…",
    preparingViewer: "Preparing viewer…",
    pages: "pages",
    privacyHint:
      "PDF only · up to {limit} per file · compare renders locally in your browser — no upload for viewing",
    viewerMode: "Viewer",
    diffMode: "Diff",
    chooseDiffMode: "Analysis mode",
    modeOff: "Viewer only — manual side-by-side review",
    modeText: "Text changes — line-by-line redline",
    modeVisual: "Visual changes — highlight pixels that differ",
    modeOverlay: "Overlay — blend both pages at 50%",
    textDiffLabel: "Text diff",
    overlayLabel: "Blended overlay",
    sensitivity: "Sensitivity",
    analyzing: "Analyzing page {current} of {total}…",
    analyzeFailed: "Could not analyze these PDFs for differences.",
    changesFound: "{count} changed page(s)",
    noChangesFound: "No differences found",
    changed: "Changed",
    prevChange: "Previous change",
    nextChange: "Next change",
    noTextOnPage: "No selectable text on this page.",
  },
  toolGrid: {
    heading: "One upload, every business format",
    subheading:
      "Pick a tool below and upload once. Switch between PDF and image tasks without starting over.",
    categoryHints: {
      "pdf-from": "Export PDFs to Word, Excel, images, or plain text",
      "to-pdf": "Turn Word documents, images, and photos into PDF files",
      "pdf-ops": "Start with one PDF, or pick a multi-file tool when you need to combine or compare documents",
    },
    categories: {
      "pdf-from": "PDF to Other Formats",
      "to-pdf": "Convert to PDF",
      "pdf-ops": "Work with PDFs",
    },
    subcategories: {
      documents: "Documents",
      images: "Images",
      pages: "Pages & layout",
      markup: "Markup & signing",
      protect: "Optimize & protect",
    },
    inputScopes: {
      single: {
        title: "One PDF",
        hint: "Upload a single file — split, rotate, sign, watermark, compress, or protect it",
      },
      multi: {
        title: "Multiple PDFs",
        hint: "Upload two or more files — merge them together or compare side by side",
      },
    },
    inputScopeBadges: {
      single: "1 PDF",
      multi: "2+ PDFs",
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
          "All conversion and PDF tools",
          `Up to ${freeLimit} per file`,
          `Merge up to ${FREE_MERGE_FILE_LIMIT} PDFs at once`,
          `${FREE_DAILY_DOC_CONVERT_LIMIT} PDF → Word or Excel exports per day`,
          "Client-side tools run on your device — no upload",
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
          "Unlimited merge batch size",
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
          "Merge, split, rotate, compare, sign, images-to-PDF, PDF-to-image, text extract, and OCR run entirely in your browser — files never leave your device. PDF → Word, PDF → Excel, compress, watermark, lock/unlock, and image convert/resize use secure server processing and are discarded immediately after.",
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
  waitlist: {
    ariaLabel: "Launch announcement",
    badge: "Launching Soon",
    headline: "PDFTwin is almost here — be first in line",
    subtext: "Join the waitlist for early access and exclusive launch-day offers.",
    nameLabel: "Your name",
    namePlaceholder: "Your name (optional)",
    emailLabel: "Email address",
    emailPlaceholder: "you@company.com",
    submit: "Join waitlist",
    submitting: "Joining…",
    success: "You're on the list! We'll email you when we launch.",
    alreadyJoined: "You're already on the waitlist — we'll be in touch soon.",
    error: "Something went wrong. Please try again.",
    dismiss: "Dismiss announcement",
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
    resources: "How it works",
    blog: "Blog",
    compare: "Compare",
    upgradePro: "Upgrade to Pro",
    note: "Files are processed in memory and never stored permanently. Pro subscriptions are billed securely through PayPal — cancel anytime from your PayPal account.",
    tagline: "Compare PDFs side by side and finish document workflows in one browser workspace.",
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
    "images-to-pdf": {
      name: "Images to PDF",
      shortLabel: "Img→PDF",
      description: "Combine JPG, PNG, and other images into one share-ready PDF document",
    },
    "pdf-to-jpg": {
      name: "PDF to JPG",
      shortLabel: "PDF→JPG",
      description: "Export PDF pages as JPG or PNG images for slides, email, and social posts",
    },
    "pdf-to-text": {
      name: "PDF to Text",
      shortLabel: "PDF→Text",
      description: "Extract selectable text from PDFs into an editable .txt file",
    },
    "ocr-pdf": {
      name: "OCR Text Extract",
      shortLabel: "OCR",
      description: "Turn scanned PDFs and photos into editable text with optical character recognition",
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
    "remove-pages": {
      name: "Remove Pages",
      shortLabel: "Remove",
      description: "Delete unwanted pages from a PDF without splitting the whole file",
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
    "sign-pdf": {
      name: "Sign PDF",
      shortLabel: "Sign",
      description: "Add your handwritten or uploaded signature to PDF pages",
    },
  },
  seoLanding: {
    benefitsTitle: "Why use PDFTwin",
    stepsTitle: "How it works",
    faqTitle: "Frequently asked questions",
    relatedTitle: "Related tools",
  },
};
