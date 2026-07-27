import { useEffect, useMemo, useState } from "react";
import { BookImage } from "lucide-react";
import IconButton from "./IconButton";
import ClientProcessedBadge from "./ClientProcessedBadge";
import DraggableOrderList, { type OrderListItem } from "./DraggableOrderList";
import ToolPanelFeedback from "./ToolPanelFeedback";
import { useToolResult } from "../hooks/useToolResult";
import { imagesToPdf, PdfClientError } from "../services/pdfClient";
import { fileKey, getImageFiles, reconcileImageOrder } from "../utils/files";

interface ImagesToPdfPanelProps {
  files: File[];
}

export default function ImagesToPdfPanel({ files }: ImagesToPdfPanelProps) {
  const imageFiles = getImageFiles(files);
  const [order, setOrder] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { result, error, setError, setResultFromBlob, clearResult, clearFeedback } = useToolResult();

  useEffect(() => {
    setOrder((current) => reconcileImageOrder(current, files));
  }, [files]);

  const listItems = useMemo<OrderListItem[]>(
    () =>
      order.map((file) => ({
        id: fileKey(file),
        label: file.name,
        meta: `${(file.size / 1024).toFixed(1)} KB`,
      })),
    [order]
  );

  const syncOrder = (items: OrderListItem[]) => {
    const byKey = new Map(order.map((file) => [fileKey(file), file]));
    setOrder(items.map((item) => byKey.get(item.id)).filter((file): file is File => Boolean(file)));
  };

  const handleCreate = async () => {
    if (order.length < 1) {
      setError("Add at least one image file above.");
      return;
    }

    setLoading(true);
    clearFeedback();

    try {
      const blob = await imagesToPdf(order);
      setResultFromBlob(blob, "images.pdf", {
        title: "PDF created",
        detail: `${order.length} image(s) combined`,
      });
    } catch (err) {
      setError(
        err instanceof PdfClientError || err instanceof Error ? err.message : "Conversion failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel tool-panel">
      <h2>Images to PDF</h2>
      <p className="description">
        Combine JPG, PNG, and other images into one PDF. Each image becomes its own page.
      </p>
      <ClientProcessedBadge />

      {imageFiles.length === 0 ? (
        <p className="file-hint muted">Upload at least one image file above to get started.</p>
      ) : (
        <>
          <section className="workflow-panel">
            <div className="workflow-panel-header">
              <div>
                <h3>Page order</h3>
                <p>Drag images to set the page order in your PDF.</p>
              </div>
              <span className="workflow-status done">{order.length} image(s)</span>
            </div>
            <DraggableOrderList items={listItems} onChange={syncOrder} />
          </section>

          <div className="actions">
            <IconButton
              icon={<BookImage size={18} />}
              label="Create PDF"
              loading={loading}
              disabled={order.length < 1}
              onClick={handleCreate}
            />
          </div>
        </>
      )}

      <ToolPanelFeedback
        toolId="images-to-pdf"
        error={error}
        result={result}
        onDismissResult={clearResult}
      />
    </div>
  );
}
