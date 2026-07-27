/**
 * PDF compare orchestration (main thread).
 *
 * Responsibilities split:
 * - **Main thread (this file):** PDF.js open/render, text extraction, canvas I/O, blend overlay.
 * - **Web Worker (`compareDiff.worker.ts`):** line diffs + pixel loops via `compareDiffWorkerClient`.
 *
 * Viewer-only mode never calls the worker. Diff modes opt in explicitly from ComparePanel.
 *
 * @see docs/product/pdf-compare-diff.md
 */
import type { PDFDocumentProxy } from "pdfjs-dist";
import {
  canvasToSurface,
  DEFAULT_DIFF_SENSITIVITY,
  normalizePageText,
  surfaceToCanvas,
  VISUAL_ANALYSIS_SCALE,
} from "./compareDiffCore";
import type {
  CompareAnalysis,
  CompareDiffMode,
  PageDiffResult,
  PixelSurfaceDTO,
} from "./compareDiffTypes";
import {
  terminateCompareDiffWorker,
  workerTextDiffPage,
  workerVisualAnalyzePage,
  workerVisualOverlay,
} from "./compareDiffWorkerClient";

export type {
  CompareAnalysis,
  CompareDiffMode,
  PageDiffResult,
  PageDiffStatus,
  TextDiffSide,
} from "./compareDiffTypes";

export { DEFAULT_DIFF_SENSITIVITY, VISUAL_ANALYSIS_SCALE as VISUAL_RENDER_SCALE };

export async function extractPageText(
  doc: PDFDocumentProxy,
  pageNum: number
): Promise<string> {
  if (pageNum < 1 || pageNum > doc.numPages) return "";

  const page = await doc.getPage(pageNum);
  const textContent = await page.getTextContent();
  const raw = textContent.items.map((item) => ("str" in item ? item.str : "")).join(" ");
  return normalizePageText(raw);
}

async function renderPageToCanvas(
  doc: PDFDocumentProxy,
  pageNum: number,
  scale: number
): Promise<HTMLCanvasElement | null> {
  if (pageNum < 1 || pageNum > doc.numPages) return null;

  const page = await doc.getPage(pageNum);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: context, viewport, canvas }).promise;
  return canvas;
}

export function blendOverlayPages(
  leftCanvas: HTMLCanvasElement,
  rightCanvas: HTMLCanvasElement
): HTMLCanvasElement {
  const width = Math.max(leftCanvas.width, rightCanvas.width);
  const height = Math.max(leftCanvas.height, rightCanvas.height);
  const blended = document.createElement("canvas");
  blended.width = width;
  blended.height = height;
  const ctx = blended.getContext("2d");
  if (!ctx) return blended;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 0.5;
  ctx.drawImage(leftCanvas, 0, 0);
  ctx.drawImage(rightCanvas, 0, 0);
  ctx.globalAlpha = 1;
  return blended;
}

function toSurfaceDto(canvas: HTMLCanvasElement | null): PixelSurfaceDTO | null {
  const surface = canvas ? canvasToSurface(canvas) : null;
  return surface;
}

