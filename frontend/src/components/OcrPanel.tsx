import { useState } from "react";
import { ScanText } from "lucide-react";
import IconButton from "./IconButton";
import ClientProcessedBadge from "./ClientProcessedBadge";
import { downloadBlob } from "../api";
import { OCR_LANGUAGES, ocrFiles, type OcrLanguage } from "../services/ocrClient";
import { PdfClientError } from "../services/pdfClient";
import { getImageFiles, getPdfFiles } from "../utils/files";

interface OcrPanelProps {
  files: File[];
}

export default function OcrPanel({ files }: OcrPanelProps) {
  const [language, setLanguage] = useState<OcrLanguage>("eng");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const pdfCount = getPdfFiles(files).length;
  const imageCount = getImageFiles(files).length;
  const hasInput = pdfCount + imageCount > 0;

  const handleOcr = async () => {
    if (!hasInput) {
      setMessage({ type: "error", text: "Add at least one PDF or image file above." });
      return;
    }

    setLoading(true);
    setMessage(null);
    setProgress(0);
    setProgressLabel("Preparing OCR…");

    try {
      const text = await ocrFiles(files, language, (value, label) => {
        setProgress(Math.round(value * 100));
        setProgressLabel(`Processing ${label}`);
      });
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      downloadBlob(blob, "ocr-text.txt");
      setMessage({
        type: "success",
        text: "OCR complete. Your text file download should start automatically.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof PdfClientError || err instanceof Error ? err.message : "OCR failed.",
      });
    } finally {
      setLoading(false);
      setProgressLabel("");
    }
  };

  return (
    <div className="panel tool-panel">
      <h2>OCR Text Extract</h2>
      <p className="description">
        Extract text from scanned PDFs and photos. Processing runs in your browser and may take a
        minute on large documents.
      </p>
      <ClientProcessedBadge />

      {!hasInput ? (
        <p className="file-hint muted">Upload a scanned PDF or image file above to get started.</p>
      ) : (
        <>
          <p className="help">
            Ready to scan {pdfCount} PDF(s) and {imageCount} image(s).
          </p>

          <div className="field">
            <label htmlFor="ocr-language">Document language</label>
            <select
              id="ocr-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as OcrLanguage)}
              disabled={loading}
            >
              {OCR_LANGUAGES.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {loading && (
            <div className="field">
              <label>OCR progress</label>
              <progress max={100} value={progress} />
              <p className="help">{progressLabel || `${progress}%`}</p>
            </div>
          )}

          <div className="actions">
            <IconButton
              icon={<ScanText size={18} />}
              label="Run OCR"
              loading={loading}
              disabled={!hasInput}
              onClick={handleOcr}
            />
          </div>
        </>
      )}

      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
}
