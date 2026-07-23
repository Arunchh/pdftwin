import Tesseract from "tesseract.js";
import { PdfClientError } from "./pdfClient";
import { getPdfPageCountFromJs, renderPdfPageForOcr } from "./pdfJsClient";
import { getImageFiles, getPdfFiles } from "../utils/files";

export const OCR_LANGUAGES = [
  { id: "eng", label: "English" },
  { id: "spa", label: "Spanish" },
  { id: "fra", label: "French" },
  { id: "deu", label: "German" },
  { id: "nld", label: "Dutch" },
  { id: "por", label: "Portuguese" },
  { id: "ita", label: "Italian" },
] as const;

export type OcrLanguage = (typeof OCR_LANGUAGES)[number]["id"];

async function imageFileToCanvas(file: File): Promise<HTMLCanvasElement> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new PdfClientError("Could not read image for OCR.");
  }
  context.drawImage(bitmap, 0, 0);
  bitmap.close();
  return canvas;
}

export async function ocrFiles(
  files: File[],
  language: OcrLanguage,
  onProgress?: (progress: number, label: string) => void
): Promise<string> {
  const pdfFiles = getPdfFiles(files);
  const imageFiles = getImageFiles(files);

  if (!pdfFiles.length && !imageFiles.length) {
    throw new PdfClientError("Add at least one PDF or image file for OCR.");
  }

  type OcrJob = { label: string; recognize: (worker: Awaited<ReturnType<typeof Tesseract.createWorker>>) => Promise<string> };
  const jobs: OcrJob[] = [];

  for (const pdf of pdfFiles) {
    const pageCount = await getPdfPageCountFromJs(pdf);
    for (let pageNum = 1; pageNum <= pageCount; pageNum += 1) {
      const label = `${pdf.name} · page ${pageNum}`;
      jobs.push({
        label,
        recognize: async (worker) => {
          const canvas = await renderPdfPageForOcr(pdf, pageNum, 2);
          const { data } = await worker.recognize(canvas);
          return data.text.trim();
        },
      });
    }
  }

  for (const image of imageFiles) {
    jobs.push({
      label: image.name,
      recognize: async (worker) => {
        const canvas = await imageFileToCanvas(image);
        const { data } = await worker.recognize(canvas);
        return data.text.trim();
      },
    });
  }

  const worker = await Tesseract.createWorker(language);
  const sections: string[] = [];

  try {
    for (let index = 0; index < jobs.length; index += 1) {
      const job = jobs[index];
      onProgress?.(index / jobs.length, job.label);
      const text = await job.recognize(worker);
      onProgress?.((index + 1) / jobs.length, job.label);
      if (text) {
        sections.push(`--- ${job.label} ---\n${text}`);
      }
    }
  } finally {
    await worker.terminate();
  }

  if (!sections.length) {
    throw new PdfClientError("OCR did not detect any text in the uploaded files.");
  }

  return sections.join("\n\n");
}
