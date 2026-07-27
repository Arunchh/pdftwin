/**
 * Shared serializable types for PDF compare / diff.
 * Kept in a separate module so the Web Worker can import types without pulling PDF.js.
 */
export type CompareDiffMode = "off" | "text" | "visual" | "overlay";

export type PageDiffStatus = "identical" | "changed" | "missing-left" | "missing-right";

export interface TextDiffSide {
  segments: Array<{ type: "equal" | "insert" | "delete"; text: string }>;
}

export interface PageDiffResult {
  pageNum: number;
  status: PageDiffStatus;
  textDiff: { left: TextDiffSide; right: TextDiffSide } | null;
  changePercent: number | null;
}

export interface CompareAnalysis {
  pages: PageDiffResult[];
  changedPageNums: number[];
}

export interface VisualOverlayResult {
  leftOverlay: PixelSurfaceDTO | null;
  rightOverlay: PixelSurfaceDTO | null;
}

/** Worker-safe pixel payload (ArrayBuffer may be transferred). */
export interface PixelSurfaceDTO {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

export type CompareDiffWorkerRequest =
  | {
      id: string;
      type: "text-page";
      pageNum: number;
      leftText: string;
      rightText: string;
    }
  | {
      id: string;
      type: "visual-page";
      pageNum: number;
      leftExists: boolean;
      rightExists: boolean;
      left: PixelSurfaceDTO | null;
      right: PixelSurfaceDTO | null;
      sensitivity: number;
    }
  | {
      id: string;
      type: "visual-overlay";
      left: PixelSurfaceDTO;
      right: PixelSurfaceDTO;
      sensitivity: number;
    };

export type CompareDiffWorkerResponse =
  | {
      id: string;
      ok: true;
      type: "text-page";
      pageNum: number;
      status: PageDiffStatus;
      textDiff: { left: TextDiffSide; right: TextDiffSide };
      changePercent: number | null;
    }
  | {
      id: string;
      ok: true;
      type: "visual-page";
      pageNum: number;
      status: PageDiffStatus;
      changePercent: number;
    }
  | {
      id: string;
      ok: true;
      type: "visual-overlay";
      overlay: PixelSurfaceDTO;
      changePercent: number;
    }
  | {
      id: string;
      ok: false;
      error: string;
    };
