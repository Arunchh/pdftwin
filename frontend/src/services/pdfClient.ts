import { degrees, PDFDocument, type Rotation } from "pdf-lib";
import JSZip from "jszip";

const ENCRYPTED_MESSAGE =
  "This PDF is password-protected. Unlock it first using the Lock / Unlock tool.";

export class PdfClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PdfClientError";
  }
}

async function loadPdf(bytes: ArrayBuffer): Promise<PDFDocument> {
  try {
    return await PDFDocument.load(bytes, { ignoreEncryption: false });
  } catch {
    throw new PdfClientError(ENCRYPTED_MESSAGE);
  }
}

export function parsePageSelection(selection: string): number[] {
  const pages: number[] = [];

  for (const part of selection.replace(/\s/g, "").split(",")) {
    if (!part) continue;
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-", 2);
      const start = Number(startStr);
      const end = Number(endStr);
      if (Number.isNaN(start) || Number.isNaN(end) || start > end) {
        throw new PdfClientError(`Invalid range ${part}.`);
      }
      for (let page = start; page <= end; page += 1) {
        pages.push(page);
      }
    } else {
      const page = Number(part);
      if (Number.isNaN(page)) {
        throw new PdfClientError(`Invalid page number "${part}".`);
      }
      pages.push(page);
    }
  }

  if (!pages.length) {
    throw new PdfClientError("Provide at least one page number.");
  }

  return pages;
}

export function parsePageRanges(ranges: string): Array<[number, number]> {
  const parsed: Array<[number, number]> = [];

  for (const part of ranges.replace(/\s/g, "").split(",")) {
    if (!part) continue;
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-", 2);
      parsed.push([Number(startStr), Number(endStr)]);
    } else {
      const page = Number(part);
      parsed.push([page, page]);
    }
  }

  if (!parsed.length) {
    throw new PdfClientError("Provide at least one page range.");
  }

  return parsed;
}

export async function getPdfPageCount(file: File): Promise<number> {
  const bytes = await file.arrayBuffer();
  const doc = await loadPdf(bytes);
  return doc.getPageCount();
}

async function reorderPdfBytes(bytes: ArrayBuffer, order: number[]): Promise<Uint8Array> {
  const source = await loadPdf(bytes);
  const totalPages = source.getPageCount();

  for (const pageNum of order) {
    if (pageNum < 1 || pageNum > totalPages) {
      throw new PdfClientError(`Invalid page ${pageNum}. PDF has ${totalPages} page(s).`);
    }
  }

  const output = await PDFDocument.create();
  const copied = await output.copyPages(
    source,
    order.map((page) => page - 1)
  );
  copied.forEach((page) => output.addPage(page));
  return output.save();
}

async function mergePdfByteArrays(contents: ArrayBuffer[]): Promise<Uint8Array> {
  const merged = await PDFDocument.create();

  for (const content of contents) {
    const source = await loadPdf(content);
    const pages = await merged.copyPages(source, source.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }

  return merged.save();
}

export async function reorderPdf(file: File, order: string): Promise<Blob> {
  const pageOrder = parsePageSelection(order);
  const bytes = await file.arrayBuffer();
  const result = await reorderPdfBytes(bytes, pageOrder);
  return new Blob([result], { type: "application/pdf" });
}

export async function arrangeAndMergePdfs(
  files: File[],
  pageOrders: Array<string | null>
): Promise<Blob> {
  if (files.length < 2) {
    throw new PdfClientError("At least 2 PDF files are required to merge.");
  }

  if (pageOrders.length !== files.length) {
    throw new PdfClientError("Page order data does not match the number of files.");
  }

  const processed: ArrayBuffer[] = [];
  for (let index = 0; index < files.length; index += 1) {
    const bytes = await files[index].arrayBuffer();
    const pageOrder = pageOrders[index];
    if (pageOrder?.trim()) {
      const pageNumbers = parsePageSelection(pageOrder);
      const reordered = await reorderPdfBytes(bytes, pageNumbers);
      processed.push(reordered.buffer.slice(reordered.byteOffset, reordered.byteOffset + reordered.byteLength));
    } else {
      processed.push(bytes);
    }
  }

  const merged = await mergePdfByteArrays(processed);
  return new Blob([merged], { type: "application/pdf" });
}

export async function splitPdf(file: File, ranges: string): Promise<{ filename: string; blob: Blob }[]> {
  const parsedRanges = parsePageRanges(ranges);
  const bytes = await file.arrayBuffer();
  const source = await loadPdf(bytes);
  const totalPages = source.getPageCount();
  const results: { filename: string; blob: Blob }[] = [];

  for (let index = 0; index < parsedRanges.length; index += 1) {
    const [start, end] = parsedRanges[index];
    if (start < 1 || end > totalPages || start > end) {
      throw new PdfClientError(`Invalid range ${start}-${end}. PDF has ${totalPages} page(s).`);
    }

    const output = await PDFDocument.create();
    const pageIndices = Array.from({ length: end - start + 1 }, (_, offset) => start - 1 + offset);
    const copied = await output.copyPages(source, pageIndices);
    copied.forEach((page) => output.addPage(page));
    const saved = await output.save();
    results.push({
      filename: `split_${index + 1}_pages_${start}-${end}.pdf`,
      blob: new Blob([saved], { type: "application/pdf" }),
    });
  }

  return results;
}

export async function splitPdfDownload(file: File, ranges: string): Promise<{ blob: Blob; filename: string }> {
  const parts = await splitPdf(file, ranges);
  if (parts.length === 1) {
    return parts[0];
  }

  const zip = new JSZip();
  for (const part of parts) {
    zip.file(part.filename, part.blob);
  }
  const zipBlob = await zip.generateAsync({ type: "blob" });
  return { blob: zipBlob, filename: "split_pdfs.zip" };
}

function parseRotatePages(pages: string, totalPages: number): number[] {
  if (pages.trim().toLowerCase() === "all") {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const selected = parsePageSelection(pages);
  for (const pageNum of selected) {
    if (pageNum < 1 || pageNum > totalPages) {
      throw new PdfClientError(`Invalid page ${pageNum}. PDF has ${totalPages} page(s).`);
    }
  }
  return selected;
}

export async function rotatePdf(file: File, pages: string, angle: 90 | 180 | 270): Promise<Blob> {
  if (![90, 180, 270].includes(angle)) {
    throw new PdfClientError("Rotation angle must be 90, 180, or 270 degrees.");
  }

  const bytes = await file.arrayBuffer();
  const source = await loadPdf(bytes);
  const totalPages = source.getPageCount();
  const targetPages = new Set(parseRotatePages(pages, totalPages));

  source.getPages().forEach((page, index) => {
    if (!targetPages.has(index + 1)) return;
    const current = page.getRotation().angle;
    page.setRotation(degrees((current + angle) % 360) as Rotation);
  });

  const saved = await source.save();
  return new Blob([saved], { type: "application/pdf" });
}

async function imageFileToEmbedBytes(file: File): Promise<{ bytes: Uint8Array; type: "jpg" | "png" }> {
  const lower = file.name.toLowerCase();
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
    return { bytes: new Uint8Array(await file.arrayBuffer()), type: "jpg" };
  }
  if (lower.endsWith(".png")) {
    return { bytes: new Uint8Array(await file.arrayBuffer()), type: "png" };
  }

  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new PdfClientError(`Could not read image "${file.name}".`);
  }
  context.drawImage(bitmap, 0, 0);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new PdfClientError(`Could not convert "${file.name}".`))),
      "image/jpeg",
      0.92
    );
  });

  return { bytes: new Uint8Array(await blob.arrayBuffer()), type: "jpg" };
}

