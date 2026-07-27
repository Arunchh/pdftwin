/**
 * Main-thread facade for the compare diff Web Worker.
 *
 * @see docs/product/pdf-compare-diff.md
 */
import type {
  CompareDiffWorkerRequest,
  CompareDiffWorkerResponse,
  PageDiffStatus,
  PixelSurfaceDTO,
  TextDiffSide,
} from "./compareDiffTypes";

type PendingRequest = {
  resolve: (response: CompareDiffWorkerResponse) => void;
  reject: (error: Error) => void;
};

let worker: Worker | null = null;
let requestCounter = 0;
const pending = new Map<string, PendingRequest>();

function ensureWorker(): Worker {
  if (worker) return worker;

  worker = new Worker(new URL("./compareDiff.worker.ts", import.meta.url), { type: "module" });
  worker.onmessage = (event: MessageEvent<CompareDiffWorkerResponse>) => {
    const response = event.data;
    const request = pending.get(response.id);
    if (!request) return;
    pending.delete(response.id);
    request.resolve(response);
  };
  worker.onerror = (event) => {
    for (const [, request] of pending) {
      request.reject(new Error(event.message || "Compare worker crashed."));
    }
    pending.clear();
    worker?.terminate();
    worker = null;
  };

  return worker;
}

function nextRequestId(): string {
  requestCounter += 1;
  return String(requestCounter);
}

function postRequest(request: CompareDiffWorkerRequest): Promise<CompareDiffWorkerResponse> {
  return new Promise((resolve, reject) => {
    pending.set(request.id, { resolve, reject });
    ensureWorker().postMessage(request);
  });
}

function assertOk(response: CompareDiffWorkerResponse): asserts response is Extract<
  CompareDiffWorkerResponse,
  { ok: true }
> {
  if (!response.ok) {
    throw new Error(response.error);
  }
}

export async function workerTextDiffPage(
  pageNum: number,
  leftText: string,
  rightText: string
): Promise<{
  status: "identical" | "changed";
  textDiff: { left: TextDiffSide; right: TextDiffSide };
  changePercent: number | null;
}> {
  const response = await postRequest({
    id: nextRequestId(),
    type: "text-page",
    pageNum,
    leftText,
    rightText,
  });
  assertOk(response);
  if (response.type !== "text-page") {
    throw new Error("Unexpected worker response for text diff.");
  }
  return {
    status: response.status === "identical" ? "identical" : "changed",
    textDiff: response.textDiff,
    changePercent: response.changePercent,
  };
}

export async function workerVisualAnalyzePage(
  pageNum: number,
  leftExists: boolean,
  rightExists: boolean,
  left: PixelSurfaceDTO | null,
  right: PixelSurfaceDTO | null,
  sensitivity: number
): Promise<{ status: PageDiffStatus; changePercent: number }> {
  const response = await postRequest({
    id: nextRequestId(),
    type: "visual-page",
    pageNum,
    leftExists,
    rightExists,
    left,
    right,
    sensitivity,
  });
  assertOk(response);
  if (response.type !== "visual-page") {
    throw new Error("Unexpected worker response for visual analyze.");
  }
  return { status: response.status, changePercent: response.changePercent };
}

export async function workerVisualOverlay(
  left: PixelSurfaceDTO,
  right: PixelSurfaceDTO,
  sensitivity: number
): Promise<{ overlay: PixelSurfaceDTO; changePercent: number }> {
  const response = await postRequest({
    id: nextRequestId(),
    type: "visual-overlay",
    left,
    right,
    sensitivity,
  });
  assertOk(response);
  if (response.type !== "visual-overlay") {
    throw new Error("Unexpected worker response for visual overlay.");
  }
  return { overlay: response.overlay, changePercent: response.changePercent };
}

export function terminateCompareDiffWorker() {
  worker?.terminate();
  worker = null;
  pending.clear();
}
