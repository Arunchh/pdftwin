import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import {
  ExcelIcon,
  ImagesIcon,
  PdfIcon,
  WordIcon,
  ZipIcon,
} from "./FileTypeIcons";
import IconButton from "./IconButton";
import ConvertLimitGate from "./ConvertLimitGate";
import { downloadResponse, postFiles } from "../api";
import { FREE_DAILY_DOC_CONVERT_LIMIT } from "../config/limits";
import { useAuth } from "../hooks/useAuth";
import { entitlementsForUser } from "../services/entitlements";
import {
  docConvertLimitReached,
  recordDocConvert,
  remainingDocConverts,
  syncDocConvertRemaining,
} from "../services/dailyUsage";
import { fileKey, getPdfFiles } from "../utils/files";

type OutputFormat = "word" | "excel" | "images";

type ImageExportFormat = "original" | "webp" | "png" | "jpeg";

interface ConvertExtractPanelProps {
  files: File[];
}

const OUTPUT_OPTIONS: {
  id: OutputFormat;
  title: string;
  description: string;
  extension: string;
  icon: typeof WordIcon;
}[] = [
  {
    id: "word",
    title: "Word Document",
    description: "Editable .docx with layout preserved",
    extension: ".docx",
    icon: WordIcon,
  },
  {
    id: "excel",
    title: "Excel Spreadsheet",
    description: "Structured rows and columns — tables and product images preserved",
    extension: ".xlsx",
    icon: ExcelIcon,
  },
  {
    id: "images",
    title: "Embedded Images",
    description: "Extract assets as PNG, JPG, WebP, or ZIP for web and marketing",
    extension: ".webp / .png / .jpg / .zip",
    icon: ImagesIcon,
  },
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ConvertExtractPanel({ files }: ConvertExtractPanelProps) {
  const { user } = useAuth();
  const entitlements = entitlementsForUser(user);
  const [selectedPdfKey, setSelectedPdfKey] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat | null>(null);
  const [imageExportFormat, setImageExportFormat] = useState<ImageExportFormat>("webp");
  const [loading, setLoading] = useState(false);
  const [showLimitGate, setShowLimitGate] = useState(false);
  const [remainingConverts, setRemainingConverts] = useState<number | null>(
    remainingDocConverts(entitlements.isPro)
  );
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const pdfFiles = getPdfFiles(files);
  const selectedFile =
    pdfFiles.find((file) => fileKey(file) === selectedPdfKey) ?? pdfFiles[0] ?? null;

  const selectedOption = OUTPUT_OPTIONS.find((option) => option.id === outputFormat) ?? null;

  useEffect(() => {
    if (!pdfFiles.length) {
      setSelectedPdfKey(null);
      return;
    }

    if (!selectedPdfKey || !pdfFiles.some((file) => fileKey(file) === selectedPdfKey)) {
      setSelectedPdfKey(fileKey(pdfFiles[0]));
    }
  }, [pdfFiles, selectedPdfKey]);

  useEffect(() => {
    setRemainingConverts(remainingDocConverts(entitlements.isPro));
  }, [entitlements.isPro]);

  const isDocConvert = outputFormat === "word" || outputFormat === "excel";

  const handleExport = async () => {
    if (!selectedFile) {
      setMessage({ type: "error", text: "Upload at least one PDF file above." });
      return;
    }

    if (!outputFormat) {
      setMessage({ type: "error", text: "Choose an output format in step 2." });
      return;
    }

    if (isDocConvert && docConvertLimitReached(entitlements.isPro)) {
      setShowLimitGate(true);
      return;
    }

    setLoading(true);
    setMessage(null);
    setShowLimitGate(false);

    const endpoints: Record<OutputFormat, string> = {
      word: "/api/convert/pdf-to-word",
      excel: "/api/convert/pdf-to-excel",
      images: "/api/extract-images",
    };

    const fallbacks: Record<OutputFormat, string> = {
      word: "converted.docx",
      excel: "converted.xlsx",
      images: "images.zip",
    };

    try {
      const extra =
        outputFormat === "images" && imageExportFormat !== "original"
          ? { output_format: imageExportFormat }
          : undefined;

      const response = await postFiles(endpoints[outputFormat], [selectedFile], extra);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        if (response.status === 429 && isDocConvert) {
          setShowLimitGate(true);
        }
        throw new Error(data.detail ?? "Export failed.");
      }

      if (isDocConvert) {
        recordDocConvert(entitlements.isPro);
        const remainingHeader = response.headers.get("X-Daily-Convert-Remaining");
        if (remainingHeader !== null) {
          const remaining = Number(remainingHeader);
          if (!Number.isNaN(remaining)) {
            syncDocConvertRemaining(remaining);
            setRemainingConverts(remaining);
          }
        } else if (!entitlements.isPro) {
          setRemainingConverts(remainingDocConverts(false));
        }
      }

      let fallback = fallbacks[outputFormat];
      if (outputFormat === "images") {
        const contentType = response.headers.get("Content-Type") ?? "";
        fallback = contentType.includes("zip") ? "images.zip" : "image.png";
      }

      await downloadResponse(response, fallback);

      const labels: Record<OutputFormat, string> = {
        word: "Word document",
        excel: "Excel spreadsheet",
        images: "Images archive",
      };

      setMessage({
        type: "success",
        text: `${labels[outputFormat]} ready. Download started.`,
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Export failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel tool-panel">
      <h2>Document Conversion</h2>
      <p className="description">
        Turn business PDFs into editable Word or Excel files, or export embedded images as WebP,
        PNG, or JPEG for your website and campaigns.
      </p>

      <div className="workflow-rail">
        <div className={`workflow-step ${selectedFile ? "active" : ""}`}>
          <span className="workflow-step-number">1</span>
          <PdfIcon size={18} />
          <span>Source PDF</span>
        </div>
        <span className="workflow-connector" />
        <div className={`workflow-step ${outputFormat ? "active" : ""}`}>
          <span className="workflow-step-number">2</span>
          <span>Output</span>
        </div>
        <span className="workflow-connector" />
        <div className={`workflow-step ${selectedFile && outputFormat ? "active" : ""}`}>
          <span className="workflow-step-number">3</span>
          <Download size={16} />
          <span>Export</span>
        </div>
      </div>

      {pdfFiles.length === 0 ? (
        <p className="file-hint muted">Upload at least one PDF file above to get started.</p>
      ) : (
        <>
          <section className="workflow-panel">
            <div className="workflow-panel-header">
              <div>
                <h3>Step 1 · Choose source PDF</h3>
                <p>Select which uploaded PDF you want to convert or extract from.</p>
              </div>
              <span className={`workflow-status ${selectedFile ? "done" : "pending"}`}>
                {selectedFile ? "Selected" : "Required"}
              </span>
            </div>

            <div className="pdf-select-list">
              {pdfFiles.map((file) => {
                const key = fileKey(file);
                const isActive = selectedPdfKey === key;

                return (
                  <button
                    key={key}
                    type="button"
                    className={`pdf-select-item ${isActive ? "active" : ""}`}
                    onClick={() => setSelectedPdfKey(key)}
                  >
                    <span className="pdf-select-item-row">
                      <PdfIcon size={28} />
                      <span>
                        <span className="order-list-label">{file.name}</span>
                        <span className="order-list-meta">{formatSize(file.size)}</span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="workflow-panel">
            <div className="workflow-panel-header">
              <div>
                <h3>Step 2 · Choose output format</h3>
                <p>Pick how you want to use the content from your PDF.</p>
              </div>
              <span className={`workflow-status ${outputFormat ? "done" : "pending"}`}>
                {outputFormat ? "Selected" : "Required"}
              </span>
            </div>

            <div className="format-output-grid">
              {OUTPUT_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = outputFormat === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`format-output-card ${isSelected ? "selected" : ""}`}
                    onClick={() => setOutputFormat(option.id)}
                  >
                    <div className="format-output-flow">
                      <PdfIcon size={34} />
                      <span className="format-output-arrow">→</span>
                      <Icon size={34} />
                    </div>
                    <h4>{option.title}</h4>
                    <p>{option.description}</p>
                    <span className="format-output-ext">{option.extension}</span>
                  </button>
                );
              })}
            </div>

            {isDocConvert && !entitlements.isPro && remainingConverts !== null && (
              <p className="file-hint muted">
                Free plan: {remainingConverts} of {FREE_DAILY_DOC_CONVERT_LIMIT} PDF → Word/Excel
                exports remaining today. Pro includes unlimited exports.
              </p>
            )}

            {outputFormat === "images" && (
              <div className="image-export-options">
                <p className="order-section-title">Image export format</p>
                <div className="image-export-chips">
                  {(
                    [
                      ["original", "Keep original"],
                      ["webp", "WebP"],
                      ["png", "PNG"],
                      ["jpeg", "JPEG"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      className={`image-export-chip ${imageExportFormat === id ? "active" : ""}`}
                      onClick={() => setImageExportFormat(id)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="workflow-panel workflow-panel-export">
            <div className="workflow-panel-header">
              <div>
                <h3>Step 3 · Export</h3>
                <p>Review your choices, then download the converted file.</p>
              </div>
              <span
                className={`workflow-status ${
                  selectedFile && outputFormat ? "done" : "pending"
                }`}
              >
                {selectedFile && outputFormat ? "Ready" : "Waiting"}
              </span>
            </div>

            {selectedFile && selectedOption ? (
              <div className="export-summary">
                <div className="export-summary-item">
                  <PdfIcon size={24} />
                  <span>{selectedFile.name}</span>
                </div>
                <span className="format-output-arrow">→</span>
                <div className="export-summary-item">
                  {outputFormat === "images" ? (
                    <ZipIcon size={24} />
                  ) : (
                    <selectedOption.icon size={24} />
                  )}
                  <span>
                    {selectedOption.title}
                    <small>{selectedOption.extension}</small>
                  </span>
                </div>
              </div>
            ) : (
              <p className="file-hint muted">Complete steps 1 and 2 to enable export.</p>
            )}

            <div className="actions">
              <IconButton
                icon={
                  selectedOption ? (
                    <selectedOption.icon size={18} />
                  ) : (
                    <Download size={18} />
                  )
                }
                label={
                  outputFormat === "word"
                    ? "Export to Word"
                    : outputFormat === "excel"
                      ? "Export to Excel"
                      : outputFormat === "images"
                        ? "Extract images"
                        : "Export"
                }
                loading={loading}
                disabled={!selectedFile || !outputFormat}
                onClick={handleExport}
              />
            </div>
          </section>
        </>
      )}

      {showLimitGate && <ConvertLimitGate onDismiss={() => setShowLimitGate(false)} />}

      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
}
