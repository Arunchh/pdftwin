import { useEffect, useState } from "react";
import { FileMinus } from "lucide-react";
import IconButton from "./IconButton";
import PdfSelectList from "./PdfSelectList";
import ClientProcessedBadge from "./ClientProcessedBadge";
import ToolPanelFeedback from "./ToolPanelFeedback";
import { useToolResult } from "../hooks/useToolResult";
import { PdfClientError, removePdfPages } from "../services/pdfClient";
import { fileKey, getPdfFiles } from "../utils/files";

interface RemovePagesPanelProps {
  files: File[];
}

export default function RemovePagesPanel({ files }: RemovePagesPanelProps) {
  const [pages, setPages] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { result, error, setError, setResultFromBlob, clearResult, clearFeedback } = useToolResult();

  const pdfFiles = getPdfFiles(files);
  const targetFile =
    pdfFiles.find((file) => fileKey(file) === selectedKey) ?? pdfFiles[0] ?? null;
  const pagesReady = pages.trim().length > 0;

  useEffect(() => {
    if (!pdfFiles.length) {
      setSelectedKey(null);
      return;
    }
    if (!selectedKey || !pdfFiles.some((file) => fileKey(file) === selectedKey)) {
      setSelectedKey(fileKey(pdfFiles[0]));
    }
  }, [pdfFiles, selectedKey]);

  const handleRemove = async () => {
    if (!targetFile) {
      setError("Add at least one PDF file above.");
      return;
    }

    if (!pages.trim()) {
      setError("Enter at least one page number to remove.");
      return;
    }

    setLoading(true);
    clearFeedback();

    try {
      const blob = await removePdfPages(targetFile, pages);
      const baseName = targetFile.name.replace(/\.pdf$/i, "") || "document";
      setResultFromBlob(blob, `${baseName}_edited.pdf`, {
        title: "Pages removed",
        detail: `Removed pages: ${pages.trim()}`,
      });
    } catch (err) {
      setError(err instanceof PdfClientError || err instanceof Error ? err.message : "Remove failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel tool-panel">
      <h2>Remove PDF Pages</h2>
      <p className="description">
        Delete specific pages from a PDF and download the rest as a new file.
      </p>
      <ClientProcessedBadge />

      {pdfFiles.length === 0 ? (
        <p className="file-hint muted">Upload at least one PDF file above to get started.</p>
      ) : (
        <>
          <PdfSelectList
            files={pdfFiles}
            selectedKey={selectedKey}
            onSelect={setSelectedKey}
            label="PDF to edit"
          />

          <div className="field">
            <label htmlFor="remove-pages">Pages to remove</label>
            <input
              id="remove-pages"
              type="text"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              placeholder="e.g. 2, 5-7, 10"
            />
            <p className="help">Comma-separated page numbers and ranges to delete from the PDF.</p>
          </div>

          <div className="actions">
            <IconButton
              icon={<FileMinus size={18} />}
              label="Remove pages"
              loading={loading}
              disabled={!targetFile || !pagesReady}
              onClick={handleRemove}
            />
          </div>
        </>
      )}

      <ToolPanelFeedback
        toolId="remove-pages"
        error={error}
        result={result}
        onDismissResult={clearResult}
      />
    </div>
  );
}
