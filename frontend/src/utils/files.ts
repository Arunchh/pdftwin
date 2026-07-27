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
  record: { id: string; name: string; size: number; addedAt?: number },
  files: File[]
): File | undefined {
  const nameSizeMatches = files.filter(
    (file) => file.name === record.name && file.size === record.size
  );
  if (nameSizeMatches.length === 1) {
    return nameSizeMatches[0];
  }
  if (nameSizeMatches.length > 1 && record.addedAt !== undefined) {
    let best = nameSizeMatches[0];
    let bestDelta = Math.abs(best.lastModified - record.addedAt);
    for (const candidate of nameSizeMatches.slice(1)) {
      const delta = Math.abs(candidate.lastModified - record.addedAt);
      if (delta < bestDelta) {
        best = candidate;
        bestDelta = delta;
      }
    }
    return best;
  }
  return nameSizeMatches[0];
}

export function reconcileImageOrder(currentOrder: File[], allFiles: File[]): File[] {
  const imageFiles = getImageFiles(allFiles);
  const byKey = new Map(imageFiles.map((file) => [fileKey(file), file]));

  const ordered = currentOrder
    .map((file) => byKey.get(fileKey(file)))
    .filter((file): file is File => Boolean(file));

  const orderedKeys = new Set(ordered.map(fileKey));
  const added = imageFiles.filter((file) => !orderedKeys.has(fileKey(file)));

  return [...ordered, ...added];
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
