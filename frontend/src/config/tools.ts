import type { LucideIcon } from "lucide-react";
import type { Locale } from "../i18n/types";
import {
  AlignLeft,
  BookImage,
  Combine,
  Columns2,
  FileMinus,
  FileOutput,
  FileSpreadsheet,
  FileText,
  Image,
  ImageDown,
  Layers,
  LockKeyhole,
  Maximize2,
  PenLine,
  RotateCw,
  ScanText,
  Shrink,
  Stamp,
} from "lucide-react";

export type ToolId =
  | "convert-extract"
  | "image-convert"
  | "image-resize"
  | "compress-pdf"
  | "word-to-pdf"
  | "images-to-pdf"
  | "pdf-to-jpg"
  | "pdf-to-text"
  | "ocr-pdf"
  | "arrange-merge"
  | "split"
  | "extract-pages"
  | "remove-pages"
  | "rotate-pdf"
  | "pdf-compare"
  | "watermark-pdf"
  | "lock-unlock"
  | "sign-pdf";

/** Top-level grouping shown in the tool grid and navigation. */
export type ToolCategory = "pdf-from" | "to-pdf" | "pdf-ops";

/** How many source files the tool expects — drives single vs multi PDF columns. */
export type InputScope = "single" | "multi";

/** Optional sub-grouping within a category. */
export type ToolSubcategory = "documents" | "images" | "pages" | "markup" | "protect";

export interface ToolDefinition {
  id: ToolId;
  name: string;
  shortLabel: string;
  description: string;
  category: ToolCategory;
  /** Single-file vs multi-file — shown on cards and used to split pdf-ops UI. */
  inputScope?: InputScope;
  subcategory?: ToolSubcategory;
  icon: LucideIcon;
  /** Legacy hash — redirected to `path` */
  hash: string;
  /** URL segment under /tools/ */
  path: string;
}

export const TOOL_COUNT = 18;

export const CATEGORY_ORDER: ToolCategory[] = ["pdf-from", "to-pdf", "pdf-ops"];

export const INPUT_SCOPE_ORDER: InputScope[] = ["single", "multi"];

export const SUBCATEGORY_ORDER: Partial<Record<ToolCategory, ToolSubcategory[]>> = {
  "to-pdf": ["documents", "images"],
};

/** Sub-headings inside the single-PDF column of pdf-ops. */
export const SINGLE_PDF_SUBCATEGORY_ORDER: ToolSubcategory[] = ["pages", "markup", "protect"];

export const TOOL_CATEGORIES: Record<ToolCategory, string> = {
  "pdf-from": "PDF to Other Formats",
  "to-pdf": "Convert to PDF",
  "pdf-ops": "Work with PDFs",
};

