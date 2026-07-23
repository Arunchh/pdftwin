export const BUSINESS_TAGLINE =
  "The one-stop file conversion workspace for modern businesses.";

export const SUPPORTED_INPUT_FORMATS = [
  { ext: "PDF", use: "Documents, reports, contracts" },
  { ext: "DOCX", use: "Editable exports from PDF" },
  { ext: "XLSX", use: "Tables and structured data" },
  { ext: "PNG", use: "Lossless graphics and screenshots" },
  { ext: "JPG", use: "Photos and compressed images" },
  { ext: "WebP", use: "Web-ready, lightweight images" },
  { ext: "GIF", use: "Simple graphics and animations" },
  { ext: "BMP / TIFF", use: "Legacy and print workflows" },
] as const;

export const CONVERSION_HIGHLIGHTS = [
  "PDF → Word, Excel, or image assets",
  "Images → PDF and PDF → JPG/PNG export",
  "Word (DOCX) → PDF for client-ready delivery",
  "PNG, JPG, GIF, BMP → WebP, PNG, or JPEG",
  "Sign PDF, merge, split, compare, and remove pages",
  "OCR and PDF-to-text for scanned documents",
  "Password-protect sensitive business files",
] as const;

export const IMAGE_ACCEPT =
  ".png,.jpg,.jpeg,.webp,.gif,.bmp,.tiff,.tif";

export const IMAGE_OUTPUT_FORMATS = [
  { id: "webp" as const, label: "WebP", description: "Smaller files for websites and apps" },
  { id: "png" as const, label: "PNG", description: "Lossless quality with transparency" },
  { id: "jpeg" as const, label: "JPEG", description: "Compact photos and thumbnails" },
];

export type ImageOutputFormat = (typeof IMAGE_OUTPUT_FORMATS)[number]["id"];
