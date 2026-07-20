import { useEffect, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import IconButton from "./IconButton";
import { downloadResponse, postFiles } from "../api";
import { IMAGE_OUTPUT_FORMATS, type ImageOutputFormat } from "../config/formats";
import { fileKey, getImageFiles } from "../utils/files";

interface ImageConvertPanelProps {
  files: File[];
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ImageConvertPanel({ files }: ImageConvertPanelProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<ImageOutputFormat>("webp");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const imageFiles = getImageFiles(files);
  const selectedFiles =
    selectedKey === "__all__"
      ? imageFiles
      : imageFiles.filter((file) => fileKey(file) === selectedKey);

  useEffect(() => {
    if (!imageFiles.length) {
      setSelectedKey(null);
      return;
    }
    if (!selectedKey || (selectedKey !== "__all__" && !imageFiles.some((f) => fileKey(f) === selectedKey))) {
      setSelectedKey(imageFiles.length > 1 ? "__all__" : fileKey(imageFiles[0]));
    }
  }, [imageFiles, selectedKey]);

  const handleConvert = async () => {
    if (!selectedFiles.length) {
      setMessage({ type: "error", text: "Upload at least one image file above." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await postFiles("/api/convert/image", selectedFiles, {
        output_format: outputFormat,
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail ?? "Conversion failed.");
      }

      const contentType = response.headers.get("Content-Type") ?? "";
      const fallback = contentType.includes("zip")
        ? "converted_images.zip"
        : `converted.${outputFormat === "jpeg" ? "jpg" : outputFormat}`;

      await downloadResponse(response, fallback);
      setMessage({
        type: "success",
        text: `Images converted to ${outputFormat.toUpperCase()}. Download started.`,
      });
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
      <h2>Image Conversion</h2>
      <p className="description">
        Standardize brand assets and marketing images — convert to WebP for the web, PNG for design,
        or JPEG for email and documents.
      </p>

      <div className="workflow-rail">
        <div className={`workflow-step ${selectedFiles.length ? "active" : ""}`}>
          <span className="workflow-step-number">1</span>
          <span>Select images</span>
        </div>
        <span className="workflow-connector" />
        <div className={`workflow-step ${outputFormat ? "active" : ""}`}>
          <span className="workflow-step-number">2</span>
          <span>Output format</span>
        </div>
        <span className="workflow-connector" />
        <div className={`workflow-step ${selectedFiles.length && outputFormat ? "active" : ""}`}>
          <span className="workflow-step-number">3</span>
          <Download size={16} />
          <span>Convert</span>
        </div>
      </div>

      {imageFiles.length === 0 ? (
        <p className="file-hint muted">Upload PNG, JPG, WebP, GIF, BMP, or TIFF files above to get started.</p>
      ) : (
        <>
          <section className="workflow-panel">
            <div className="workflow-panel-header">
              <div>
                <h3>Step 1 · Choose images</h3>
                <p>Convert one file or batch-convert everything you uploaded.</p>
              </div>
              <span className={`workflow-status ${selectedFiles.length ? "done" : "pending"}`}>
                {selectedFiles.length ? "Selected" : "Required"}
              </span>
            </div>

            <div className="pdf-select-list">
              {imageFiles.length > 1 && (
                <button
                  type="button"
                  className={`pdf-select-item ${selectedKey === "__all__" ? "active" : ""}`}
                  onClick={() => setSelectedKey("__all__")}
                >
                  <span className="order-list-label">All uploaded images ({imageFiles.length})</span>
                  <span className="order-list-meta">Batch convert to one ZIP if needed</span>
                </button>
              )}
              {imageFiles.map((file) => {
                const key = fileKey(file);
                return (
                  <button
                    key={key}
                    type="button"
                    className={`pdf-select-item ${selectedKey === key ? "active" : ""}`}
                    onClick={() => setSelectedKey(key)}
                  >
                    <span className="order-list-label">{file.name}</span>
                    <span className="order-list-meta">{formatSize(file.size)}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="workflow-panel">
            <div className="workflow-panel-header">
              <div>
                <h3>Step 2 · Choose output format</h3>
                <p>Pick the format your website, deck, or CRM needs.</p>
              </div>
              <span className="workflow-status done">Required</span>
            </div>

            <div className="format-output-grid">
              {IMAGE_OUTPUT_FORMATS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`format-output-card ${outputFormat === option.id ? "selected" : ""}`}
                  onClick={() => setOutputFormat(option.id)}
                >
                  <h4>{option.label}</h4>
                  <p>{option.description}</p>
                  <span className="format-output-ext">.{option.id === "jpeg" ? "jpg" : option.id}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="workflow-panel workflow-panel-export">
            <div className="workflow-panel-header">
              <div>
                <h3>Step 3 · Convert &amp; download</h3>
                <p>
                  {selectedFiles.length > 1
                    ? "Multiple files download as a ZIP archive."
                    : "Your converted image downloads instantly."}
                </p>
              </div>
              <span className="workflow-status done">Ready</span>
            </div>

            <div className="actions">
              <IconButton
                icon={<RefreshCw size={18} />}
                label={`Convert to ${outputFormat.toUpperCase()}`}
                loading={loading}
                disabled={!selectedFiles.length}
                onClick={handleConvert}
              />
            </div>
          </section>
        </>
      )}

      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
}
