import { useEffect, useState } from "react";
import { FileOutput, Layers } from "lucide-react";
import IconButton from "./IconButton";
import PdfSelectList from "./PdfSelectList";
import { downloadResponse, postFiles } from "../api";
import { fileKey, getPdfFiles } from "../utils/files";

interface ExtractPagesPanelProps {
  files: File[];
}

export default function ExtractPagesPanel({ files }: ExtractPagesPanelProps) {
  const [pages, setPages] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(
    null
  );

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

  const handleExtract = async () => {
    if (!targetFile) {
      setMessage({ type: "error", text: "Add at least one PDF file to extract pages." });
      return;
    }

    if (!pages.trim()) {
      setMessage({ type: "error", text: "Enter at least one page to extract." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await postFiles("/api/extract-pages", [targetFile], { pages });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail ?? "Extract failed.");
      }

      await downloadResponse(response, "extracted.pdf");
      setMessage({ type: "success", text: "Pages extracted. Your download should start automatically." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Extract failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel tool-panel">
      <h2>Extract Pages</h2>
      <p className="description">
        Pull specific pages out of a PDF and save them as a new, smaller document.
      </p>

      <div className="workflow-rail">
        <div className={`workflow-step ${targetFile ? "active" : ""}`}>
          <span className="workflow-step-number">1</span>
          <span>Choose PDF</span>
        </div>
        <span className="workflow-connector" />
        <div className={`workflow-step ${pagesReady ? "active" : ""}`}>
          <span className="workflow-step-number">2</span>
          <Layers size={16} />
          <span>Pages</span>
        </div>
        <span className="workflow-connector" />
        <div className={`workflow-step ${targetFile && pagesReady ? "active" : ""}`}>
          <span className="workflow-step-number">3</span>
          <FileOutput size={16} />
          <span>Extract</span>
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
                <p>Select which uploaded PDF to extract pages from.</p>
              </div>
              <span className={`workflow-status ${targetFile ? "done" : "pending"}`}>
                {targetFile ? "Selected" : "Required"}
              </span>
            </div>

            <PdfSelectList
              files={pdfFiles}
              selectedKey={selectedKey}
              onSelect={setSelectedKey}
              label="PDF to extract from"
            />
          </section>

          <section className="workflow-panel">
            <div className="workflow-panel-header">
              <div>
                <h3>Step 2 · Enter pages</h3>
                <p>List individual pages or ranges. Example: 1, 3, 5-7</p>
              </div>
              <span className={`workflow-status ${pagesReady ? "done" : "pending"}`}>
                {pagesReady ? "Ready" : "Required"}
              </span>
            </div>

            <div className="field">
              <label htmlFor="extract-pages">Pages to extract</label>
              <input
                id="extract-pages"
                type="text"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="e.g. 1, 3, 5-7"
              />
              <p className="help">Selected pages are combined into one new PDF file.</p>
            </div>
          </section>

          <section className="workflow-panel workflow-panel-export">
            <div className="workflow-panel-header">
              <div>
                <h3>Step 3 · Extract &amp; download</h3>
                <p>Review your choices, then create the new PDF.</p>
              </div>
              <span className={`workflow-status ${targetFile && pagesReady ? "done" : "pending"}`}>
                {targetFile && pagesReady ? "Ready" : "Waiting"}
              </span>
            </div>

            <div className="actions">
              <IconButton
                icon={<FileOutput size={18} />}
                label="Extract pages"
                loading={loading}
                disabled={!targetFile || !pagesReady}
                onClick={handleExtract}
              />
            </div>
          </section>
        </>
      )}

      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
}
