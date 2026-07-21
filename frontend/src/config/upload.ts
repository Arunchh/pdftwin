import { formatFileLimit, FREE_FILE_LIMIT_MB } from "./limits";
import { IMAGE_ACCEPT } from "./formats";
import type { ToolId } from "./tools";

export interface ToolUploadConfig {
  accept: string;
  title: string;
  label: string;
  hint: string;
}

const limitHint = `up to ${formatFileLimit(FREE_FILE_LIMIT_MB)} per file on Free`;

export const TOOL_UPLOAD_CONFIG: Record<ToolId, ToolUploadConfig> = {
  "convert-extract": {
    accept: ".pdf",
    title: "Upload business documents",
    label: "Drop PDFs here or click to browse",
    hint: `PDF · ${limitHint}`,
  },
  "image-convert": {
    accept: IMAGE_ACCEPT,
    title: "Upload images",
    label: "Drop images here or click to browse",
    hint: `PNG, JPG, WebP, GIF, BMP, TIFF · ${limitHint}`,
  },
  "compress-pdf": {
    accept: ".pdf",
    title: "Upload PDFs to compress",
    label: "Drop PDFs here or click to browse",
    hint: `PDF · ${limitHint}`,
  },
  "arrange-merge": {
    accept: ".pdf",
    title: "Upload PDFs to combine",
    label: "Drop PDFs here or click to browse",
    hint: `PDF · ${limitHint}`,
  },
  split: {
    accept: ".pdf",
    title: "Upload PDFs to split",
    label: "Drop PDFs here or click to browse",
    hint: `PDF · ${limitHint}`,
  },
  "extract-pages": {
    accept: ".pdf",
    title: "Upload PDFs",
    label: "Drop PDFs here or click to browse",
    hint: `PDF · ${limitHint}`,
  },
  "rotate-pdf": {
    accept: ".pdf",
    title: "Upload PDFs to rotate",
    label: "Drop PDFs here or click to browse",
    hint: `PDF · ${limitHint}`,
  },
  "lock-unlock": {
    accept: ".pdf",
    title: "Upload PDFs to protect",
    label: "Drop PDFs here or click to browse",
    hint: `PDF · ${limitHint}`,
  },
  "pdf-compare": {
    accept: ".pdf",
    title: "Upload PDFs to compare",
    label: "Drop PDFs here or click to browse",
    hint: `PDF · ${limitHint}`,
  },
};

export const WORKSPACE_UPLOAD_DEFAULT: ToolUploadConfig = {
  accept: `.pdf,${IMAGE_ACCEPT}`,
  title: "Upload files",
  label: "Drop files here or click to browse",
  hint: `PDF and images · ${limitHint}`,
};
