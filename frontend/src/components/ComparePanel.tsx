import { useCallback, useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import {
  Columns2,
  Link2,
  Link2Off,
  Trash2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import IconButton from "./IconButton";
import { formatFileLimit } from "../config/limits";
import { fileMatchesAccept } from "../utils/fileTypes";
import { useAuth } from "../hooks/useAuth";

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const SCALE_STEP = 0.15;

type PdfJsModule = typeof import("pdfjs-dist");

let pdfjsPromise: Promise<PdfJsModule> | null = null;

async function getPdfJs(): Promise<PdfJsModule> {
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

function PdfSlot({
  label,
  file,
  onFile,
  onClear,
}: {
  label: string;
  file: File | null;
  onFile: (file: File) => void;
  onClear: () => void;
}) {
  const { entitlements } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (list: FileList | null) => {
    const next = list?.[0];
    if (!next) return;
    if (!fileMatchesAccept(next, ".pdf")) return;
    if (next.size > entitlements.fileLimitBytes) return;
    onFile(next);
  };

  return (
    <div className="compare-upload-slot">
      <div className="compare-upload-slot-header">
        <strong>{label}</strong>
        {file && (
          <button type="button" className="compare-clear-btn" onClick={onClear}>
            <Trash2 size={14} />
            Remove
          </button>
        )}
      </div>
      {file ? (
        <p className="compare-file-name">{file.name}</p>
      ) : (
        <button
          type="button"
          className="compare-upload-btn"
          onClick={() => inputRef.current?.click()}
        >
          Choose PDF
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        hidden
        onChange={(event) => handleFiles(event.target.files)}
      />
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

export default function ComparePanel() {
  const { entitlements } = useAuth();
  const [leftFile, setLeftFile] = useState<File | null>(null);
  const [rightFile, setRightFile] = useState<File | null>(null);
  const [leftDoc, setLeftDoc] = useState<PDFDocumentProxy | null>(null);
  const [rightDoc, setRightDoc] = useState<PDFDocumentProxy | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [leftScale, setLeftScale] = useState(1.1);
  const [rightScale, setRightScale] = useState(1.1);
  const [linkScroll, setLinkScroll] = useState(true);
  const [linkZoom, setLinkZoom] = useState(true);

  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const syncingScroll = useRef(false);

  const loadPdf = useCallback(async (file: File) => {
    const pdfjs = await getPdfJs();
    const data = await file.arrayBuffer();
    return pdfjs.getDocument({ data }).promise;
  }, []);

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
      } catch {
        if (!cancelled) setMessage("Could not open the left PDF.");
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
      } catch {
        if (!cancelled) setMessage("Could not open the right PDF.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [rightFile, loadPdf]);

  const pageCount = Math.max(leftDoc?.numPages ?? 0, rightDoc?.numPages ?? 0, 0);
  const pages = pageCount > 0 ? Array.from({ length: pageCount }, (_, i) => i + 1) : [];

  const syncScroll = (source: "left" | "right") => {
    if (!linkScroll || syncingScroll.current) return;

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

  return (
    <div className="panel tool-panel compare-panel">
      <h2>Compare PDFs</h2>
      <p className="description">
        Review two versions of a contract, proposal, or report side by side. Link scroll and zoom
        to keep both panes aligned while you inspect changes.
      </p>

      <div className="compare-upload-row">
        <PdfSlot
          label="Left PDF"
          file={leftFile}
          onFile={setLeftFile}
          onClear={() => setLeftFile(null)}
        />
        <PdfSlot
          label="Right PDF"
          file={rightFile}
          onFile={setRightFile}
          onClear={() => setRightFile(null)}
        />
      </div>

      <p className="file-hint muted">
        PDF only · up to {formatFileLimit(entitlements.fileLimitMb)} per file on {entitlements.label} ·
        rendered locally in your browser
      </p>

      {(leftDoc || rightDoc) && (
        <>
          <div className="compare-toolbar">
            <div className="compare-toolbar-group">
              <IconButton
                icon={linkScroll ? <Link2 size={18} /> : <Link2Off size={18} />}
                label={linkScroll ? "Scroll linked" : "Scroll independent"}
                variant={linkScroll ? "primary" : "secondary"}
                onClick={() => setLinkScroll((value) => !value)}
              />
              <IconButton
                icon={linkZoom ? <Link2 size={18} /> : <Link2Off size={18} />}
                label={linkZoom ? "Zoom linked" : "Zoom independent"}
                variant={linkZoom ? "primary" : "secondary"}
                onClick={() => setLinkZoom((value) => !value)}
              />
            </div>

            <div className="compare-toolbar-group">
              <IconButton
                icon={<ZoomOut size={18} />}
                label="Zoom out"
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
                label="Zoom in"
                variant="secondary"
                onClick={() => (linkZoom ? zoomBoth(SCALE_STEP) : zoomLeft(SCALE_STEP))}
              />
              {!linkZoom && (
                <>
                  <IconButton
                    icon={<ZoomOut size={18} />}
                    label="Zoom out right pane"
                    variant="secondary"
                    onClick={() => zoomRight(-SCALE_STEP)}
                  />
                  <IconButton
                    icon={<ZoomIn size={18} />}
                    label="Zoom in right pane"
                    variant="secondary"
                    onClick={() => zoomRight(SCALE_STEP)}
                  />
                </>
              )}
            </div>

            <div className="compare-toolbar-meta">
              <Columns2 size={16} />
              {pageCount} page{pageCount === 1 ? "" : "s"}
            </div>
          </div>

          <div className="compare-viewer">
            <div className="compare-pane">
              <div className="compare-pane-title">{leftFile?.name ?? "Left PDF"}</div>
              <div
                ref={leftScrollRef}
                className="compare-pane-scroll"
                onScroll={() => syncScroll("left")}
              >
                {pages.map((pageNum) => (
                  <PageCanvas key={`left-${pageNum}`} doc={leftDoc} pageNum={pageNum} scale={leftScale} />
                ))}
              </div>
            </div>

            <div className="compare-pane">
              <div className="compare-pane-title">{rightFile?.name ?? "Right PDF"}</div>
              <div
                ref={rightScrollRef}
                className="compare-pane-scroll"
                onScroll={() => syncScroll("right")}
              >
                {pages.map((pageNum) => (
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
        </>
      )}

      {loading && <p className="file-hint muted">Loading PDF…</p>}
      {message && <div className="message error">{message}</div>}
    </div>
  );
}
