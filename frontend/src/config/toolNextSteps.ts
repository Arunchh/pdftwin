import type { ToolId } from "./tools";

export interface ToolNextStep {
  toolId: ToolId;
  label: string;
}

/** Suggested follow-up tools shown on the result card after a successful run. */
export const TOOL_NEXT_STEPS: Partial<Record<ToolId, ToolNextStep[]>> = {
  "arrange-merge": [
    { toolId: "convert-extract", label: "Convert to Word or Excel" },
    { toolId: "compress-pdf", label: "Compress PDF" },
    { toolId: "lock-unlock", label: "Protect with password" },
  ],
  "compress-pdf": [
    { toolId: "lock-unlock", label: "Protect with password" },
    { toolId: "sign-pdf", label: "Sign PDF" },
    { toolId: "watermark-pdf", label: "Add watermark" },
  ],
  "extract-pages": [
    { toolId: "compress-pdf", label: "Compress PDF" },
    { toolId: "convert-extract", label: "Convert to Word" },
    { toolId: "sign-pdf", label: "Sign PDF" },
  ],
  "split": [
    { toolId: "arrange-merge", label: "Merge PDFs" },
    { toolId: "compress-pdf", label: "Compress PDF" },
  ],
  "convert-extract": [
    { toolId: "compress-pdf", label: "Compress PDF" },
    { toolId: "lock-unlock", label: "Protect with password" },
  ],
  "word-to-pdf": [
    { toolId: "compress-pdf", label: "Compress PDF" },
    { toolId: "sign-pdf", label: "Sign PDF" },
    { toolId: "watermark-pdf", label: "Add watermark" },
  ],
  "images-to-pdf": [
    { toolId: "compress-pdf", label: "Compress PDF" },
    { toolId: "lock-unlock", label: "Protect with password" },
  ],
  "pdf-to-jpg": [
    { toolId: "image-convert", label: "Convert images" },
    { toolId: "image-resize", label: "Resize images" },
  ],
  "ocr-pdf": [
    { toolId: "convert-extract", label: "Convert to Word" },
    { toolId: "compress-pdf", label: "Compress PDF" },
  ],
  "rotate-pdf": [
    { toolId: "arrange-merge", label: "Merge PDFs" },
    { toolId: "compress-pdf", label: "Compress PDF" },
  ],
  "remove-pages": [
    { toolId: "compress-pdf", label: "Compress PDF" },
    { toolId: "sign-pdf", label: "Sign PDF" },
  ],
  "watermark-pdf": [
    { toolId: "lock-unlock", label: "Protect with password" },
    { toolId: "sign-pdf", label: "Sign PDF" },
  ],
  "lock-unlock": [
    { toolId: "sign-pdf", label: "Sign PDF" },
    { toolId: "watermark-pdf", label: "Add watermark" },
  ],
  "sign-pdf": [
    { toolId: "lock-unlock", label: "Protect with password" },
    { toolId: "compress-pdf", label: "Compress PDF" },
  ],
  "image-convert": [
    { toolId: "images-to-pdf", label: "Images to PDF" },
    { toolId: "image-resize", label: "Resize images" },
  ],
  "image-resize": [
    { toolId: "images-to-pdf", label: "Images to PDF" },
    { toolId: "image-convert", label: "Convert format" },
  ],
  "pdf-to-text": [
    { toolId: "ocr-pdf", label: "OCR scanned PDF" },
    { toolId: "convert-extract", label: "Convert to Word" },
  ],
};
