import { useEffect, useState } from "react";
import { ImageDown } from "lucide-react";
import IconButton from "./IconButton";
import PdfSelectList from "./PdfSelectList";
import ClientProcessedBadge from "./ClientProcessedBadge";
import { downloadBlob } from "../api";
import { PdfClientError } from "../services/pdfClient";
import { pdfToImagesDownload } from "../services/pdfJsClient";
import { fileKey, getPdfFiles } from "../utils/files";

interface PdfToJpgPanelProps {
  files: File[];
}

export default function PdfToJpgPanel({ files }: PdfToJpgPanelProps) {
  const [format, setFormat] = useState<"jpeg" | "png">("jpeg");
  const [quality, setQuality] = useState(0.92);
  const [pages, setPages] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

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

  const handleExport = async () => {
    if (!targetFile) {
      setMessage({ type: "error", text: "Add at least one PDF file above." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { blob, filename } = await pdfToImagesDownload(targetFile, format, quality, pages);
      downloadBlob(blob, filename);
      setMessage({
        type: "success",
        text: "Images exported successfully. Your download should start automatically.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof PdfClientError || err instanceof Error ? err.message : "Export failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel tool-panel">
      <h2>PDF to JPG / PNG</h2>
      <p className="description">
        Export PDF pages as image files. Leave pages blank to export every page. Multiple pages download as a ZIP.
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
            label="PDF to export"
          />

          <div className="field-row">
            <div className="field">
              <label htmlFor="image-format">Output format</label>
              <select
                id="image-format"
                value={format}
                onChange={(e) => setFormat(e.target.value as "jpeg" | "png")}
              >
                <option value="jpeg">JPEG (.jpg)</option>
                <option value="png">PNG (.png)</option>
              </select>
            </div>

            {format === "jpeg" && (
              <div className="field">
                <label htmlFor="jpeg-quality">JPEG quality</label>
                <input
                  id="jpeg-quality"
                  type="range"
                  min={0.5}
                  max={1}
                  step={0.01}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                />
                <p className="help">{Math.round(quality * 100)}%</p>
              </div>
            )}
          </div>

          <div className="field">
            <label htmlFor="export-pages">Pages (optional)</label>
            <input
              id="export-pages"
              type="text"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              placeholder="All pages, or e.g. 1-3, 5, 8-10"
            />
          </div>

          <div className="actions">
            <IconButton
              icon={<ImageDown size={18} />}
              label="Export images"
              loading={loading}
              disabled={!targetFile}
              onClick={handleExport}
            />
          </div>
        </>
      )}

      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
}
