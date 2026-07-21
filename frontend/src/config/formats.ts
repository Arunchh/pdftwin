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
  "Word (DOCX) → PDF for client-ready delivery",
  "PNG, JPG, GIF, BMP → WebP, PNG, or JPEG",
  "Compress, watermark, merge, split, and rotate PDFs",
  "Side-by-side PDF compare with linked scroll & zoom",
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
