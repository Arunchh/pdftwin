import { useEffect, useState } from "react";
import { AlignLeft } from "lucide-react";
import IconButton from "./IconButton";
import PdfSelectList from "./PdfSelectList";
import ClientProcessedBadge from "./ClientProcessedBadge";
import { downloadBlob } from "../api";
import { PdfClientError } from "../services/pdfClient";
import { pdfToText } from "../services/pdfJsClient";
import { fileKey, getPdfFiles } from "../utils/files";

interface PdfToTextPanelProps {
  files: File[];
}

export default function PdfToTextPanel({ files }: PdfToTextPanelProps) {
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

  const handleExtract = async () => {
    if (!targetFile) {
      setMessage({ type: "error", text: "Add at least one PDF file above." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const text = await pdfToText(targetFile);
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const baseName = targetFile.name.replace(/\.pdf$/i, "") || "document";
      downloadBlob(blob, `${baseName}.txt`);
      setMessage({
        type: "success",
        text: "Text extracted successfully. Your download should start automatically.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof PdfClientError || err instanceof Error ? err.message : "Extraction failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel tool-panel">
      <h2>PDF to Text</h2>
      <p className="description">
        Extract selectable text from PDFs into a plain .txt file. For scanned documents, use the OCR tool instead.
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
            label="PDF to extract"
          />

          <div className="actions">
            <IconButton
              icon={<AlignLeft size={18} />}
              label="Download text file"
              loading={loading}
              disabled={!targetFile}
              onClick={handleExtract}
            />
          </div>
        </>
      )}

      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
}
