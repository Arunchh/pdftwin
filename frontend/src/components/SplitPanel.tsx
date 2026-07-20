import { useEffect, useState } from "react";
import { Scissors } from "lucide-react";
import IconButton from "./IconButton";
import PdfSelectList from "./PdfSelectList";
import { downloadResponse, postFiles } from "../api";
import { fileKey, getPdfFiles } from "../utils/files";

interface SplitPanelProps {
  files: File[];
}

export default function SplitPanel({ files }: SplitPanelProps) {
  const [ranges, setRanges] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(
    null
  );

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
      setMessage({ type: "error", text: "Add at least one PDF file to split." });
      return;
    }

    if (!ranges.trim()) {
      setMessage({ type: "error", text: "Enter at least one page range." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await postFiles("/api/split", [targetFile], { ranges });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail ?? "Split failed.");
      }

      const contentType = response.headers.get("Content-Type") ?? "";
      const fallback = contentType.includes("zip") ? "split_pdfs.zip" : "split.pdf";
      await downloadResponse(response, fallback);

      setMessage({
        type: "success",
        text: "PDF split successfully. Your download should start automatically.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Split failed.",
      });
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

      <div className="workflow-rail">
        <div className={`workflow-step ${targetFile ? "active" : ""}`}>
          <span className="workflow-step-number">1</span>
          <span>Choose PDF</span>
        </div>
        <span className="workflow-connector" />
        <div className={`workflow-step ${rangesReady ? "active" : ""}`}>
          <span className="workflow-step-number">2</span>
          <span>Page ranges</span>
        </div>
        <span className="workflow-connector" />
        <div className={`workflow-step ${targetFile && rangesReady ? "active" : ""}`}>
          <span className="workflow-step-number">3</span>
          <Scissors size={16} />
          <span>Split</span>
        </div>
      </div>

      {pdfFiles.length === 0 ? (
        <p className="file-hint muted">Upload at least one PDF file above to get started.</p>
      ) : (
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
                <h3>Step 3 · Split &amp; download</h3>
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
      )}

      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
}
