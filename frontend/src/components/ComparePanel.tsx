/**
 * PDF compare panel — setup, review viewer, optional diff analysis.
 *
 * Modes:
 * - Viewer (default): linked scroll/zoom, single or continuous pages, fullscreen.
 * - Diff (opt-in): text redline | visual pixel overlay | 50% blend overlay.
 *
 * Swap, diff worker lifecycle, and architecture are documented in:
 * @see ../../../../docs/product/pdf-compare-diff.md
 */
import { useCallback, useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import {
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  Columns2,
  Expand,
  Link2,
  Link2Off,
  List,
  Minimize2,
  Shrink,
  Square,
  Trash2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import IconButton from "./IconButton";
import CompareDiffModeMenu from "./compare/CompareDiffModeMenu";
import CompareTextDiffView from "./compare/CompareTextDiffView";
import { formatFileLimit } from "../config/limits";
import { PdfClientError } from "../services/pdfClient";
import { openPdfFile } from "../services/pdfJsClient";
import {
  analyzeCompareDocuments,
  renderVisualDiffForPage,
  terminateCompareDiffWorker,
  type CompareAnalysis,
  type CompareDiffMode,
  type PageDiffResult,
} from "../services/compareDiff";
import { fileKey } from "../utils/files";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../i18n/I18nProvider";
import { useWorkspaceNav } from "../context/WorkspaceNavContext";
import { TOOL_NEXT_STEPS } from "../config/toolNextSteps";
import { toolPath } from "../config/tools";

const MIN_SCALE = 0.35;
const MAX_SCALE = 4;
const SCALE_STEP = 0.2;
const PANE_PADDING_PX = 24;
const DEFAULT_DIFF_SENSITIVITY = 12;

type ViewMode = "continuous" | "single";

function formatPdfOpenError(err: unknown, side: "left" | "right"): string {
  if (err instanceof PdfClientError) {
    return err.message;
  }
  return `Could not open the ${side} PDF.`;
}

function CompareSlotPicker({
  label,
  file,
  pdfFiles,
  onSelect,
  onClear,
  removeLabel,
  trayHint,
}: {
  label: string;
  file: File | null;
  pdfFiles: File[];
  onSelect: (file: File) => void;
  onClear: () => void;
  removeLabel: string;
  trayHint: string;
}) {
  return (
    <div className="compare-upload-slot">
      <div className="compare-upload-slot-header">
        <strong>{label}</strong>
        {file && (
          <button type="button" className="compare-clear-btn" onClick={onClear}>
            <Trash2 size={14} />
            {removeLabel}
          </button>
        )}
      </div>

      {file ? (
        <p className="compare-file-name">{file.name}</p>
      ) : pdfFiles.length === 0 ? (
        <p className="file-hint muted">{trayHint}</p>
      ) : (
        <div className="compare-tray-picker">
          {pdfFiles.map((candidate) => {
            const key = fileKey(candidate);
            return (
              <button
                key={key}
                type="button"
                className="compare-tray-pick-btn"
                onClick={() => onSelect(candidate)}
              >
                {candidate.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PageCanvas({
  doc,
  pageNum,
  scale,
  overlayCanvas,
  replacementCanvas,
  changed,
  changedLabel,
}: {
  doc: PDFDocumentProxy | null;
  pageNum: number;
  scale: number;
  overlayCanvas?: HTMLCanvasElement | null;
  replacementCanvas?: HTMLCanvasElement | null;
  changed?: boolean;
  changedLabel?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (replacementCanvas || !doc) return;

    let cancelled = false;

    (async () => {
      try {
        const page = await doc.getPage(pageNum);
        if (cancelled) return;

        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport, canvas }).promise;
        setError(null);
      } catch {
        if (!cancelled) setError("Could not render this page.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [doc, pageNum, scale, replacementCanvas]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const base = canvasRef.current;
    if (!overlay || !overlayCanvas || !base) return;

    overlay.width = base.width;
    overlay.height = base.height;
    const context = overlay.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, overlay.width, overlay.height);
    context.drawImage(overlayCanvas, 0, 0, overlay.width, overlay.height);
  }, [overlayCanvas, replacementCanvas, scale, pageNum]);

  useEffect(() => {
    if (!replacementCanvas) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = replacementCanvas.width;
    canvas.height = replacementCanvas.height;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(replacementCanvas, 0, 0);
    setError(null);
  }, [replacementCanvas]);

  if (!doc && !replacementCanvas) {
    return (
      <div className="compare-page-placeholder">
        <span>No document</span>
      </div>
    );
  }

  if (doc && pageNum > doc.numPages && !replacementCanvas) {
    return (
      <div className="compare-page-placeholder">
        <span>—</span>
      </div>
    );
  }

  return (
    <div className={`compare-page ${changed ? "compare-page--changed" : ""}`}>
      <span className="compare-page-label">
        Page {pageNum}
        {changed && changedLabel ? (
          <span className="compare-page-changed-badge">{changedLabel}</span>
        ) : null}
      </span>
      {error ? (
        <div className="compare-page-placeholder">{error}</div>
      ) : (
        <div className="compare-page-canvas-wrap">
          <canvas ref={canvasRef} className="compare-page-canvas" />
          {overlayCanvas ? (
            <canvas ref={overlayRef} className="compare-page-overlay" aria-hidden="true" />
          ) : null}
        </div>
      )}
    </div>
  );
}

interface ComparePanelProps {
  pdfFiles: File[];
  onReviewModeChange?: (active: boolean) => void;
}

function pageIsChanged(result: PageDiffResult | undefined): boolean {
  if (!result) return false;
  return result.status !== "identical";
}

export default function ComparePanel({ pdfFiles, onReviewModeChange }: ComparePanelProps) {
  const { messages, locale } = useI18n();
  const copy = messages.compare;
  const { entitlements } = useAuth();
  const workspaceNav = useWorkspaceNav();
  const [leftFile, setLeftFile] = useState<File | null>(null);
  const [rightFile, setRightFile] = useState<File | null>(null);
  const [leftDoc, setLeftDoc] = useState<PDFDocumentProxy | null>(null);
  const [rightDoc, setRightDoc] = useState<PDFDocumentProxy | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [leftScale, setLeftScale] = useState(1);
  const [rightScale, setRightScale] = useState(1);
  const [linkScroll, setLinkScroll] = useState(true);
  const [linkZoom, setLinkZoom] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("single");
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewMode, setReviewMode] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [diffMode, setDiffMode] = useState<CompareDiffMode>("off");
  const [diffSensitivity, setDiffSensitivity] = useState(DEFAULT_DIFF_SENSITIVITY);
  const [diffAnalysis, setDiffAnalysis] = useState<CompareAnalysis | null>(null);
  const [diffAnalyzing, setDiffAnalyzing] = useState(false);
  const [diffProgress, setDiffProgress] = useState<string | null>(null);
  const [visualOverlays, setVisualOverlays] = useState<
    Record<number, { leftOverlay: HTMLCanvasElement; rightOverlay: HTMLCanvasElement; blend: HTMLCanvasElement }>
  >({});

  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const syncingScroll = useRef(false);
  const analysisToken = useRef(0);
  const skipPdfReloadRef = useRef(0);

  const loadPdf = useCallback((file: File) => openPdfFile(file), []);

  const pageCount = Math.max(leftDoc?.numPages ?? 0, rightDoc?.numPages ?? 0, 0);
  const pages =
    pageCount > 0 ? Array.from({ length: pageCount }, (_, index) => index + 1) : [];
  const visiblePages = viewMode === "single" ? [currentPage] : pages;
  const readyForReview = Boolean(leftDoc && rightDoc);
  const changedPages = diffAnalysis?.changedPageNums ?? [];
  const diffActive = diffMode !== "off";

  const getPageResult = useCallback(
    (pageNum: number) => diffAnalysis?.pages.find((page) => page.pageNum === pageNum),
    [diffAnalysis]
  );

  useEffect(() => {
    onReviewModeChange?.(reviewMode);
  }, [reviewMode, onReviewModeChange]);

  useEffect(() => {
    if (leftFile && !pdfFiles.some((file) => fileKey(file) === fileKey(leftFile))) {
      setLeftFile(null);
    }
    if (rightFile && !pdfFiles.some((file) => fileKey(file) === fileKey(rightFile))) {
      setRightFile(null);
    }
  }, [pdfFiles, leftFile, rightFile]);

  useEffect(() => {
    if (!leftFile && pdfFiles[0]) {
      setLeftFile(pdfFiles[0]);
    }
    if (!rightFile && pdfFiles[1]) {
      setRightFile(pdfFiles[1]);
    }
  }, [pdfFiles, leftFile, rightFile]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!leftFile) {
        setLeftDoc(null);
        return;
      }

      if (skipPdfReloadRef.current > 0) {
        skipPdfReloadRef.current -= 1;
        return;
      }

      setLoading(true);
      try {
        const doc = await loadPdf(leftFile);
        if (!cancelled) setLeftDoc(doc);
      } catch (err) {
        if (!cancelled) setMessage(formatPdfOpenError(err, "left"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [leftFile, loadPdf]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!rightFile) {
        setRightDoc(null);
        return;
      }

      if (skipPdfReloadRef.current > 0) {
        skipPdfReloadRef.current -= 1;
        return;
      }

      setLoading(true);
      try {
        const doc = await loadPdf(rightFile);
        if (!cancelled) setRightDoc(doc);
      } catch (err) {
        if (!cancelled) setMessage(formatPdfOpenError(err, "right"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [rightFile, loadPdf]);

  useEffect(() => {
    if (currentPage > pageCount && pageCount > 0) {
      setCurrentPage(pageCount);
    }
  }, [currentPage, pageCount]);

  useEffect(() => {
    if (!reviewMode || !leftDoc || !rightDoc || diffMode === "off") {
      setDiffAnalysis(null);
      setDiffProgress(null);
      setDiffAnalyzing(false);
      return;
    }

    const token = analysisToken.current + 1;
    analysisToken.current = token;
    setDiffAnalyzing(true);
    setDiffProgress(copy.analyzing.replace("{current}", "0").replace("{total}", String(pageCount)));

    void analyzeCompareDocuments(
      leftDoc,
      rightDoc,
      diffMode,
      diffSensitivity,
      (completed, total) => {
        if (analysisToken.current !== token) return;
        setDiffProgress(
          copy.analyzing.replace("{current}", String(completed)).replace("{total}", String(total))
        );
      },
      () => analysisToken.current !== token
    )
      .then((analysis) => {
        if (analysisToken.current !== token) return;
        setDiffAnalysis(analysis);
      })
      .catch((err) => {
        if (analysisToken.current !== token) return;
        if (err instanceof Error && err.message === "Analysis cancelled") return;
        setMessage(copy.analyzeFailed);
      })
      .finally(() => {
        if (analysisToken.current !== token) return;
        setDiffAnalyzing(false);
        setDiffProgress(null);
      });
  }, [reviewMode, leftDoc, rightDoc, diffMode, diffSensitivity, pageCount, copy.analyzing, copy.analyzeFailed]);

  useEffect(() => {
    return () => {
      terminateCompareDiffWorker();
    };
  }, []);

  useEffect(() => {
    if (!reviewMode || !leftDoc || !rightDoc) {
      setVisualOverlays({});
      return;
    }

    if (diffMode !== "visual" && diffMode !== "overlay") {
      setVisualOverlays({});
      return;
    }

    let cancelled = false;

    void (async () => {
      const next: Record<
        number,
        { leftOverlay: HTMLCanvasElement; rightOverlay: HTMLCanvasElement; blend: HTMLCanvasElement }
      > = {};

      for (const pageNum of visiblePages) {
        const rendered = await renderVisualDiffForPage(
          leftDoc,
          rightDoc,
          pageNum,
          leftScale,
          rightScale,
          diffSensitivity
        );

        if (cancelled) return;

        if (rendered.leftOverlay && rendered.rightOverlay && rendered.blend) {
          next[pageNum] = {
            leftOverlay: rendered.leftOverlay,
            rightOverlay: rendered.rightOverlay,
            blend: rendered.blend,
          };
        }
      }

      if (!cancelled) setVisualOverlays(next);
    })();

    return () => {
      cancelled = true;
    };
  }, [
    reviewMode,
    leftDoc,
    rightDoc,
    diffMode,
    diffSensitivity,
    visiblePages,
    leftScale,
    rightScale,
    linkZoom,
  ]);

  const syncScroll = (source: "left" | "right") => {
    if (!linkScroll || syncingScroll.current || viewMode !== "continuous") return;

    const left = leftScrollRef.current;
    const right = rightScrollRef.current;
    if (!left || !right) return;

    syncingScroll.current = true;
    if (source === "left") {
      right.scrollTop = left.scrollTop;
      right.scrollLeft = left.scrollLeft;
    } else {
      left.scrollTop = right.scrollTop;
      left.scrollLeft = right.scrollLeft;
    }
    requestAnimationFrame(() => {
      syncingScroll.current = false;
    });
  };

  const clampScale = (value: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));

  const zoomBoth = (delta: number) => {
    setLeftScale((current) => clampScale(current + delta));
    setRightScale((current) => clampScale(current + delta));
  };

  const zoomLeft = (delta: number) => setLeftScale((current) => clampScale(current + delta));
  const zoomRight = (delta: number) => setRightScale((current) => clampScale(current + delta));

  const fitBothToWidth = async () => {
    if (!leftDoc || !rightDoc) return;

    const leftPane = leftScrollRef.current;
    const rightPane = rightScrollRef.current;
    if (!leftPane || !rightPane) return;

    try {
      const [leftPage, rightPage] = await Promise.all([
        leftDoc.getPage(Math.min(currentPage, leftDoc.numPages)),
        rightDoc.getPage(Math.min(currentPage, rightDoc.numPages)),
      ]);
      const leftBase = leftPage.getViewport({ scale: 1 });
      const rightBase = rightPage.getViewport({ scale: 1 });
      const leftFit = (leftPane.clientWidth - PANE_PADDING_PX) / leftBase.width;
      const rightFit = (rightPane.clientWidth - PANE_PADDING_PX) / rightBase.width;
      const nextScale = clampScale(Math.min(leftFit, rightFit));
      setLeftScale(nextScale);
      setRightScale(nextScale);
    } catch {
      setMessage("Could not fit documents to pane width.");
    }
  };

  const enterReviewMode = () => {
    if (!readyForReview) return;
    setReviewMode(true);
    setHasReviewed(true);
    setCurrentPage(1);
    void fitBothToWidth();
  };

  const exitReviewMode = () => {
    setReviewMode(false);
    setDiffMode("off");
    setDiffAnalysis(null);
    if (document.fullscreenElement === viewerRef.current) {
      void document.exitFullscreen();
    }
  };

  const toggleFullscreen = async () => {
    if (!viewerRef.current) return;

    if (document.fullscreenElement === viewerRef.current) {
      await document.exitFullscreen();
      return;
    }

    await viewerRef.current.requestFullscreen();
  };

  const goToPage = (page: number) => {
    if (pageCount === 0) return;
    setCurrentPage(Math.min(pageCount, Math.max(1, page)));
  };

  const swapDocuments = () => {
    if (!leftFile || !rightFile || !leftDoc || !rightDoc) return;

    skipPdfReloadRef.current = 2;
    setLeftFile(rightFile);
    setRightFile(leftFile);
    setLeftDoc(rightDoc);
    setRightDoc(leftDoc);
    setLeftScale(rightScale);
    setRightScale(leftScale);
    setDiffAnalysis(null);
    setVisualOverlays({});
    setMessage(null);
  };

  const goToNextChange = () => {
    if (!changedPages.length) return;
    const next = changedPages.find((page) => page > currentPage) ?? changedPages[0];
    goToPage(next);
  };

  const goToPrevChange = () => {
    if (!changedPages.length) return;
    const previous =
      [...changedPages].reverse().find((page) => page < currentPage) ??
      changedPages[changedPages.length - 1];
    goToPage(previous);
  };

  useEffect(() => {
    if (!reviewMode || !readyForReview) return;

    const timer = window.setTimeout(() => {
      void fitBothToWidth();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [reviewMode, readyForReview, leftDoc, rightDoc, currentPage, viewMode]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === viewerRef.current);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    if (!reviewMode) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        linkZoom ? zoomBoth(SCALE_STEP) : zoomLeft(SCALE_STEP);
      } else if (event.key === "-") {
        event.preventDefault();
        linkZoom ? zoomBoth(-SCALE_STEP) : zoomLeft(-SCALE_STEP);
      } else if (viewMode === "single" && event.key === "ArrowLeft") {
        event.preventDefault();
        if (event.shiftKey && diffActive && changedPages.length) {
          goToPrevChange();
        } else {
          goToPage(currentPage - 1);
        }
      } else if (viewMode === "single" && event.key === "ArrowRight") {
        event.preventDefault();
        if (event.shiftKey && diffActive && changedPages.length) {
          goToNextChange();
        } else {
          goToPage(currentPage + 1);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [reviewMode, linkZoom, viewMode, currentPage, pageCount, diffActive, changedPages]);

  const pageLabel = copy.pageOf
    .replace("{current}", String(currentPage))
    .replace("{total}", String(pageCount));

  const renderDiffToolbar = () => {
    if (!diffActive) return null;

    return (
      <div className="compare-diff-toolbar">
        {(diffMode === "visual" || diffMode === "overlay") && (
          <label className="compare-diff-sensitivity">
            <span>{copy.sensitivity}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={diffSensitivity}
              onChange={(event) => setDiffSensitivity(Number(event.target.value))}
            />
          </label>
        )}

        {diffAnalyzing && diffProgress ? (
          <span className="compare-diff-status">{diffProgress}</span>
        ) : (
          <span className="compare-diff-status">
            {changedPages.length
              ? copy.changesFound.replace("{count}", String(changedPages.length))
              : copy.noChangesFound}
          </span>
        )}

        {viewMode === "single" && changedPages.length > 0 && (
          <div className="compare-toolbar-group">
            <IconButton
              icon={<ChevronLeft size={18} />}
              label={copy.prevChange}
              variant="secondary"
              onClick={goToPrevChange}
            />
            <IconButton
              icon={<ChevronRight size={18} />}
              label={copy.nextChange}
              variant="secondary"
              onClick={goToNextChange}
            />
          </div>
        )}
      </div>
    );
  };

  const renderToolbar = () => (
    <>
      <div className="compare-toolbar">
        <div className="compare-toolbar-group compare-toolbar-group--sync">
          <IconButton
            icon={linkScroll ? <Link2 size={18} /> : <Link2Off size={18} />}
            label={linkScroll ? copy.scrollLinked : copy.scrollIndependent}
            variant={linkScroll ? "primary" : "secondary"}
            onClick={() => setLinkScroll((value) => !value)}
            disabled={viewMode !== "continuous" || diffMode === "text"}
          />
          <IconButton
            icon={linkZoom ? <Link2 size={18} /> : <Link2Off size={18} />}
            label={linkZoom ? copy.zoomLinked : copy.zoomIndependent}
            variant={linkZoom ? "primary" : "secondary"}
            onClick={() => setLinkZoom((value) => !value)}
            disabled={diffMode === "text"}
          />
          <CompareDiffModeMenu
            mode={diffMode}
            analyzing={diffAnalyzing}
            labels={{
              viewerMode: copy.viewerMode,
              diffMode: copy.diffMode,
              chooseMode: copy.chooseDiffMode,
              modeOff: copy.modeOff,
              modeText: copy.modeText,
              modeVisual: copy.modeVisual,
              modeOverlay: copy.modeOverlay,
            }}
            onChange={setDiffMode}
          />
        </div>

        <div className="compare-toolbar-group">
          <IconButton
            icon={<ZoomOut size={18} />}
            label={copy.zoomOut}
            variant="secondary"
            onClick={() => (linkZoom ? zoomBoth(-SCALE_STEP) : zoomLeft(-SCALE_STEP))}
            disabled={diffMode === "text"}
          />
          <span className="compare-zoom-label">
            {diffMode === "text"
              ? copy.textDiffLabel
              : linkZoom
                ? `${Math.round(leftScale * 100)}%`
                : `L ${Math.round(leftScale * 100)}% · R ${Math.round(rightScale * 100)}%`}
          </span>
          <IconButton
            icon={<ZoomIn size={18} />}
            label={copy.zoomIn}
            variant="secondary"
            onClick={() => (linkZoom ? zoomBoth(SCALE_STEP) : zoomLeft(SCALE_STEP))}
            disabled={diffMode === "text"}
          />
          {!linkZoom && diffMode !== "text" && (
            <>
              <IconButton
                icon={<ZoomOut size={18} />}
                label={copy.zoomOutRight}
                variant="secondary"
                onClick={() => zoomRight(-SCALE_STEP)}
              />
              <IconButton
                icon={<ZoomIn size={18} />}
                label={copy.zoomInRight}
                variant="secondary"
                onClick={() => zoomRight(SCALE_STEP)}
              />
            </>
          )}
          <button
            type="button"
            className="btn btn-secondary btn-sm compare-fit-btn"
            onClick={() => void fitBothToWidth()}
            disabled={diffMode === "text"}
          >
            <Shrink size={16} />
            {copy.fitWidth}
          </button>
        </div>

        <div className="compare-toolbar-group">
          <IconButton
            icon={<List size={18} />}
            label={copy.viewContinuous}
            variant={viewMode === "continuous" ? "primary" : "secondary"}
            onClick={() => setViewMode("continuous")}
            disabled={diffMode === "text"}
          />
          <IconButton
            icon={<Square size={18} />}
            label={copy.viewSinglePage}
            variant={viewMode === "single" ? "primary" : "secondary"}
            onClick={() => setViewMode("single")}
          />
        </div>

        {viewMode === "single" && pageCount > 0 && (
          <div className="compare-toolbar-group compare-page-nav">
            <IconButton
              icon={<ChevronLeft size={18} />}
              label={copy.prevPage}
              variant="secondary"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
            />
            <label className="compare-page-input-label">
              <span className="sr-only">{pageLabel}</span>
              <input
                type="number"
                min={1}
                max={pageCount}
                value={currentPage}
                onChange={(event) => goToPage(Number(event.target.value))}
                className="compare-page-input"
              />
              <span className="compare-page-total">/ {pageCount}</span>
            </label>
            <IconButton
              icon={<ChevronRight size={18} />}
              label={copy.nextPage}
              variant="secondary"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= pageCount}
            />
          </div>
        )}

        <div className="compare-toolbar-group compare-toolbar-actions">
          <IconButton
            icon={<ArrowLeftRight size={18} />}
            label={copy.swapDocuments}
            variant="secondary"
            onClick={swapDocuments}
            disabled={!readyForReview}
          />
          <button type="button" className="btn btn-secondary btn-sm" onClick={exitReviewMode}>
            {copy.changeDocuments}
          </button>
          <IconButton
            icon={isFullscreen ? <Minimize2 size={18} /> : <Expand size={18} />}
            label={isFullscreen ? copy.exitFullscreen : copy.fullscreen}
            variant="secondary"
            onClick={() => void toggleFullscreen()}
          />
          <div className="compare-toolbar-meta">
            <Columns2 size={16} />
            {pageCount} {copy.pages}
          </div>
        </div>
      </div>
      {renderDiffToolbar()}
    </>
  );

  const renderTextDiffViewer = () => (
    <div
      ref={viewerRef}
      className={`compare-viewer compare-viewer--text-diff ${reviewMode ? "compare-viewer--review" : ""} ${
        isFullscreen ? "compare-viewer--fullscreen" : ""
      }`}
    >
      {visiblePages.map((pageNum) => {
        const pageResult = getPageResult(pageNum);
        return (
          <div key={`text-${pageNum}`} className="compare-text-diff-row">
            <div className="compare-text-diff-row-label">
              {copy.pageOf.replace("{current}", String(pageNum)).replace("{total}", String(pageCount))}
              {pageIsChanged(pageResult) ? (
                <span className="compare-page-changed-badge">{copy.changed}</span>
              ) : null}
            </div>
            <div className="compare-text-diff-columns">
              <CompareTextDiffView
                side={pageResult?.textDiff?.left ?? null}
                title={leftFile?.name ?? copy.leftLabel}
                emptyLabel={copy.noTextOnPage}
              />
              <CompareTextDiffView
                side={pageResult?.textDiff?.right ?? null}
                title={rightFile?.name ?? copy.rightLabel}
                emptyLabel={copy.noTextOnPage}
              />
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderCanvasViewer = () => (
    <div
      ref={viewerRef}
      className={`compare-viewer ${reviewMode ? "compare-viewer--review" : ""} ${
        isFullscreen ? "compare-viewer--fullscreen" : ""
      }`}
    >
      <div className="compare-pane">
        <div className="compare-pane-title">{leftFile?.name ?? copy.leftLabel}</div>
        <div
          ref={leftScrollRef}
          className={`compare-pane-scroll ${viewMode === "single" ? "compare-pane-scroll--single" : ""}`}
          onScroll={() => syncScroll("left")}
        >
          {visiblePages.map((pageNum) => {
            const pageResult = getPageResult(pageNum);
            const overlays = visualOverlays[pageNum];
            return (
              <PageCanvas
                key={`left-${pageNum}`}
                doc={leftDoc}
                pageNum={pageNum}
                scale={leftScale}
                overlayCanvas={diffMode === "visual" ? overlays?.leftOverlay ?? null : null}
                changed={diffActive && pageIsChanged(pageResult)}
                changedLabel={copy.changed}
              />
            );
          })}
        </div>
      </div>

      <div className="compare-pane">
        <div className="compare-pane-title">
          {diffMode === "overlay" ? copy.overlayLabel : (rightFile?.name ?? copy.rightLabel)}
        </div>
        <div
          ref={rightScrollRef}
          className={`compare-pane-scroll ${viewMode === "single" ? "compare-pane-scroll--single" : ""}`}
          onScroll={() => syncScroll("right")}
        >
          {visiblePages.map((pageNum) => {
            const pageResult = getPageResult(pageNum);
            const overlays = visualOverlays[pageNum];
            return (
              <PageCanvas
                key={`right-${pageNum}`}
                doc={rightDoc}
                pageNum={pageNum}
                scale={rightScale}
                overlayCanvas={diffMode === "visual" ? overlays?.rightOverlay ?? null : null}
                replacementCanvas={diffMode === "overlay" ? overlays?.blend ?? null : null}
                changed={diffActive && pageIsChanged(pageResult)}
                changedLabel={copy.changed}
              />
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`panel tool-panel compare-panel ${reviewMode ? "compare-panel--review" : ""} ${
        diffActive ? "compare-panel--diff" : ""
      }`}
    >
      {!reviewMode && (
        <>
          {hasReviewed ? (
            <>
              <h2>Review complete</h2>
              <p className="description">Continue working with these files or select new ones.</p>
            </>
          ) : (
            <>
              <h2>{copy.setupTitle}</h2>
              <p className="description">{copy.setupDescription}</p>
            </>
          )}

          <div className="compare-upload-row">
            <CompareSlotPicker
              label={copy.leftLabel}
              file={leftFile}
              pdfFiles={pdfFiles}
              onSelect={setLeftFile}
              onClear={() => setLeftFile(null)}
              removeLabel={copy.remove}
              trayHint={copy.addFromTray}
            />
            <CompareSlotPicker
              label={copy.rightLabel}
              file={rightFile}
              pdfFiles={pdfFiles}
              onSelect={setRightFile}
              onClear={() => setRightFile(null)}
              removeLabel={copy.remove}
              trayHint={copy.addFromTray}
            />
          </div>

          <p className="file-hint muted">
            {copy.privacyHint.replace("{limit}", formatFileLimit(entitlements.fileLimitMb))}
          </p>

          {readyForReview && (
            <div className="compare-setup-actions">
              <button type="button" className="btn btn-secondary" onClick={swapDocuments}>
                <ArrowLeftRight size={16} />
                {copy.swapDocuments}
              </button>
              <button type="button" className="btn btn-primary" onClick={enterReviewMode}>
                {hasReviewed ? "Return to review" : copy.enterReview}
              </button>
            </div>
          )}

          {hasReviewed && TOOL_NEXT_STEPS["pdf-compare"] && (
            <div className="tool-result-next-steps" style={{ marginTop: '2rem' }}>
              <p className="tool-result-next-label">Continue with these files</p>
              <div className="tool-result-next-actions">
                {TOOL_NEXT_STEPS["pdf-compare"].map((step) =>
                  workspaceNav ? (
                    <button
                      key={step.toolId}
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => workspaceNav.navigateToTool(step.toolId)}
                    >
                      {step.label}
                      <ArrowRight size={14} aria-hidden="true" />
                    </button>
                  ) : (
                    <a
                      key={step.toolId}
                      href={toolPath(step.toolId, locale)}
                      className="btn btn-secondary btn-sm"
                    >
                      {step.label}
                      <ArrowRight size={14} aria-hidden="true" />
                    </a>
                  )
                )}
              </div>
            </div>
          )}
        </>
      )}

      {reviewMode && (
        <>
          {renderToolbar()}
          {diffMode === "text" ? renderTextDiffViewer() : renderCanvasViewer()}
        </>
      )}

      {loading && <p className="file-hint muted">{copy.loading}</p>}
      {message && <div className="message error">{message}</div>}
    </div>
  );
}
