import { useEffect, useState } from "react";
import { RotateCw } from "lucide-react";
import IconButton from "./IconButton";
import PdfSelectList from "./PdfSelectList";
import ClientProcessedBadge from "./ClientProcessedBadge";
import { downloadBlob } from "../api";
import { PdfClientError, rotatePdf } from "../services/pdfClient";
import { fileKey, getPdfFiles } from "../utils/files";

interface RotatePanelProps {
  files: File[];
}

const ANGLES = [90, 180, 270] as const;

export default function RotatePanel({ files }: RotatePanelProps) {
  const [pages, setPages] = useState("all");
  const [angle, setAngle] = useState<(typeof ANGLES)[number]>(90);
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

  const handleRotate = async () => {
    if (!targetFile) {
      setMessage({ type: "error", text: "Add at least one PDF to rotate." });
      return;
    }

    if (!pages.trim()) {
      setMessage({ type: "error", text: "Enter page numbers or use all." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const rotatedBlob = await rotatePdf(targetFile, pages.trim(), angle);
      downloadBlob(rotatedBlob, "rotated.pdf");
      setMessage({ type: "success", text: "PDF rotated. Download started." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof PdfClientError || err instanceof Error ? err.message : "Rotation failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel tool-panel">
      <h2>Rotate Pages</h2>
      <p className="description">
        Fix scanned pages or deck slides — rotate all pages or just the ones you specify.
      </p>
      <ClientProcessedBadge />

      {pdfFiles.length === 0 ? (
        <p className="file-hint muted">Upload a PDF above to rotate pages.</p>
      ) : (
        <>
          <PdfSelectList
            files={pdfFiles}
            selectedKey={selectedKey}
            onSelect={setSelectedKey}
            label="Choose PDF"
          />

          <label className="rotate-field">
            <span className="order-section-title">Pages to rotate</span>
            <input
              type="text"
              value={pages}
              placeholder="all, 1, 3-5, 2, 7"
              onChange={(event) => setPages(event.target.value)}
            />
            <span className="file-hint muted">Use <strong>all</strong> or comma-separated pages/ranges.</span>
          </label>

          <div className="compress-options">
            <p className="order-section-title">Rotation</p>
            <div className="image-export-chips">
              {ANGLES.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`image-export-chip ${angle === value ? "active" : ""}`}
                  onClick={() => setAngle(value)}
                >
                  {value}°
                </button>
              ))}
            </div>
          </div>

          <div className="actions">
            <IconButton
              icon={<RotateCw size={18} />}
              label={`Rotate ${angle}°`}
              loading={loading}
              onClick={handleRotate}
            />
          </div>
        </>
      )}

      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
}
