import { useEffect, useState } from "react";
import { Shrink } from "lucide-react";
import IconButton from "./IconButton";
import PdfSelectList from "./PdfSelectList";
import ToolPanelFeedback from "./ToolPanelFeedback";
import { postFiles } from "../api";
import { useToolResult } from "../hooks/useToolResult";
import { fileKey, getPdfFiles } from "../utils/files";

interface CompressPanelProps {
  files: File[];
}

export default function CompressPanel({ files }: CompressPanelProps) {
  const [level, setLevel] = useState<"medium" | "high">("medium");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { result, error, setError, setResultFromResponse, clearResult, clearFeedback } =
    useToolResult();

  const pdfFiles = getPdfFiles(files);
  const targetFile =
    pdfFiles.find((file) => fileKey(file) === selectedKey) ?? pdfFiles[0] ?? null;

  useEffect(() => {
    if (!pdfFiles.length) {
      setSelectedKey(null);
      return;
    }
    if (!selectedKey || !pdfFiles.some((file) => fileKey(file) === selectedKey)) {
      setSelectedKey(fileKey(pdfFiles[0]));
    }
  }, [pdfFiles, selectedKey]);

  const handleCompress = async () => {
    if (!targetFile) {
      setError("Add at least one PDF to compress.");
      return;
    }

    setLoading(true);
    clearFeedback();

    try {
      const response = await postFiles("/api/compress", [targetFile], { level });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail ?? "Compression failed.");
      }

      const saved = response.headers.get("X-Compression-Saved-Percent");
      await setResultFromResponse(response, "compressed.pdf", {
        title: "PDF compressed",
        detail: saved ? `About ${saved}% smaller than the original` : undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Compression failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel tool-panel">
      <h2>Compress PDF</h2>
      <p className="description">
        Shrink large reports and proposals for email, portals, and client downloads.
      </p>

      {pdfFiles.length === 0 ? (
        <p className="file-hint muted">Upload a PDF to compress it.</p>
      ) : (
        <>
          <PdfSelectList
            files={pdfFiles}
            selectedKey={selectedKey}
            onSelect={setSelectedKey}
            label="Choose PDF"
          />

          <div className="compress-options">
            <p className="order-section-title">Compression level</p>
            <div className="image-export-chips">
              {(
                [
                  ["medium", "Balanced"],
                  ["high", "Smaller file"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={`image-export-chip ${level === id ? "active" : ""}`}
                  onClick={() => setLevel(id)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="actions">
            <IconButton
              icon={<Shrink size={18} />}
              label="Compress PDF"
              loading={loading}
              onClick={handleCompress}
            />
          </div>
        </>
      )}

      <ToolPanelFeedback
        toolId="compress-pdf"
        error={error}
        result={result}
        onDismissResult={clearResult}
      />
    </div>
  );
}
