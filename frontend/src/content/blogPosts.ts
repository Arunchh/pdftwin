import type { ToolId } from "../config/tools";

export type BlogCategory = "product" | "how-to" | "privacy";

export interface BlogSection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  metaDescription: string;
  publishedAt: string;
  readMinutes: number;
  category: BlogCategory;
  h1: string;
  intro: string;
  sections: BlogSection[];
  toolId?: ToolId;
  relatedSlugs?: string[];
}

export const BLOG_CATEGORIES: Record<BlogCategory, string> = {
  product: "Product guides",
  "how-to": "How-to guides",
  privacy: "Privacy & trust",
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "compare-pdf-contract-review",
    title: "Compare Two PDFs for Contract Review — Side by Side | PDFTwin",
    metaDescription:
      "Review contract revisions with side-by-side PDF compare, linked scroll, and zoom. Free in your browser — files never uploaded for viewing.",
    publishedAt: "2026-07-01",
    readMinutes: 5,
    category: "product",
    h1: "Compare two PDFs for contract review",
    intro:
      "Legal and ops teams lose hours flipping between PDF versions. Side-by-side compare with linked scroll keeps both documents aligned so you spot clause changes faster — without emailing files to a third-party viewer.",
    toolId: "pdf-compare",
    relatedSlugs: ["merge-pdf-free", "split-pdf-online"],
    sections: [
      {
        heading: "Why side-by-side beats print-and-highlight",
        paragraphs: [
          "iLovePDF and Adobe offer compare features, but many free workflows still mean printing two versions or scrolling one file while guessing what changed. PDFTwin renders both PDFs in your browser with PDF.js — no upload for viewing.",
          "Enable linked scroll so page 12 on the left stays aligned with page 12 on the right. Toggle linked zoom when reviewing fine print in MSAs or SOWs.",
        ],
      },
      {
        heading: "Step by step",
        paragraphs: ["Open Compare PDF, add the older version on the left and the newer version on the right."],
        bullets: [
          "Turn on linked scroll for synchronized reading",
          "Zoom in on redlines or table changes with linked zoom",
          "Use Split or Extract if you need to share only changed sections",
        ],
      },
      {
        heading: "When to use Compare vs Word redlines",
        paragraphs: [
          "Compare PDF is best when both parties share PDF exports. If you have editable Word track changes, stay in Word. For signed PDFs or scanned contracts, compare view is the practical choice.",
        ],
      },
    ],
  },
  {
    slug: "merge-pdf-no-watermark",
    title: "Merge PDF Without Watermark — Free & Honest Limits | PDFTwin",
    metaDescription:
      "Combine PDFs free with no watermark. PDFTwin merges in your browser — up to 5 files on Free, unlimited batch on Pro.",
    publishedAt: "2026-07-08",
    readMinutes: 4,
    category: "product",
    h1: "Merge PDF without watermark",
    intro:
      "Many “free” merge tools stamp logos on the last page or hide batch merge behind Pro. PDFTwin merges in your browser with pdf-lib — no watermark, ever — and clear batch limits instead of surprise upsells.",
    toolId: "arrange-merge",
    relatedSlugs: ["split-pdf-online", "compress-pdf-free"],
    sections: [
      {
        heading: "How PDFTwin merge differs",
        paragraphs: [
          "Smallpdf and iLovePDF merge on their servers — fine for casual use, but files leave your device. ihatepdf merges locally with no limits. PDFTwin merges locally too, with a Free cap of five PDFs per batch (Pro unlimited) because we monetize server-heavy conversion, not organize tools.",
        ],
      },
      {
        heading: "Quick merge workflow",
        bullets: [
          "Upload two or more PDFs on Merge & Arrange",
          "Drag documents and pages into order",
          "Click Merge and download — no account, no watermark",
        ],
      },
      {
        heading: "Tips for business packets",
        paragraphs: [
          "Combine cover sheet, scope, pricing, and terms before client send. Use Compress PDF afterward if email rejects the attachment size — see our email limit guide.",
        ],
      },
    ],
  },
  {
    slug: "pdf-to-word-business-documents",
    title: "PDF to Word for Business Documents — When Server Conversion Wins | PDFTwin",
    metaDescription:
      "Convert business PDFs to editable Word with layout preservation. Free tier includes 3 exports/day; Pro unlimited.",
    publishedAt: "2026-07-15",
    readMinutes: 5,
    category: "product",
    h1: "PDF to Word for business documents",
    intro:
      "Browser-only PDF → Word tools struggle on multi-column reports, nested tables, and branded templates. PDFTwin uses server-side conversion for layout-heavy business PDFs — the same class of engine iLovePDF and Smallpdf rely on.",
    toolId: "convert-extract",
    relatedSlugs: ["pdf-to-word-free", "word-to-pdf-free"],
    sections: [
      {
        heading: "When browser conversion is not enough",
        paragraphs: [
          "Pure client-side converters (including ihatepdf for complex files) work for simple text PDFs. Proposals, financial statements, and policy docs need structure-aware conversion — that is why PDFTwin processes Word exports on the server and deletes files immediately after.",
        ],
      },
      {
        heading: "Free vs Pro exports",
        paragraphs: [
          "Free includes three PDF → Word or Excel exports per day — enough for occasional edits. Heavy teams upgrade to Pro for unlimited exports and 200 MB files.",
        ],
      },
      {
        heading: "After conversion",
        bullets: [
          "Review tables and headers in Word — tweak fonts if brand guidelines require it",
          "For scanned PDFs, run OCR first, then edit text output",
          "Round-trip back to PDF with Word → PDF when the client needs a share-ready file",
        ],
      },
    ],
  },
  {
    slug: "compress-pdf-email-limits",
    title: "Compress PDF for Email Limits — Gmail, Outlook & Portals | PDFTwin",
    metaDescription:
      "PDF too large for email? Compress or split to fit Gmail 25MB, Outlook limits, and upload portals. Step-by-step guide.",
    publishedAt: "2026-06-10",
    readMinutes: 8,
    category: "how-to",
    h1: "Compress PDF for email and upload limits",
    intro:
      "Gmail blocks attachments over 25 MB. Outlook and corporate gateways often cap lower. Job portals and visa systems sometimes require under 2 MB. This guide walks through realistic compression workflows — inspired by help articles from iLovePDF, Smallpdf, and ihatepdf’s size-target guides.",
    toolId: "compress-pdf",
    relatedSlugs: ["compress-pdf-free", "split-pdf-online"],
    sections: [
      {
        heading: "Step 1 — Measure the problem",
        paragraphs: [
          "Check your PDF size in file properties. If you are 30 MB on a 25 MB email limit, moderate compression may be enough. If you are 80 MB, combine compress + split.",
        ],
      },
      {
        heading: "Step 2 — Compress with the right preset",
        paragraphs: [
          "Open Compress PDF and choose medium compression for contracts with photos, or high compression for text-heavy reports. PDFTwin processes on secure servers and discards the file after download — similar retention model to iLovePDF’s two-hour deletion policy, without watermarks.",
        ],
        bullets: [
          "Medium — balance quality and size for client deliverables",
          "High — smaller files for portals with strict caps",
          "If still too large, split appendices into a second PDF",
        ],
      },
      {
        heading: "Step 3 — Split instead of over-compressing",
        paragraphs: [
          "Over-compression blurs scans and charts. Split exhibits or backup tables into separate files. Merge again on the recipient side if needed.",
        ],
      },
      {
        heading: "Portal-specific targets",
        bullets: [
          "Email (Gmail): aim under 20 MB for headroom",
          "Government / visa uploads: often 2–5 MB — compress then remove non-essential pages",
          "ATS résumé uploads: keep under 1 MB — export a text-focused PDF or compress heavily",
        ],
      },
    ],
  },
  {
    slug: "sign-pdf-without-printing",
    title: "Sign a PDF Without Printing — Draw or Upload Your Signature | PDFTwin",
    metaDescription:
      "Add a signature to PDF documents in your browser. Draw on canvas or upload PNG — no print, scan, or watermark.",
    publishedAt: "2026-06-18",
    readMinutes: 7,
    category: "how-to",
    h1: "Sign a PDF without printing or scanning",
    intro:
      "Smallpdf, Sejda, and iLovePDF all push e-sign workflows — often with accounts or paid tiers for tracking. PDFTwin adds a visual signature image client-side: draw on the canvas or upload a transparent PNG, place it on any page, download — files stay on your device.",
    toolId: "sign-pdf",
    relatedSlugs: ["sign-pdf-online", "merge-pdf-free"],
    sections: [
      {
        heading: "When image signature is enough",
        paragraphs: [
          "Internal approvals, contractor NDAs, and school forms often accept a visual signature. Regulated industries may require qualified e-signatures (DocuSign, Adobe Sign) — PDFTwin is not that class of product.",
        ],
      },
      {
        heading: "Create a reusable signature PNG",
        bullets: [
          "Sign white paper, photograph or scan, crop to transparent PNG",
          "Or draw once in Sign PDF and save the output page as your template",
          "Use dark ink — light gray signatures fail on projectors and prints",
        ],
      },
      {
        heading: "Place and download",
        paragraphs: [
          "Upload the PDF, create or upload your signature, drag it into position, and download. Processing runs with pdf-lib in your browser — nothing uploaded to PDFTwin servers.",
        ],
      },
    ],
  },
  {
    slug: "client-side-vs-server-pdf-tools",
    title: "Client-Side vs Server PDF Tools — What Stays on Your Device | PDFTwin",
    metaDescription:
      "Understand which PDF tools run in your browser vs on a server. Privacy comparison inspired by ihatepdf, Sejda, and iLovePDF security pages.",
    publishedAt: "2026-06-25",
    readMinutes: 9,
    category: "privacy",
    h1: "Client-side vs server-side PDF tools",
    intro:
      "ihatepdf popularized “no upload” PDF tools. iLovePDF and Smallpdf explain HTTPS encryption and hourly file deletion. Sejda offers a desktop app for offline work. PDFTwin combines both models — here is how to choose.",
    relatedSlugs: ["compare-pdf-online", "pdf-to-word-free"],
    sections: [
      {
        heading: "Client-side (browser) processing",
        paragraphs: [
          "Merge, split, rotate, compare, sign, remove pages, images-to-PDF, PDF-to-JPG, text extract, and OCR run with pdf-lib, PDF.js, or Tesseract.js in your tab. Verify in DevTools: no file bytes hit our servers.",
        ],
        bullets: [
          "Best for: NDAs, HR records, unreleased financials, compare review",
          "Trade-off: very large files can stress browser memory",
          "Similar philosophy to ihatepdf; PDFTwin adds Compare as a focus tool",
        ],
      },
      {
        heading: "Server-side processing",
        paragraphs: [
          "PDF → Word/Excel, compress, watermark, lock/unlock, extract pages, and image convert/resize need heavier engines. Files upload over HTTPS, process in memory, and are discarded after the response — like iLovePDF’s documented two-hour max retention, but PDFTwin does not keep files for later re-download.",
        ],
        bullets: [
          "Best for: layout-heavy Word export, strong compression, batch image convert",
          "Free tier: 50 MB files, 3 Word/Excel exports/day, merge up to 5 PDFs",
          "Pro: 200 MB files, unlimited exports and merge batch",
        ],
      },
      {
        heading: "What about PDF24 and Sejda?",
        paragraphs: [
          "PDF24 funds free web tools with ads and offers an offline Creator. Sejda’s web tier limits free tasks but provides a desktop app where files stay local. PDFTwin is web-first with a clear split: organize locally, convert on server when quality matters.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getBlogPostsByCategory(category: BlogCategory): BlogPost[] {
  return BLOG_POSTS.filter((post) => post.category === category);
}
