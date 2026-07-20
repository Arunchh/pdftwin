import type { LucideIcon } from "lucide-react";
import {
  Combine,
  Columns2,
  FileOutput,
  FileSpreadsheet,
  Image,
  Layers,
  LockKeyhole,
} from "lucide-react";

export type ToolId =
  | "convert-extract"
  | "image-convert"
  | "arrange-merge"
  | "split"
  | "extract-pages"
  | "lock-unlock"
  | "pdf-compare";

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
