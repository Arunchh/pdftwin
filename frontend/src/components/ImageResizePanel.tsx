import { useEffect, useState } from "react";
import { Maximize2 } from "lucide-react";
import IconButton from "./IconButton";
import { downloadResponse, postFiles } from "../api";
import { fileKey, getImageFiles } from "../utils/files";

interface ImageResizePanelProps {
  files: File[];
}

const PRESETS = [
  { id: "email", label: "Email (1280px)", width: 1280, height: 1280 },
  { id: "web", label: "Web (1920px)", width: 1920, height: 1920 },
  { id: "thumb", label: "Thumbnail (640px)", width: 640, height: 640 },
] as const;

export default function ImageResizePanel({ files }: ImageResizePanelProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxHeight, setMaxHeight] = useState(1920);
  const [quality, setQuality] = useState(85);
  const [outputFormat, setOutputFormat] = useState<"" | "jpeg" | "png" | "webp">("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const imageFiles = getImageFiles(files);
  const targetFile =
    imageFiles.find((file) => fileKey(file) === selectedKey) ?? imageFiles[0] ?? null;

  useEffect(() => {
    if (!imageFiles.length) {
      setSelectedKey(null);
      return;
    }
    if (!selectedKey || !imageFiles.some((file) => fileKey(file) === selectedKey)) {
      setSelectedKey(fileKey(imageFiles[0]));
    }
  }, [imageFiles, selectedKey]);

  const handleResize = async () => {
    if (!targetFile) {
      setMessage({ type: "error", text: "Upload at least one image to resize." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const fields: Record<string, string> = {
        max_width: String(maxWidth),
        max_height: String(maxHeight),
        quality: String(quality),
      };
      if (outputFormat) {
        fields.output_format = outputFormat;
      }

      const response = await postFiles("/api/convert/image-resize", [targetFile], fields);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail ?? "Resize failed.");
      }

      await downloadResponse(response, "resized-image.jpg");
      setMessage({ type: "success", text: "Resized image downloaded." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Resize failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel tool-panel">
      <h2>Resize Images</h2>
      <p className="description">
        Shrink large photos and brand assets for email, websites, and presentations while keeping quality
        under control.
      </p>

      {imageFiles.length === 0 ? (
        <p className="file-hint muted">Upload an image above to resize or compress it.</p>
      ) : (
        <>
          <div className="pdf-select-list">
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
                </button>
              );
            })}
          </div>

          <div className="resize-options">
            <p className="order-section-title">Size preset</p>
            <div className="image-export-chips">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`image-export-chip ${
                    maxWidth === preset.width && maxHeight === preset.height ? "active" : ""
                  }`}
                  onClick={() => {
                    setMaxWidth(preset.width);
                    setMaxHeight(preset.height);
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="resize-dimensions">
              <label className="rotate-field">
                Max width (px)
                <input
                  type="number"
                  min={64}
                  max={8000}
                  value={maxWidth}
                  onChange={(event) => setMaxWidth(Number(event.target.value))}
                />
              </label>
              <label className="rotate-field">
                Max height (px)
                <input
                  type="number"
                  min={64}
                  max={8000}
                  value={maxHeight}
                  onChange={(event) => setMaxHeight(Number(event.target.value))}
                />
              </label>
            </div>

            <label className="rotate-field">
              JPEG/WebP quality ({quality})
              <input
                type="range"
                min={40}
                max={100}
                value={quality}
                onChange={(event) => setQuality(Number(event.target.value))}
              />
            </label>

            <label className="rotate-field">
              Output format
              <select
                value={outputFormat}
                onChange={(event) =>
                  setOutputFormat(event.target.value as "" | "jpeg" | "png" | "webp")
                }
              >
                <option value="">Keep original</option>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
              </select>
            </label>
          </div>

          <div className="actions">
            <IconButton
              icon={<Maximize2 size={18} />}
              label="Resize image"
              loading={loading}
              onClick={handleResize}
            />
          </div>
        </>
      )}

      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
}
