import { useEffect, useMemo, useState } from "react";
import { Combine, Download, Pin, PinOff } from "lucide-react";
import DraggableOrderList, { type OrderListItem } from "./DraggableOrderList";
import OrderActions from "./OrderActions";
import ClientProcessedBadge from "./ClientProcessedBadge";
import { downloadBlob } from "../api";
import {
  arrangeAndMergePdfs,
  getPdfPageCount,
  PdfClientError,
  reorderPdf,
} from "../services/pdfClient";
import { defaultPdfOrder, fileKey } from "../utils/files";

interface ArrangeMergePanelProps {
  files: File[];
  pdfOrder: File[];
  onPdfOrderChange: (order: File[]) => void;
  orderFrozen: boolean;
  onOrderFrozenChange: (frozen: boolean) => void;
  onMergedFile?: (file: File) => void;
  onConvertMerged?: () => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function defaultPageNumbers(count: number): number[] {
  return Array.from({ length: count }, (_, index) => index + 1);
}

function isCustomPageOrder(pageNumbers: number[]): boolean {
  const sorted = [...pageNumbers].sort((a, b) => a - b);
  return pageNumbers.some((page, index) => page !== sorted[index]);
}

export default function ArrangeMergePanel({
  files,
  pdfOrder,
  onPdfOrderChange,
  orderFrozen,
  onOrderFrozenChange,
  onMergedFile,
  onConvertMerged,
}: ArrangeMergePanelProps) {
  const [selectedPdfKey, setSelectedPdfKey] = useState<string | null>(null);
  const [pageOrders, setPageOrders] = useState<Record<string, number[]>>({});
  const [pageItems, setPageItems] = useState<OrderListItem[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [loading, setLoading] = useState<"merge" | "download" | null>(null);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const selectedFile =
    pdfOrder.find((file) => fileKey(file) === selectedPdfKey) ?? pdfOrder[0] ?? null;

  const documentItems = useMemo<OrderListItem[]>(
    () =>
      pdfOrder.map((file) => {
        const key = fileKey(file);
        const pages = pageOrders[key];
        return {
          id: key,
          label: file.name,
          meta: formatSize(file.size),
          badge: pages && isCustomPageOrder(pages) ? "Pages edited" : undefined,
        };
      }),
    [pdfOrder, pageOrders]
  );

  useEffect(() => {
    if (!pdfOrder.length) {
      setSelectedPdfKey(null);
      return;
    }

    if (!selectedPdfKey || !pdfOrder.some((file) => fileKey(file) === selectedPdfKey)) {
      setSelectedPdfKey(fileKey(pdfOrder[0]));
    }
  }, [pdfOrder, selectedPdfKey]);

  useEffect(() => {
    if (!selectedFile) {
      setPageItems([]);
      return;
    }

    const key = fileKey(selectedFile);
    let cancelled = false;
    setLoadingPages(true);

    getPdfPageCount(selectedFile)
      .then((count) => {
        if (cancelled) return;

        const existing = pageOrders[key];
        const pageNumbers = existing?.length === count ? existing : defaultPageNumbers(count);

        if (!existing || existing.length !== count) {
          setPageOrders((current) => ({ ...current, [key]: pageNumbers }));
        }

        setPageItems(
          pageNumbers.map((page) => ({
            id: `${key}-page-${page}`,
            label: `Page ${page}`,
          }))
        );
      })
      .catch((err) => {
        if (!cancelled) {
          setPageItems([]);
          setMessage({
            type: "error",
            text: err instanceof PdfClientError || err instanceof Error ? err.message : "Could not read PDF pages.",
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingPages(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedFile]);

  const handleDocumentItemsChange = (items: OrderListItem[]) => {
    const byId = new Map(pdfOrder.map((file) => [fileKey(file), file]));
    const nextOrder = items
      .map((item) => byId.get(item.id))
      .filter((file): file is File => Boolean(file));
    onPdfOrderChange(nextOrder);
    onOrderFrozenChange(false);
  };

  const handlePageItemsChange = (items: OrderListItem[]) => {
    if (!selectedFile) return;
    const key = fileKey(selectedFile);
    const pageNumbers = items.map((item) => Number(item.label.replace("Page ", "")));
    setPageOrders((current) => ({ ...current, [key]: pageNumbers }));
    setPageItems(items);
  };

  const handleResetDocuments = () => {
    onPdfOrderChange(defaultPdfOrder(files));
    onOrderFrozenChange(false);
  };

  const handleResetPages = () => {
    if (!selectedFile) return;
    const key = fileKey(selectedFile);
    const count = pageOrders[key]?.length ?? pageItems.length;
    const reset = defaultPageNumbers(count);
    setPageOrders((current) => ({ ...current, [key]: reset }));
    setPageItems(
      reset.map((page) => ({
        id: `${key}-page-${page}`,
        label: `Page ${page}`,
      }))
    );
  };

  const handleConfirmOrder = () => {
    if (pdfOrder.length < 2) {
      setMessage({ type: "error", text: "Add at least 2 PDF files above to set merge order." });
      return;
    }
    onOrderFrozenChange(true);
    setMessage({ type: "success", text: "Document order confirmed. You can merge or fine-tune pages." });
  };

  const buildPageOrdersPayload = () =>
    pdfOrder.map((file) => {
      const pages = pageOrders[fileKey(file)];
      if (!pages || !isCustomPageOrder(pages)) return "";
      return pages.join(", ");
    });

  const handleMerge = async () => {
    if (pdfOrder.length < 2) {
      setMessage({ type: "error", text: "Add at least 2 PDF files above to merge." });
      return;
    }

    if (!orderFrozen) {
      setMessage({ type: "error", text: "Confirm the document order in step 1 before merging." });
      return;
    }

    setLoading("merge");
    setMessage(null);

    try {
      const mergedBlob = await arrangeAndMergePdfs(pdfOrder, buildPageOrdersPayload());
      const mergedFile = new File([mergedBlob], "merged.pdf", { type: "application/pdf" });
      downloadBlob(mergedFile, mergedFile.name);
      onMergedFile?.(mergedFile);
      setMessage({
        type: "success",
        text: "Merged PDF downloaded and added to your files.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof PdfClientError || err instanceof Error ? err.message : "Merge failed.",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleDownloadReordered = async () => {
    if (!selectedFile) {
      setMessage({ type: "error", text: "Select a PDF above to reorder pages." });
      return;
    }

    const key = fileKey(selectedFile);
    const pages = pageOrders[key];
    if (!pages?.length) {
      setMessage({ type: "error", text: "No pages available to reorder." });
      return;
    }

    setLoading("download");
    setMessage(null);

    try {
      const reorderedBlob = await reorderPdf(selectedFile, pages.join(", "));
      downloadBlob(reorderedBlob, "reordered.pdf");
      setMessage({
        type: "success",
        text: "Reordered PDF downloaded. You can still merge all documents afterward.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof PdfClientError || err instanceof Error ? err.message : "Download failed.",
      });
    } finally {
      setLoading(null);
    }
  };

  const hasCustomPages = Object.values(pageOrders).some(
    (pages) => pages && isCustomPageOrder(pages)
  );

  return (
    <div className="panel tool-panel">
      <h2>Arrange &amp; Merge</h2>
      <p className="description">
        One workflow for organizing PDFs: set document order, optionally adjust pages inside any
        file, then merge everything together.
      </p>
      <ClientProcessedBadge />

      <div className="workflow-rail">
        <div className={`workflow-step ${pdfOrder.length >= 2 ? "active" : ""}`}>
          <span className="workflow-step-number">1</span>
          <span>Documents</span>
        </div>
        <span className="workflow-connector" />
        <div className={`workflow-step ${selectedFile ? "active" : ""}`}>
          <span className="workflow-step-number">2</span>
          <span>Pages</span>
          <span className="workflow-step-tag">Optional</span>
        </div>
        <span className="workflow-connector" />
        <div className={`workflow-step ${orderFrozen ? "active" : ""}`}>
          <span className="workflow-step-number">3</span>
          <span>Merge</span>
        </div>
      </div>

      {pdfOrder.length === 0 ? (
        <p className="file-hint muted">Upload at least 2 PDF files above to get started.</p>
      ) : pdfOrder.length === 1 ? (
        <p className="file-hint muted">Add one more PDF file above to merge.</p>
      ) : (
        <>
          <section className="workflow-panel">
            <div className="workflow-panel-header">
              <div>
                <h3>Step 1 · Document order</h3>
                <p>Drag PDFs into merge order. Click a document to edit its pages in step 2.</p>
              </div>
              <span className={`workflow-status ${orderFrozen ? "done" : "pending"}`}>
                {orderFrozen ? "Confirmed" : "Required"}
              </span>
            </div>

            {orderFrozen ? (
              <p className="file-hint frozen">
                <strong>Document order locked.</strong> Merge will follow the sequence below.
              </p>
            ) : (
              <p className="file-hint">Drag documents, then confirm before merging.</p>
            )}

            <DraggableOrderList
              items={documentItems}
              onChange={handleDocumentItemsChange}
              frozen={orderFrozen}
              selectable
              selectedId={selectedPdfKey}
              onSelect={setSelectedPdfKey}
            />

            <OrderActions
              secondaryIcon={orderFrozen ? <PinOff size={18} /> : <Pin size={18} />}
              secondaryLabel={orderFrozen ? "Edit document order" : "Confirm document order"}
              onSecondary={orderFrozen ? () => onOrderFrozenChange(false) : handleConfirmOrder}
              onReset={handleResetDocuments}
              resetLabel="Reset document order"
              resetDisabled={orderFrozen}
            />
          </section>

          <section className={`workflow-panel ${selectedFile ? "" : "dimmed"}`}>
            <div className="workflow-panel-header">
              <div>
                <h3>Step 2 · Page order</h3>
                <p>
                  Optional. Reorder pages inside the selected document before merging.
                  {hasCustomPages && " Custom page edits will be included in the merge."}
                </p>
              </div>
              <span className="workflow-status optional">Optional</span>
            </div>

            {selectedFile ? (
              <p className="file-hint">
                Editing pages in: <strong>{selectedFile.name}</strong>
              </p>
            ) : (
              <p className="file-hint muted">Select a document from step 1.</p>
            )}

            {loadingPages && <p className="file-hint muted">Loading pages…</p>}

            {!loadingPages && pageItems.length > 0 && (
              <>
                <DraggableOrderList items={pageItems} onChange={handlePageItemsChange} />
                <OrderActions
                  primaryIcon={<Download size={18} />}
                  primaryLabel="Download this PDF only"
                  onPrimary={handleDownloadReordered}
                  primaryLoading={loading === "download"}
                  primaryDisabled={loading === "merge"}
                  onReset={handleResetPages}
                  resetLabel="Reset page order"
                  resetDisabled={loading !== null}
                />
              </>
            )}
          </section>

          <section className="workflow-panel workflow-panel-merge">
            <div className="workflow-panel-header">
              <div>
                <h3>Step 3 · Merge</h3>
                <p>
                  Combines all documents using step 1 order and any page edits from step 2.
                </p>
              </div>
              <span className={`workflow-status ${orderFrozen ? "done" : "pending"}`}>
                {orderFrozen ? "Ready" : "Waiting"}
              </span>
            </div>

            <OrderActions
              primaryIcon={<Combine size={18} />}
              primaryLabel="Merge all PDFs"
              onPrimary={handleMerge}
              primaryLoading={loading === "merge"}
              primaryDisabled={!orderFrozen || loading === "download"}
            />
          </section>
        </>
      )}

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
          {message.type === "success" && onConvertMerged && (
            <button type="button" className="message-action" onClick={onConvertMerged}>
              Convert merged PDF →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
