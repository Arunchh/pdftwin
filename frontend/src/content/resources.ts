import { formatFileLimit, FREE_DAILY_DOC_CONVERT_LIMIT, FREE_FILE_LIMIT_MB, FREE_MERGE_FILE_LIMIT, PRO_FILE_LIMIT_MB } from "../config/limits";
import { TOOL_COUNT } from "../config/tools";

export interface ResourceSection {
  id: string;
  title: string;
  body: string;
  bullets?: string[];
}

export const RESOURCES_META = {
  title: "How PDFTwin Works — Privacy, Architecture & File Handling | PDFTwin",
  description:
    "Learn how PDFTwin processes PDFs: client-side tools in your browser vs secure server conversion, file retention, limits, and why we never watermark free output.",
  h1: "How PDFTwin works",
  intro:
    "PDFTwin is a hybrid PDF workspace — fast client-side tools for everyday organize and privacy-sensitive work, plus secure server processing for conversions that need real layout engines. Here is exactly what happens to your files.",
  updated: "July 2026",
};

export const RESOURCES_SECTIONS: ResourceSection[] = [
  {
    id: "architecture",
    title: "Hybrid architecture",
    body:
      "We split tools by where the work actually belongs. Browser engines (pdf-lib, PDF.js, Tesseract.js) handle merge, split, rotate, compare, sign, remove pages, images-to-PDF, PDF-to-JPG, text extract, and OCR — your files never leave your device. Server-side Python and image pipelines handle PDF → Word/Excel, compress, watermark, lock/unlock, extract pages, and image convert/resize — then discard files immediately.",
    bullets: [
      "10 tools run entirely in your browser",
      "8 tools use secure in-memory server processing",
      "No permanent file storage on our servers",
      "Workspace file tray uses browser IndexedDB on your device",
    ],
  },
  {
    id: "privacy",
    title: "Privacy you can verify",
    body:
      "Inspired by transparent client-side tools like ihatepdf and Sejda Desktop, PDFTwin labels every tool with where processing happens. On client-side tools, open DevTools → Network while merging or comparing — you will see no file upload to our origin. Server tools encrypt transfers with HTTPS and delete files after the response completes.",
    bullets: [
      "Client tools: zero upload bytes to PDFTwin",
      "Server tools: in-memory only, discarded after processing",
      "We do not use your documents to train AI models",
      "Compare PDF renders locally with PDF.js",
    ],
  },
  {
    id: "limits",
    title: "Free vs Pro — why limits exist",
    body:
      "Unlike ad-funded unlimited tools (PDF24) or fully client-side stacks (ihatepdf), PDFTwin pays real server cost for Word/Excel conversion and compression. We keep the free tier generous — no watermarks, unlimited organize tools — and gate heavy server use instead of stamping logos on your exports.",
    bullets: [
      `Free: ${formatFileLimit(FREE_FILE_LIMIT_MB)} per file, merge up to ${FREE_MERGE_FILE_LIMIT} PDFs, ${FREE_DAILY_DOC_CONVERT_LIMIT}/day PDF → Word or Excel`,
      `Pro: ${formatFileLimit(PRO_FILE_LIMIT_MB)} per file, unlimited merge batch and document exports`,
      "Never: watermarks on free output",
      `${TOOL_COUNT} tools available on both plans`,
    ],
  },
  {
    id: "trust",
    title: "What we do not do (yet)",
    body:
      "PDFTwin is a focused web workspace — not a full document platform. We do not offer ISO certification pages, native mobile apps, or enterprise SSO today. We do offer honest limits, a Compare PDF differentiator, and multilingual guides for core workflows.",
    bullets: [
      "No Chrome extension or desktop app (web-first)",
      "No cloud file vault — workspace tray is local to your browser",
      "PayPal Pro billing; live checkout when VITE_CHECKOUT_LIVE is enabled",
      "See our FAQ for security, billing, and tool-specific questions",
    ],
  },
];

export const CLIENT_TOOLS = [
  "Merge & arrange",
  "Split PDF",
  "Rotate pages",
  "Compare PDFs",
  "Sign PDF",
  "Remove pages",
  "Images → PDF",
  "PDF → JPG/PNG",
  "PDF → text",
  "OCR",
];

export const SERVER_TOOLS = [
  "PDF → Word / Excel",
  "Word → PDF",
  "Compress PDF",
  "Watermark PDF",
  "Lock & unlock",
  "Extract pages",
  "Image convert",
  "Resize images",
];