export async function imagesToPdf(files: File[]): Promise<Blob> {
  if (!files.length) {
    throw new PdfClientError("Add at least one image file to create a PDF.");
  }

  const pdf = await PDFDocument.create();

  for (const file of files) {
    const { bytes, type } = await imageFileToEmbedBytes(file);
    const image = type === "png" ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
    const page = pdf.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  const saved = await pdf.save();
  return new Blob([saved], { type: "application/pdf" });
}

export async function removePdfPages(file: File, pagesToRemove: string): Promise<Blob> {
  const removeSet = new Set(parsePageSelection(pagesToRemove));
  const bytes = await file.arrayBuffer();
  const source = await loadPdf(bytes);
  const totalPages = source.getPageCount();

  for (const pageNum of removeSet) {
    if (pageNum < 1 || pageNum > totalPages) {
      throw new PdfClientError(`Invalid page ${pageNum}. PDF has ${totalPages} page(s).`);
    }
  }

  if (removeSet.size >= totalPages) {
    throw new PdfClientError("You cannot remove every page from a PDF.");
  }

  const keepIndices = Array.from({ length: totalPages }, (_, index) => index).filter(
    (index) => !removeSet.has(index + 1)
  );

  const output = await PDFDocument.create();
  const copied = await output.copyPages(source, keepIndices);
  copied.forEach((page) => output.addPage(page));
  const saved = await output.save();
  return new Blob([saved], { type: "application/pdf" });
}

export type SignaturePosition = "bottom-right" | "bottom-left" | "center";

function resolveSignaturePages(pages: string, totalPages: number): number[] {
  if (pages.trim().toLowerCase() === "all") {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  return parsePageSelection(pages);
}

export async function signPdf(
  file: File,
  signatureBytes: Uint8Array,
  pages: string,
  position: SignaturePosition
): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const doc = await loadPdf(bytes);
  const signatureImage = await doc.embedPng(signatureBytes);
  const totalPages = doc.getPageCount();
  const targetPages = resolveSignaturePages(pages, totalPages);

  for (const pageNum of targetPages) {
    if (pageNum < 1 || pageNum > totalPages) {
      throw new PdfClientError(`Invalid page ${pageNum}. PDF has ${totalPages} page(s).`);
    }

    const page = doc.getPage(pageNum - 1);
    const { width, height } = page.getSize();
    const sigWidth = width * 0.22;
    const sigHeight = sigWidth * (signatureImage.height / signatureImage.width);
    const margin = width * 0.05;

    let x = margin;
    let y = margin;

    if (position === "bottom-right") {
      x = width - sigWidth - margin;
      y = margin;
    } else if (position === "bottom-left") {
      x = margin;
      y = margin;
    } else {
      x = (width - sigWidth) / 2;
      y = (height - sigHeight) / 2;
    }

    page.drawImage(signatureImage, { x, y, width: sigWidth, height: sigHeight });
  }

  const saved = await doc.save();
  return new Blob([saved], { type: "application/pdf" });
}
