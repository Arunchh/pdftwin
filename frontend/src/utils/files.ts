export function getPdfFiles(files: File[]): File[] {
  return files.filter((file) => file.name.toLowerCase().endsWith(".pdf"));
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
