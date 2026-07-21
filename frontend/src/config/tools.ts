import type { LucideIcon } from "lucide-react";
import {
  Combine,
  Columns2,
  FileOutput,
  FileSpreadsheet,
  FileText,
  Image,
  Layers,
  LockKeyhole,
  Maximize2,
  RotateCw,
  Shrink,
  Stamp,
} from "lucide-react";

export type ToolId =
  | "convert-extract"
  | "image-convert"
  | "image-resize"
  | "compress-pdf"
  | "word-to-pdf"
  | "arrange-merge"
  | "split"
  | "extract-pages"
  | "rotate-pdf"
  | "pdf-compare"
  | "watermark-pdf"
  | "lock-unlock";

export type ToolCategory = "convert" | "organize" | "security";

export interface ToolDefinition {
  id: ToolId;
  name: string;
  shortLabel: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  /** Legacy hash — redirected to `path` */
  hash: string;
  /** URL segment under /tools/ */
  path: string;
}

export const TOOL_CATEGORIES: Record<ToolCategory, string> = {
  convert: "Convert & Export",
  organize: "Organize Documents",
  security: "Protect Files",
};

export const TOOLS: ToolDefinition[] = [
  {
    id: "convert-extract",
    name: "Document Conversion",
    shortLabel: "Convert",
    description: "Export PDFs to Word, Excel, or web-ready image assets for your team",
    category: "convert",
    icon: FileSpreadsheet,
    hash: "convert",
    path: "convert",
  },
  {
    id: "image-convert",
    name: "Image Conversion",
    shortLabel: "Images",
    description: "Convert PNG, JPG, GIF, and BMP files to WebP, PNG, or JPEG in one step",
    category: "convert",
    icon: Image,
    hash: "images",
    path: "images",
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    shortLabel: "Compress",
    description: "Reduce PDF file size for email attachments and faster client downloads",
    category: "convert",
    icon: Shrink,
    hash: "compress",
    path: "compress",
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    shortLabel: "Word→PDF",
    description: "Convert DOCX proposals and contracts into share-ready PDF files",
    category: "convert",
    icon: FileText,
    hash: "word-to-pdf",
    path: "word-to-pdf",
  },
  {
    id: "image-resize",
    name: "Resize Images",
    shortLabel: "Resize",
    description: "Resize and compress images for email, web, and slide decks",
    category: "convert",
    icon: Maximize2,
    hash: "resize",
    path: "resize",
  },
  {
    id: "pdf-compare",
    name: "Compare PDFs",
    shortLabel: "Compare",
    description: "View two PDFs side by side with linked scroll and zoom for contract review",
    category: "organize",
    icon: Columns2,
    hash: "compare",
    path: "compare",
  },
  {
    id: "arrange-merge",
    name: "Merge & Arrange",
    shortLabel: "Merge",
    description: "Combine proposals, invoices, and reports into a single client-ready PDF",
    category: "organize",
    icon: Combine,
    hash: "merge",
    path: "merge",
  },
  {
    id: "split",
    name: "Split PDF",
    shortLabel: "Split",
    description: "Break large contracts and decks into separate files by page range",
    category: "organize",
    icon: Layers,
    hash: "split",
    path: "split",
  },
  {
    id: "extract-pages",
    name: "Extract Pages",
    shortLabel: "Extract",
    description: "Pull only the pages you need into a new PDF for sharing or approval",
    category: "organize",
    icon: FileOutput,
    hash: "extract",
    path: "extract",
  },
  {
    id: "rotate-pdf",
    name: "Rotate Pages",
    shortLabel: "Rotate",
    description: "Rotate all pages or selected pages by 90°, 180°, or 270°",
    category: "organize",
    icon: RotateCw,
    hash: "rotate",
    path: "rotate",
  },
  {
    id: "watermark-pdf",
    name: "Watermark PDF",
    shortLabel: "Watermark",
    description: "Add a confidential or draft watermark across every page",
    category: "security",
    icon: Stamp,
    hash: "watermark",
    path: "watermark",
  },
  {
    id: "lock-unlock",
    name: "Lock & Unlock",
    shortLabel: "Protect",
    description: "Add password protection to confidential files or remove restrictions securely",
    category: "security",
    icon: LockKeyhole,
    hash: "protect",
    path: "protect",
  },
];

export function toolPath(id: ToolId): string {
  return `/tools/${toolById(id).path}`;
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
