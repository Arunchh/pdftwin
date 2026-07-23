import JSZip from "jszip";
import { PdfClientError, parsePageSelection } from "./pdfClient";

type PdfJsModule = typeof import("pdfjs-dist");

let pdfjsPromise: Promise<PdfJsModule> | null = null;

export async function getPdfJs(): Promise<PdfJsModule> {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();
      return pdfjs;
    });
  }
  return pdfjsPromise;
}

async function loadPdfDocument(file: File) {
  const pdfjs = await getPdfJs();
  const bytes = await file.arrayBuffer();
  return pdfjs.getDocument({ data: bytes }).promise;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new PdfClientError("Could not export page image."))),
      type,
      quality
    );
  });
}

async function renderPageToCanvas(
  pdfDoc: Awaited<ReturnType<typeof loadPdfDocument>>,
  pageNumber: number,
  scale = 2
): Promise<HTMLCanvasElement> {
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new PdfClientError("Could not render PDF page.");
  }

  await page.render({ canvasContext: context, viewport, canvas }).promise;
  return canvas;
}

function resolvePageNumbers(selection: string, totalPages: number): number[] {
  if (!selection.trim()) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = parsePageSelection(selection);
  for (const pageNum of pages) {
    if (pageNum < 1 || pageNum > totalPages) {
      throw new PdfClientError(`Invalid page ${pageNum}. PDF has ${totalPages} page(s).`);
    }
  }
  return pages;
}

export async function pdfToImages(
  file: File,
  format: "jpeg" | "png",
  quality: number,
  pageSelection = ""
): Promise<{ filename: string; blob: Blob }[]> {
  const pdfDoc = await loadPdfDocument(file);
  const totalPages = pdfDoc.numPages;
  const pageNumbers = resolvePageNumbers(pageSelection, totalPages);
  const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
  const extension = format === "jpeg" ? "jpg" : "png";
  const baseName = file.name.replace(/\.pdf$/i, "") || "document";
  const results: { filename: string; blob: Blob }[] = [];

  for (const pageNum of pageNumbers) {
    const canvas = await renderPageToCanvas(pdfDoc, pageNum, 2);
    const blob = await canvasToBlob(canvas, mimeType, format === "jpeg" ? quality : undefined);
    results.push({
      filename: `${baseName}_page_${pageNum}.${extension}`,
      blob,
    });
  }

  return results;
}

export async function pdfToImagesDownload(
  file: File,
  format: "jpeg" | "png",
  quality: number,
  pageSelection = ""
): Promise<{ blob: Blob; filename: string }> {
  const parts = await pdfToImages(file, format, quality, pageSelection);
  if (parts.length === 1) {
    return parts[0];
  }

  const zip = new JSZip();
  for (const part of parts) {
    zip.file(part.filename, part.blob);
  }
  const zipBlob = await zip.generateAsync({ type: "blob" });
  return { blob: zipBlob, filename: `${file.name.replace(/\.pdf$/i, "") || "document"}_pages.zip` };
}

export async function pdfToText(file: File): Promise<string> {
  const pdfDoc = await loadPdfDocument(file);
  const chunks: string[] = [];

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum += 1) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (pageText) {
      chunks.push(`--- Page ${pageNum} ---\n${pageText}`);
    }
  }

  if (!chunks.length) {
    throw new PdfClientError(
      "No selectable text found. This PDF may be scanned — try the OCR tool instead."
    );
  }

  return chunks.join("\n\n");
}

export async function renderPdfPageForOcr(
  file: File,
  pageNumber: number,
  scale = 2
): Promise<HTMLCanvasElement> {
  const pdfDoc = await loadPdfDocument(file);
  if (pageNumber < 1 || pageNumber > pdfDoc.numPages) {
    throw new PdfClientError(`Invalid page ${pageNumber}. PDF has ${pdfDoc.numPages} page(s).`);
  }

  return renderPageToCanvas(pdfDoc, pageNumber, scale);
}

export async function getPdfPageCountFromJs(file: File): Promise<number> {
  const pdfDoc = await loadPdfDocument(file);
  return pdfDoc.numPages;
}
