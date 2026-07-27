export function getPdfFiles(files: File[]): File[] {
  return files.filter((file) => isPdfFile(file));
}

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".tiff", ".tif"];

export function isPdfFile(file: Pick<File, "name">): boolean {
  return file.name.toLowerCase().endsWith(".pdf");
}

export function isImageFile(file: Pick<File, "name">): boolean {
  return IMAGE_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));
}

export function isDocxFile(file: Pick<File, "name">): boolean {
  return file.name.toLowerCase().endsWith(".docx");
}

export function getImageFiles(files: File[]): File[] {
  return files.filter((file) => isImageFile(file));
}

export function getDocxFiles(files: File[]): File[] {
  return files.filter((file) => isDocxFile(file));
}

export function fileForRecord(
  record: { id: string; name: string; size: number },
  files: File[]
): File | undefined {
  return files.find((file) => file.name === record.name && file.size === record.size);
}

export function fileKey(file: File): string {
  return `${file.name}::${file.size}::${file.lastModified}`;
}

export function reconcilePdfOrder(currentOrder: File[], allFiles: File[]): File[] {
  const pdfFiles = getPdfFiles(allFiles);
  const pdfByKey = new Map(pdfFiles.map((file) => [fileKey(file), file]));

  const ordered = currentOrder
    .map((file) => pdfByKey.get(fileKey(file)))
    .filter((file): file is File => Boolean(file));

  const orderedKeys = new Set(ordered.map(fileKey));
  const added = pdfFiles.filter((file) => !orderedKeys.has(fileKey(file)));

  return [...ordered, ...added];
}

export function defaultPdfOrder(allFiles: File[]): File[] {
  return getPdfFiles(allFiles);
}
