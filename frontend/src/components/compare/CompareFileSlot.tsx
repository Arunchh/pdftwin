import { useCallback, useRef, useState } from "react";
import { AlertCircle, FileText, FileUp, Trash2, Upload } from "lucide-react";
import {
  formatBytes,
  formatFileLimit,
  FREE_FILE_LIMIT_BYTES,
  PRO_FILE_LIMIT_BYTES,
} from "../../config/limits";
import { useAuth } from "../../hooks/useAuth";
import { useFileThumbnail } from "../../hooks/useFileThumbnail";
import { acceptLabel, fileMatchesAccept } from "../../utils/fileTypes";
import UploadProGate from "../UploadProGate";

interface CompareFileSlotProps {
  label: string;
  file: File | null;
  placeholder: string;
  browseLabel: string;
  emptyHint: string;
  removeLabel: string;
  onFileChange: (file: File | null) => void;
}

export default function CompareFileSlot({
  label,
  file,
  placeholder,
  browseLabel,
  emptyHint,
  removeLabel,
  onFileChange,
}: CompareFileSlotProps) {
  const { entitlements } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proGate, setProGate] = useState<{ fileName: string; fileSize: number } | null>(null);
  const { thumbnailUrl, loading } = useFileThumbnail(file ?? undefined, 160);

  const accept = ".pdf";

  const addFile = useCallback(
    (incoming: FileList | File[]) => {
      const list = Array.from(incoming);
      const candidate = list[0];
      if (!candidate) return;

      if (!fileMatchesAccept(candidate, accept)) {
        setProGate(null);
        setError(`Unsupported file type. Accepted formats: ${acceptLabel(accept)}.`);
        return;
      }

      if (!entitlements.isPro) {
        if (candidate.size > FREE_FILE_LIMIT_BYTES) {
          setError(null);
          setProGate({ fileName: candidate.name, fileSize: candidate.size });
          return;
        }
      } else if (candidate.size > PRO_FILE_LIMIT_BYTES) {
        setProGate(null);
        setError(
          `${candidate.name} exceeds your Pro plan limit of ${formatFileLimit(entitlements.fileLimitMb)} (${formatBytes(candidate.size)}).`
        );
        return;
      }

      setProGate(null);
      setError(null);
      onFileChange(candidate);
    },
    [entitlements.fileLimitMb, entitlements.isPro, onFileChange]
  );

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files.length) {
      addFile(event.dataTransfer.files);
    }
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    onFileChange(null);
    setError(null);
    setProGate(null);
  };

  return (
    <div className="compare-file-slot">
      <div className="compare-file-slot-label">{label}</div>

      <div
        className={`compare-file-slot-body${file ? " compare-file-slot-body--filled" : ""}${
          dragging ? " compare-file-slot-body--dragging" : ""
        }`}
        onClick={() => !file && inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        role={file ? undefined : "button"}
        tabIndex={file ? undefined : 0}
        onKeyDown={(event) => {
          if (!file && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        {file ? (
          <>
            <div className="compare-file-slot-preview">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt=""
                  className="compare-file-slot-thumb"
                  loading="lazy"
                  decoding="async"
                />
              ) : loading ? (
                <div className="compare-file-slot-thumb compare-file-slot-thumb--loading" aria-hidden="true" />
              ) : (
                <div className="compare-file-slot-thumb compare-file-slot-thumb--icon" aria-hidden="true">
                  <FileText size={32} strokeWidth={1.5} />
                </div>
              )}
              <div className="compare-file-slot-preview-glow" aria-hidden="true" />
            </div>
            <div className="compare-file-slot-meta">
              <p className="compare-file-slot-name" title={file.name}>
                {file.name}
              </p>
              <p className="compare-file-slot-size">{formatBytes(file.size)}</p>
            </div>
            <button
              type="button"
              className="compare-file-slot-remove"
              onClick={handleClear}
              aria-label={removeLabel}
            >
              <Trash2 size={15} />
              <span>{removeLabel}</span>
            </button>
          </>
        ) : (
          <div className="compare-file-slot-empty">
            <div className="compare-file-slot-empty-icon">
              <FileUp size={28} strokeWidth={1.5} />
            </div>
            <p className="compare-file-slot-empty-title">{placeholder}</p>
            <p className="compare-file-slot-empty-hint">{emptyHint}</p>
            <button
              type="button"
              className="btn btn-secondary btn-sm compare-file-slot-browse"
              onClick={(event) => {
                event.stopPropagation();
                inputRef.current?.click();
              }}
            >
              <Upload size={15} />
              {browseLabel}
            </button>
          </div>
        )}
      </div>

      {proGate && (
        <UploadProGate
          fileName={proGate.fileName}
          fileSize={proGate.fileSize}
          onDismiss={() => setProGate(null)}
        />
      )}

      {error && (
        <p className="dropzone-error compare-file-slot-error">
          <AlertCircle size={14} />
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        className="hidden-input"
        type="file"
        accept={accept}
        onChange={(event) => {
          if (event.target.files?.length) {
            addFile(event.target.files);
          }
          event.target.value = "";
        }}
      />
    </div>
  );
}
