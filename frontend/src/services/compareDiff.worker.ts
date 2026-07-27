/**
 * Web Worker entry for PDF compare diff CPU work.
 *
 * PDF.js must stay on the main thread (canvas + document handles). This worker
 * receives extracted text and rasterized page bitmaps, then runs line diffs and
 * pixel loops off-thread.
 *
 * @see docs/product/pdf-compare-diff.md
 */
import {
  computeTextDiff,
  computeVisualDiffFromSurfaces,
  pageStatusFromTextChange,
  pageStatusFromVisualChange,
} from "./compareDiffCore";
import type {
  CompareDiffWorkerRequest,
  CompareDiffWorkerResponse,
} from "./compareDiffTypes";

function post(response: CompareDiffWorkerResponse, transfer: Transferable[] = []) {
  self.postMessage(response, transfer.length > 0 ? { transfer } : undefined);
}

self.onmessage = (event: MessageEvent<CompareDiffWorkerRequest>) => {
  const message = event.data;

  try {
    if (message.type === "text-page") {
      const diff = computeTextDiff(message.leftText, message.rightText);
      const response: CompareDiffWorkerResponse = {
        id: message.id,
        ok: true,
        type: "text-page",
        pageNum: message.pageNum,
        status: pageStatusFromTextChange(diff.hasChanges),
        textDiff: { left: diff.left, right: diff.right },
        changePercent: diff.hasChanges ? null : 0,
      };
      post(response);
      return;
    }

    if (message.type === "visual-page") {
      if (!message.leftExists && message.rightExists) {
        post({
          id: message.id,
          ok: true,
          type: "visual-page",
          pageNum: message.pageNum,
          status: "missing-left",
          changePercent: 100,
        });
        return;
      }
      if (message.leftExists && !message.rightExists) {
        post({
          id: message.id,
          ok: true,
          type: "visual-page",
          pageNum: message.pageNum,
          status: "missing-right",
          changePercent: 100,
        });
        return;
      }
      if (!message.leftExists && !message.rightExists) {
        post({
          id: message.id,
          ok: true,
          type: "visual-page",
          pageNum: message.pageNum,
          status: "identical",
          changePercent: 0,
        });
        return;
      }

      if (!message.left || !message.right) {
        post({
          id: message.id,
          ok: true,
          type: "visual-page",
          pageNum: message.pageNum,
          status: "changed",
          changePercent: 100,
        });
        return;
      }

      const { changePercent } = computeVisualDiffFromSurfaces(
        message.left,
        message.right,
        message.sensitivity
      );

      post({
        id: message.id,
        ok: true,
        type: "visual-page",
        pageNum: message.pageNum,
        status: pageStatusFromVisualChange(changePercent),
        changePercent,
      });
      return;
    }

    if (message.type === "visual-overlay") {
      const { overlay, changePercent } = computeVisualDiffFromSurfaces(
        message.left,
        message.right,
        message.sensitivity
      );
      post(
        {
          id: message.id,
          ok: true,
          type: "visual-overlay",
          overlay,
          changePercent,
        },
        [overlay.data.buffer]
      );
    }
  } catch (error) {
    post({
      id: message.id,
      ok: false,
      error: error instanceof Error ? error.message : "Compare worker failed.",
    });
  }
};

export {};
