/**
 * Pure compare/diff primitives with no DOM or PDF.js dependencies.
 *
 * Used by the compare Web Worker (`compareDiff.worker.ts`) so pixel loops and line
 * diffs never block the UI thread. The main thread is responsible only for PDF
 * rendering and text extraction; this module handles CPU-heavy comparison math.
 *
 * @see docs/product/pdf-compare-diff.md
 */
import { diffLines, type Change } from "diff";
import type { PageDiffStatus, TextDiffSide } from "./compareDiffTypes";

/** Serializable RGBA bitmap passed between threads via structured clone / transfer. */
export interface PixelSurface {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

export const VISUAL_ANALYSIS_SCALE = 1.25;
export const DEFAULT_DIFF_SENSITIVITY = 12;

export function normalizePageText(raw: string): string {
  return raw.replace(/\s+/g, " ").trim();
}

function changesToSides(changes: Change[]): { left: TextDiffSide; right: TextDiffSide } {
  const left: TextDiffSide["segments"] = [];
  const right: TextDiffSide["segments"] = [];

  for (const part of changes) {
    const text = part.value.replace(/\n$/, "");
    if (!text && part.added) continue;
    if (!text && part.removed) continue;

    if (part.added) {
      right.push({ type: "insert", text });
    } else if (part.removed) {
      left.push({ type: "delete", text });
    } else {
      left.push({ type: "equal", text });
      right.push({ type: "equal", text });
    }
  }

  return { left: { segments: left }, right: { segments: right } };
}

export function computeTextDiff(leftText: string, rightText: string): {
  left: TextDiffSide;
  right: TextDiffSide;
  hasChanges: boolean;
} {
  const changes = diffLines(leftText || "", rightText || "", { newlineIsToken: true });
  const sides = changesToSides(changes);
  const hasChanges = changes.some((part) => part.added || part.removed);
  return { ...sides, hasChanges };
}

export function pixelThreshold(sensitivity: number): number {
  const clamped = Math.min(100, Math.max(0, sensitivity));
  return Math.round(255 - (clamped / 100) * 200);
}

/**
 * Compare two bitmaps page-by-page. Output overlay uses magenta (#db2777 @ 66% alpha)
 * on changed pixels — chosen for contrast on both white paper and dark text.
 */
export function computeVisualDiffFromSurfaces(
  left: PixelSurface,
  right: PixelSurface,
  sensitivity = DEFAULT_DIFF_SENSITIVITY
): { overlay: PixelSurface; changePercent: number } {
  const width = Math.max(left.width, right.width);
  const height = Math.max(left.height, right.height);
  const threshold = pixelThreshold(sensitivity);
  const output = new Uint8ClampedArray(width * height * 4);

  let changedPixels = 0;
  let comparedPixels = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = (y * width + x) * 4;
      const leftInside = x < left.width && y < left.height;
      const rightInside = x < right.width && y < right.height;

      let changed = false;

      if (!leftInside || !rightInside) {
        changed = true;
      } else {
        const leftIdx = (y * left.width + x) * 4;
        const rightIdx = (y * right.width + x) * 4;
        const delta =
          Math.abs(left.data[leftIdx] - right.data[rightIdx]) +
          Math.abs(left.data[leftIdx + 1] - right.data[rightIdx + 1]) +
          Math.abs(left.data[leftIdx + 2] - right.data[rightIdx + 2]);
        changed = delta > threshold;
      }

      comparedPixels += 1;
      if (changed) {
        changedPixels += 1;
        output[idx] = 219;
        output[idx + 1] = 39;
        output[idx + 2] = 119;
        output[idx + 3] = 170;
      }
    }
  }

  const changePercent =
    comparedPixels === 0 ? 0 : Math.round((changedPixels / comparedPixels) * 1000) / 10;

  return {
    overlay: { width, height, data: output },
    changePercent,
  };
}

export function pageStatusFromVisualChange(changePercent: number): PageDiffStatus {
  return changePercent > 0 ? "changed" : "identical";
}

export function pageStatusFromTextChange(hasChanges: boolean): PageDiffStatus {
  return hasChanges ? "changed" : "identical";
}

export function surfaceFromImageData(image: ImageData): PixelSurface {
  return {
    width: image.width,
    height: image.height,
    data: new Uint8ClampedArray(image.data),
  };
}

export function canvasToSurface(canvas: HTMLCanvasElement): PixelSurface | null {
  const context = canvas.getContext("2d");
  if (!context) return null;
  return surfaceFromImageData(context.getImageData(0, 0, canvas.width, canvas.height));
}

export function surfaceToCanvas(surface: PixelSurface): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = surface.width;
  canvas.height = surface.height;
  const context = canvas.getContext("2d");
  if (!context) return canvas;
  context.putImageData(new ImageData(surface.data, surface.width, surface.height), 0, 0);
  return canvas;
}
