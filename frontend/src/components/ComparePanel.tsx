import { useCallback, useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import {
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
import { formatFileLimit } from "../config/limits";
import { PdfClientError } from "../services/pdfClient";
import { openPdfFile } from "../services/pdfJsClient";
import { fileKey } from "../utils/files";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../i18n/I18nProvider";

const MIN_SCALE = 0.35;
const MAX_SCALE = 4;
const SCALE_STEP = 0.2;
const PANE_PADDING_PX = 24;

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
}: {
  doc: PDFDocumentProxy | null;
  pageNum: number;
  scale: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!doc) return;

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
  }, [doc, pageNum, scale]);

  if (!doc) {
    return (
      <div className="compare-page-placeholder">
        <span>No document</span>
      </div>
    );
  }

  if (pageNum > doc.numPages) {
    return (
      <div className="compare-page-placeholder">
        <span>—</span>
      </div>
    );
  }

  return (
    <div className="compare-page">
      <span className="compare-page-label">Page {pageNum}</span>
      {error ? (
        <div className="compare-page-placeholder">{error}</div>
      ) : (
        <canvas ref={canvasRef} className="compare-page-canvas" />
      )}
    </div>
  );
}

interface ComparePanelProps {
  pdfFiles: File[];
  onReviewModeChange?: (active: boolean) => void;
}

export default function ComparePanel({ pdfFiles, onReviewModeChange }: ComparePanelProps) {
  const { messages } = useI18n();
  const copy = messages.compare;
  const { entitlements } = useAuth();
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const syncingScroll = useRef(false);

  const loadPdf = useCallback((file: File) => openPdfFile(file), []);

  const pageCount = Math.max(leftDoc?.numPages ?? 0, rightDoc?.numPages ?? 0, 0);
  const pages =
    pageCount > 0 ? Array.from({ length: pageCount }, (_, index) => index + 1) : [];
  const visiblePages = viewMode === "single" ? [currentPage] : pages;
  const readyForReview = Boolean(leftDoc && rightDoc);

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
    setCurrentPage(1);
    void fitBothToWidth();
  };

  const exitReviewMode = () => {
    setReviewMode(false);
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
        goToPage(currentPage - 1);
      } else if (viewMode === "single" && event.key === "ArrowRight") {
        event.preventDefault();
        goToPage(currentPage + 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [reviewMode, linkZoom, viewMode, currentPage, pageCount]);

  const pageLabel = copy.pageOf
    .replace("{current}", String(currentPage))
    .replace("{total}", String(pageCount));

  const renderToolbar = () => (
    <div className="compare-toolbar">
      <div className="compare-toolbar-group">
        <IconButton
          icon={linkScroll ? <Link2 size={18} /> : <Link2Off size={18} />}
          label={linkScroll ? copy.scrollLinked : copy.scrollIndependent}
          variant={linkScroll ? "primary" : "secondary"}
          onClick={() => setLinkScroll((value) => !value)}
          disabled={viewMode !== "continuous"}
        />
        <IconButton
          icon={linkZoom ? <Link2 size={18} /> : <Link2Off size={18} />}
          label={linkZoom ? copy.zoomLinked : copy.zoomIndependent}
          variant={linkZoom ? "primary" : "secondary"}
          onClick={() => setLinkZoom((value) => !value)}
        />
      </div>

      <div className="compare-toolbar-group">
        <IconButton
          icon={<ZoomOut size={18} />}
          label={copy.zoomOut}
          variant="secondary"
          onClick={() => (linkZoom ? zoomBoth(-SCALE_STEP) : zoomLeft(-SCALE_STEP))}
        />
        <span className="compare-zoom-label">
          {linkZoom
            ? `${Math.round(leftScale * 100)}%`
            : `L ${Math.round(leftScale * 100)}% · R ${Math.round(rightScale * 100)}%`}
        </span>
        <IconButton
          icon={<ZoomIn size={18} />}
          label={copy.zoomIn}
          variant="secondary"
          onClick={() => (linkZoom ? zoomBoth(SCALE_STEP) : zoomLeft(SCALE_STEP))}
        />
        {!linkZoom && (
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
        <button type="button" className="btn btn-secondary btn-sm compare-fit-btn" onClick={() => void fitBothToWidth()}>
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
  );

  const renderViewer = () => (
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
          {visiblePages.map((pageNum) => (
            <PageCanvas key={`left-${pageNum}`} doc={leftDoc} pageNum={pageNum} scale={leftScale} />
          ))}
        </div>
      </div>

      <div className="compare-pane">
        <div className="compare-pane-title">{rightFile?.name ?? copy.rightLabel}</div>
        <div
          ref={rightScrollRef}
          className={`compare-pane-scroll ${viewMode === "single" ? "compare-pane-scroll--single" : ""}`}
          onScroll={() => syncScroll("right")}
        >
          {visiblePages.map((pageNum) => (
            <PageCanvas
              key={`right-${pageNum}`}
              doc={rightDoc}
              pageNum={pageNum}
              scale={rightScale}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`panel tool-panel compare-panel ${reviewMode ? "compare-panel--review" : ""}`}
    >
      {!reviewMode && (
        <>
          <h2>{copy.setupTitle}</h2>
          <p className="description">{copy.setupDescription}</p>

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
              <button type="button" className="btn btn-primary" onClick={enterReviewMode}>
                {copy.enterReview}
              </button>
            </div>
          )}
        </>
      )}

      {reviewMode && (
        <>
          {renderToolbar()}
          {renderViewer()}
        </>
      )}

      {loading && <p className="file-hint muted">{copy.loading}</p>}
      {message && <div className="message error">{message}</div>}
    </div>
  );
}
