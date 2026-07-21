import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import IconButton from "./IconButton";
import { downloadResponse, postFiles } from "../api";
import { fileKey, getDocxFiles } from "../utils/files";

interface WordToPdfPanelProps {
  files: File[];
}

export default function WordToPdfPanel({ files }: WordToPdfPanelProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const docxFiles = getDocxFiles(files);
  const targetFile =
    docxFiles.find((file) => fileKey(file) === selectedKey) ?? docxFiles[0] ?? null;

  useEffect(() => {
    if (!docxFiles.length) {
      setSelectedKey(null);
      return;
    }
    if (!selectedKey || !docxFiles.some((file) => fileKey(file) === selectedKey)) {
      setSelectedKey(fileKey(docxFiles[0]));
    }
  }, [docxFiles, selectedKey]);

  const handleConvert = async () => {
    if (!targetFile) {
      setMessage({ type: "error", text: "Add at least one DOCX file to convert." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await postFiles("/api/convert/word-to-pdf", [targetFile]);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail ?? "Conversion failed.");
      }

      await downloadResponse(response, "document.pdf");
      setMessage({ type: "success", text: "Word document converted to PDF." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Conversion failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel tool-panel">
      <h2>Word to PDF</h2>
      <p className="description">
        Turn editable DOCX proposals, statements of work, and contracts into PDFs for client delivery.
      </p>

      {docxFiles.length === 0 ? (
        <p className="file-hint muted">Upload a .docx file above to convert it to PDF.</p>
      ) : (
        <>
          <div className="pdf-select-list">
            {docxFiles.map((file) => {
              const key = fileKey(file);
              return (
                <button
                  key={key}
                  type="button"
                  className={`pdf-select-item ${selectedKey === key ? "active" : ""}`}
                  onClick={() => setSelectedKey(key)}
                >
                  <span className="order-list-label">{file.name}</span>
                </button>
              );
            })}
          </div>

          <div className="actions">
            <IconButton
              icon={<FileText size={18} />}
              label="Convert to PDF"
              loading={loading}
              onClick={handleConvert}
            />
          </div>
        </>
      )}

      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
}
