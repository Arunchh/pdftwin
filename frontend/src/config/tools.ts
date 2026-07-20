import type { LucideIcon } from "lucide-react";
import {
  Combine,
  FileOutput,
  FileSpreadsheet,
  Layers,
  LockKeyhole,
} from "lucide-react";

export type ToolId =
  | "convert-extract"
  | "arrange-merge"
  | "split"
  | "extract-pages"
  | "lock-unlock";

export type ToolCategory = "convert" | "organize" | "security";

export interface ToolDefinition {
  id: ToolId;
  name: string;
  shortLabel: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  hash: string;
}

export const TOOL_CATEGORIES: Record<ToolCategory, string> = {
  convert: "Convert & Export",
  organize: "Organize Pages",
  security: "Protect Documents",
};

export const TOOLS: ToolDefinition[] = [
  {
    id: "convert-extract",
    name: "Convert & Extract",
    shortLabel: "Export",
    description: "Turn PDFs into Word or Excel, or pull out embedded images",
    category: "convert",
    icon: FileSpreadsheet,
    hash: "convert",
  },
  {
    id: "arrange-merge",
    name: "Merge & Arrange",
    shortLabel: "Merge",
    description: "Combine multiple PDFs and drag pages into the perfect order",
    category: "organize",
    icon: Combine,
    hash: "merge",
  },
  {
    id: "split",
    name: "Split PDF",
    shortLabel: "Split",
    description: "Break one PDF into separate files by page or range",
    category: "organize",
    icon: Layers,
    hash: "split",
  },
  {
    id: "extract-pages",
    name: "Extract Pages",
    shortLabel: "Extract",
    description: "Save only the pages you need into a new PDF",
    category: "organize",
    icon: FileOutput,
    hash: "extract",
  },
  {
    id: "lock-unlock",
    name: "Lock & Unlock",
    shortLabel: "Protect",
    description: "Add password protection or remove restrictions securely",
    category: "security",
    icon: LockKeyhole,
    hash: "protect",
  },
];

export function toolByHash(hash: string): ToolDefinition | undefined {
  const normalized = hash.replace(/^#/, "").toLowerCase();
  return TOOLS.find((tool) => tool.hash === normalized);
}

export function toolById(id: ToolId): ToolDefinition {
  return TOOLS.find((tool) => tool.id === id) ?? TOOLS[0];
}