export const TOOLS: ToolDefinition[] = [
  // — PDF → other formats (always one PDF) —
  {
    id: "convert-extract",
    name: "Document Conversion",
    shortLabel: "Convert",
    description: "Export PDFs to Word, Excel, or web-ready image assets for your team",
    category: "pdf-from",
    inputScope: "single",
    icon: FileSpreadsheet,
    hash: "convert",
    path: "convert",
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    shortLabel: "PDF→JPG",
    description: "Export PDF pages as JPG or PNG images for slides, email, and social posts",
    category: "pdf-from",
    inputScope: "single",
    icon: ImageDown,
    hash: "pdf-to-jpg",
    path: "pdf-to-jpg",
  },
  {
    id: "pdf-to-text",
    name: "PDF to Text",
    shortLabel: "PDF→Text",
    description: "Extract selectable text from PDFs into an editable .txt file",
    category: "pdf-from",
    inputScope: "single",
    icon: AlignLeft,
    hash: "pdf-to-text",
    path: "pdf-to-text",
  },
  {
    id: "ocr-pdf",
    name: "OCR Text Extract",
    shortLabel: "OCR",
    description: "Turn scanned PDFs and photos into editable text with optical character recognition",
    category: "pdf-from",
    inputScope: "single",
    icon: ScanText,
    hash: "ocr",
    path: "ocr",
  },
  // — Other formats → PDF —
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    shortLabel: "Word→PDF",
    description: "Convert DOCX proposals and contracts into share-ready PDF files",
    category: "to-pdf",
    inputScope: "single",
    subcategory: "documents",
    icon: FileText,
    hash: "word-to-pdf",
    path: "word-to-pdf",
  },
  {
    id: "images-to-pdf",
    name: "Images to PDF",
    shortLabel: "Img→PDF",
    description: "Combine JPG, PNG, and other images into one share-ready PDF document",
    category: "to-pdf",
    inputScope: "multi",
    subcategory: "documents",
    icon: BookImage,
    hash: "images-to-pdf",
    path: "images-to-pdf",
  },
  {
    id: "image-convert",
    name: "Image Conversion",
    shortLabel: "Images",
    description: "Convert PNG, JPG, GIF, and BMP files to WebP, PNG, or JPEG in one step",
    category: "to-pdf",
    inputScope: "multi",
    subcategory: "images",
    icon: Image,
    hash: "images",
    path: "images",
  },
  {
    id: "image-resize",
    name: "Resize Images",
    shortLabel: "Resize",
    description: "Resize and compress images for email, web, and slide decks",
    category: "to-pdf",
    inputScope: "multi",
    subcategory: "images",
    icon: Maximize2,
    hash: "resize",
    path: "resize",
  },
  // — Single-PDF operations —
  {
    id: "split",
    name: "Split PDF",
    shortLabel: "Split",
    description: "Break one PDF into separate files by page range",
    category: "pdf-ops",
    inputScope: "single",
    subcategory: "pages",
    icon: Layers,
    hash: "split",
    path: "split",
  },
  {
    id: "extract-pages",
    name: "Extract Pages",
    shortLabel: "Extract",
    description: "Pull only the pages you need into a new PDF for sharing or approval",
    category: "pdf-ops",
    inputScope: "single",
    subcategory: "pages",
    icon: FileOutput,
    hash: "extract",
    path: "extract",
  },
  {
    id: "remove-pages",
    name: "Remove Pages",
    shortLabel: "Remove",
    description: "Delete unwanted pages from a PDF without splitting the whole file",
    category: "pdf-ops",
    inputScope: "single",
    subcategory: "pages",
    icon: FileMinus,
    hash: "remove-pages",
    path: "remove-pages",
  },
  {
    id: "rotate-pdf",
    name: "Rotate Pages",
    shortLabel: "Rotate",
    description: "Rotate all pages or selected pages by 90°, 180°, or 270°",
    category: "pdf-ops",
    inputScope: "single",
    subcategory: "pages",
    icon: RotateCw,
    hash: "rotate",
    path: "rotate",
  },
  {
    id: "watermark-pdf",
    name: "Watermark PDF",
    shortLabel: "Watermark",
    description: "Add a confidential or draft watermark across every page",
    category: "pdf-ops",
    inputScope: "single",
    subcategory: "markup",
    icon: Stamp,
    hash: "watermark",
    path: "watermark",
  },
  {
    id: "sign-pdf",
    name: "Sign PDF",
    shortLabel: "Sign",
    description: "Add your handwritten or uploaded signature to PDF pages",
    category: "pdf-ops",
    inputScope: "single",
    subcategory: "markup",
    icon: PenLine,
    hash: "sign",
    path: "sign",
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    shortLabel: "Compress",
    description: "Reduce PDF file size for email attachments and faster client downloads",
    category: "pdf-ops",
    inputScope: "single",
    subcategory: "protect",
    icon: Shrink,
    hash: "compress",
    path: "compress",
  },
  {
    id: "lock-unlock",
    name: "Lock & Unlock",
    shortLabel: "Protect",
    description: "Add password protection to confidential files or remove restrictions securely",
    category: "pdf-ops",
    inputScope: "single",
    subcategory: "protect",
    icon: LockKeyhole,
    hash: "protect",
    path: "protect",
  },
  // — Multi-PDF operations —
  {
    id: "arrange-merge",
    name: "Merge & Arrange",
    shortLabel: "Merge",
    description: "Combine proposals, invoices, and reports into a single client-ready PDF",
    category: "pdf-ops",
    inputScope: "multi",
    icon: Combine,
    hash: "merge",
    path: "merge",
  },
  {
    id: "pdf-compare",
    name: "Compare PDFs",
    shortLabel: "Compare",
    description: "View two PDFs side by side with linked scroll, zoom, and optional text or visual diff",
    category: "pdf-ops",
    inputScope: "multi",
    icon: Columns2,
    hash: "compare",
    path: "compare",
  },
];

export function toolsInCategory(category: ToolCategory): ToolDefinition[] {
  return TOOLS.filter((tool) => tool.category === category);
}

export function toolsInSubcategory(
  category: ToolCategory,
  subcategory: ToolSubcategory,
): ToolDefinition[] {
  return TOOLS.filter((tool) => tool.category === category && tool.subcategory === subcategory);
}

export function toolsInScope(category: ToolCategory, scope: InputScope): ToolDefinition[] {
  return TOOLS.filter((tool) => tool.category === category && tool.inputScope === scope);
}

export function singlePdfToolsInSubcategory(subcategory: ToolSubcategory): ToolDefinition[] {
  return TOOLS.filter(
    (tool) =>
      tool.category === "pdf-ops" &&
      tool.inputScope === "single" &&
      tool.subcategory === subcategory,
  );
}

/** URL segment under /tools/ (optionally prefixed with /es, /fr, /nl, /pt). */
export function toolPath(id: ToolId, locale?: Locale): string {
  const segment = `/tools/${toolById(id).path}`;
  if (!locale || locale === "en") return segment;
  return `/${locale}${segment}`;
}

export function toolByPath(segment: string): ToolDefinition | undefined {
  const normalized = segment.replace(/^\/+|\/+$/g, "").toLowerCase();
  return TOOLS.find((tool) => tool.path === normalized);
}

export function toolByHash(hash: string): ToolDefinition | undefined {
  const normalized = hash.replace(/^#/, "").toLowerCase();
  return TOOLS.find((tool) => tool.hash === normalized);
}

export function toolById(id: ToolId): ToolDefinition {
  return TOOLS.find((tool) => tool.id === id) ?? TOOLS[0];
}

/** Resolve tool id from a workspace URL pathname (supports localized routes). */
export function toolIdFromPath(pathname: string, locale: Locale = "en"): ToolId | null {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const prefix = locale === "en" ? "/tools/" : `/${locale}/tools/`;
  if (!normalized.startsWith(prefix)) return null;

  const segment = normalized.slice(prefix.length).split("/")[0];
  if (!segment) return null;

  return toolByPath(segment)?.id ?? null;
}
