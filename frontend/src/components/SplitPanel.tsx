import { useEffect, useState } from "react";
import { Scissors } from "lucide-react";
import IconButton from "./IconButton";
import PdfSelectList from "./PdfSelectList";
import ClientProcessedBadge from "./ClientProcessedBadge";
import ToolPanelFeedback from "./ToolPanelFeedback";
import ToolWorkflowShell from "./ToolWorkflowShell";
import { useToolResult } from "../hooks/useToolResult";
import { PdfClientError, splitPdfDownload } from "../services/pdfClient";
import { fileKey, getPdfFiles } from "../utils/files";

interface SplitPanelProps {
  files: File[];
}

export default function SplitPanel({ files }: SplitPanelProps) {
  const [ranges, setRanges] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { result, error, setError, setResultFromBlob, clearResult, clearFeedback } = useToolResult();

  const pdfFiles = getPdfFiles(files);
  const targetFile =
    pdfFiles.find((file) => fileKey(file) === selectedKey) ?? pdfFiles[0] ?? null;
  const rangesReady = ranges.trim().length > 0;

  useEffect(() => {
    if (!pdfFiles.length) {
      setSelectedKey(null);
      return;
    }
    if (!selectedKey || !pdfFiles.some((file) => fileKey(file) === selectedKey)) {
      setSelectedKey(fileKey(pdfFiles[0]));
    }
  }, [pdfFiles, selectedKey]);

  const handleSplit = async () => {
    if (!targetFile) {
      setError("Add at least one PDF file to split.");
      return;
    }

    if (!ranges.trim()) {
      setError("Enter at least one page range.");
      return;
    }

    setLoading(true);
    clearFeedback();

    try {
      const { blob, filename } = await splitPdfDownload(targetFile, ranges);
      setResultFromBlob(blob, filename, {
        title: "PDF split",
        detail: `Ranges: ${ranges.trim()}`,
      });
    } catch (err) {
      setError(err instanceof PdfClientError || err instanceof Error ? err.message : "Split failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel tool-panel">
      <h2>Split PDF</h2>
      <p className="description">
        Break one PDF into separate files by page range. Multiple ranges download as a ZIP.
      </p>
      <ClientProcessedBadge />

      <ToolWorkflowShell
        showContent={pdfFiles.length > 0}
        emptyState={
          <p className="file-hint muted">Upload at least one PDF file to get started.</p>
        }
        steps={[
          { label: "Choose PDF", active: Boolean(targetFile) },
          { label: "Page ranges", active: rangesReady },
          { label: "Split", icon: <Scissors size={16} />, active: Boolean(targetFile && rangesReady) },
        ]}
      >
        <>
          <section className="workflow-panel">
            <div className="workflow-panel-header">
              <div>
                <h3>Step 1 · Choose PDF</h3>
                <p>Select which uploaded PDF you want to split.</p>
              </div>
              <span className={`workflow-status ${targetFile ? "done" : "pending"}`}>
                {targetFile ? "Selected" : "Required"}
              </span>
            </div>

            <PdfSelectList
              files={pdfFiles}
              selectedKey={selectedKey}
              onSelect={setSelectedKey}
              label="PDF to split"
            />
          </section>

          <section className="workflow-panel">
            <div className="workflow-panel-header">
              <div>
                <h3>Step 2 · Enter page ranges</h3>
                <p>Comma-separated ranges. Example: 1-3, 5-7, 10</p>
              </div>
              <span className={`workflow-status ${rangesReady ? "done" : "pending"}`}>
                {rangesReady ? "Ready" : "Required"}
              </span>
            </div>

            <div className="field">
              <label htmlFor="ranges">Page ranges</label>
              <input
                id="ranges"
                type="text"
                value={ranges}
                onChange={(e) => setRanges(e.target.value)}
                placeholder="e.g. 1-3, 5-7, 10"
              />
              <p className="help">
                Each range becomes its own PDF. Multiple ranges are bundled in a ZIP file.
              </p>
            </div>
          </section>

          <section className="workflow-panel workflow-panel-export">
            <div className="workflow-panel-header">
              <div>
                <h3>Step 3 · Split</h3>
                <p>Review your choices, then split the PDF.</p>
              </div>
              <span className={`workflow-status ${targetFile && rangesReady ? "done" : "pending"}`}>
                {targetFile && rangesReady ? "Ready" : "Waiting"}
              </span>
            </div>

            <div className="actions">
              <IconButton
                icon={<Scissors size={18} />}
                label="Split PDF"
                loading={loading}
                disabled={!targetFile || !rangesReady}
                onClick={handleSplit}
              />
            </div>
          </section>
        </>
      </ToolWorkflowShell>

      <ToolPanelFeedback
        toolId="split"
        error={error}
        result={result}
        onDismissResult={clearResult}
      />
    </div>
  );
}