async function analyzePage(
  leftDoc: PDFDocumentProxy,
  rightDoc: PDFDocumentProxy,
  pageNum: number,
  mode: CompareDiffMode,
  sensitivity: number
): Promise<PageDiffResult> {
  const leftExists = pageNum <= leftDoc.numPages;
  const rightExists = pageNum <= rightDoc.numPages;

  if (mode === "text") {
    if (!leftExists && rightExists) {
      return { pageNum, status: "missing-left", textDiff: null, changePercent: 100 };
    }
    if (leftExists && !rightExists) {
      return { pageNum, status: "missing-right", textDiff: null, changePercent: 100 };
    }
    if (!leftExists && !rightExists) {
      return { pageNum, status: "identical", textDiff: null, changePercent: 0 };
    }

    const [leftText, rightText] = await Promise.all([
      extractPageText(leftDoc, pageNum),
      extractPageText(rightDoc, pageNum),
    ]);
    const result = await workerTextDiffPage(pageNum, leftText, rightText);
    return {
      pageNum,
      status: result.status,
      textDiff: result.textDiff,
      changePercent: result.changePercent,
    };
  }

  const [leftCanvas, rightCanvas] = leftExists && rightExists
    ? await Promise.all([
        renderPageToCanvas(leftDoc, pageNum, VISUAL_ANALYSIS_SCALE),
        renderPageToCanvas(rightDoc, pageNum, VISUAL_ANALYSIS_SCALE),
      ])
    : [null, null];

  const visual = await workerVisualAnalyzePage(
    pageNum,
    leftExists,
    rightExists,
    toSurfaceDto(leftCanvas),
    toSurfaceDto(rightCanvas),
    sensitivity
  );

  return {
    pageNum,
    status: visual.status,
    textDiff: null,
    changePercent: visual.changePercent,
  };
}

export async function analyzeCompareDocuments(
  leftDoc: PDFDocumentProxy,
  rightDoc: PDFDocumentProxy,
  mode: CompareDiffMode,
  sensitivity: number,
  onProgress?: (completed: number, total: number) => void,
  shouldCancel?: () => boolean
): Promise<CompareAnalysis> {
  const pageCount = Math.max(leftDoc.numPages, rightDoc.numPages);
  const pages: PageDiffResult[] = [];

  for (let pageNum = 1; pageNum <= pageCount; pageNum += 1) {
    if (shouldCancel?.()) {
      throw new Error("Analysis cancelled");
    }
    pages.push(await analyzePage(leftDoc, rightDoc, pageNum, mode, sensitivity));
    onProgress?.(pageNum, pageCount);
  }

  const changedPageNums = pages
    .filter((page) => page.status === "changed" || page.status.startsWith("missing"))
    .map((page) => page.pageNum);

  return { pages, changedPageNums };
}

async function overlayFromCanvases(
  leftCanvas: HTMLCanvasElement,
  rightCanvas: HTMLCanvasElement,
  sensitivity: number
): Promise<HTMLCanvasElement | null> {
  const left = canvasToSurface(leftCanvas);
  const right = canvasToSurface(rightCanvas);
  if (!left || !right) return null;

  const { overlay } = await workerVisualOverlay(left, right, sensitivity);
  return surfaceToCanvas(overlay);
}

export async function renderVisualDiffForPage(
  leftDoc: PDFDocumentProxy,
  rightDoc: PDFDocumentProxy,
  pageNum: number,
  leftScale: number,
  rightScale: number,
  sensitivity: number
): Promise<{
  leftOverlay: HTMLCanvasElement | null;
  rightOverlay: HTMLCanvasElement | null;
  blend: HTMLCanvasElement | null;
}> {
  const [leftAtLeftScale, rightAtLeftScale, leftAtRightScale, rightAtRightScale] =
    await Promise.all([
      renderPageToCanvas(leftDoc, pageNum, leftScale),
      renderPageToCanvas(rightDoc, pageNum, leftScale),
      renderPageToCanvas(leftDoc, pageNum, rightScale),
      renderPageToCanvas(rightDoc, pageNum, rightScale),
    ]);

  const [leftOverlay, rightOverlay] = await Promise.all([
    leftAtLeftScale && rightAtLeftScale
      ? overlayFromCanvases(leftAtLeftScale, rightAtLeftScale, sensitivity)
      : Promise.resolve(null),
    leftAtRightScale && rightAtRightScale
      ? overlayFromCanvases(leftAtRightScale, rightAtRightScale, sensitivity)
      : Promise.resolve(null),
  ]);

  const blend =
    leftAtLeftScale && rightAtLeftScale ? blendOverlayPages(leftAtLeftScale, rightAtLeftScale) : null;

  return { leftOverlay, rightOverlay, blend };
}

export { terminateCompareDiffWorker };
