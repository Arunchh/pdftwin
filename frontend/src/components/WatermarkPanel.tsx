import { useEffect, useState } from "react";
import { Stamp } from "lucide-react";
import IconButton from "./IconButton";
import PdfSelectList from "./PdfSelectList";
import { downloadResponse, postFiles } from "../api";
import { fileKey, getPdfFiles } from "../utils/files";

interface WatermarkPanelProps {
  files: File[];
}

export default function WatermarkPanel({ files }: WatermarkPanelProps) {
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.25);
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

  const handleWatermark = async () => {
    if (!targetFile) {
      setMessage({ type: "error", text: "Add at least one PDF to watermark." });
      return;
    }
    if (!text.trim()) {
      setMessage({ type: "error", text: "Enter watermark text." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await postFiles("/api/watermark", [targetFile], {
        text: text.trim(),
        opacity: String(opacity),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail ?? "Watermark failed.");
      }

      await downloadResponse(response, "watermarked.pdf");
      setMessage({ type: "success", text: "Watermarked PDF downloaded." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Watermark failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel tool-panel">
      <h2>Watermark PDF</h2>
      <p className="description">
        Mark drafts, internal reviews, and confidential documents with a visible diagonal watermark.
      </p>

      {pdfFiles.length === 0 ? (
        <p className="file-hint muted">Upload a PDF above to add a watermark.</p>
      ) : (
        <>
          <PdfSelectList
            files={pdfFiles}
            selectedKey={selectedKey}
            onSelect={setSelectedKey}
            label="Choose PDF"
          />

          <div className="watermark-options">
            <label className="rotate-field">
              Watermark text
              <input
                type="text"
                value={text}
                maxLength={120}
                onChange={(event) => setText(event.target.value)}
                placeholder="CONFIDENTIAL"
              />
            </label>
            <label className="rotate-field">
              Opacity ({Math.round(opacity * 100)}%)
              <input
                type="range"
                min={10}
                max={60}
                value={Math.round(opacity * 100)}
                onChange={(event) => setOpacity(Number(event.target.value) / 100)}
              />
            </label>
          </div>

          <div className="actions">
            <IconButton
              icon={<Stamp size={18} />}
              label="Apply watermark"
              loading={loading}
              onClick={handleWatermark}
            />
          </div>
        </>
      )}

      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
}
