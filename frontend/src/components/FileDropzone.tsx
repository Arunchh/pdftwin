import { useCallback, useRef, useState } from "react";
import { AlertCircle, FileUp } from "lucide-react";
import {
  formatBytes,
  formatFileLimit,
  FREE_FILE_LIMIT_BYTES,
  FREE_FILE_LIMIT_MB,
  PRO_FILE_LIMIT_BYTES,
} from "../config/limits";
import { acceptLabel, fileMatchesAccept } from "../utils/fileTypes";
import { useAuth } from "../hooks/useAuth";
import UploadProGate from "./UploadProGate";

interface FileDropzoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  hint?: string;
  /** When true, only new files are passed to onFilesChange and the list is shown elsewhere. */
  append?: boolean;
}

interface ProGateState {
  fileName: string;
  fileSize: number;
}

export default function FileDropzone({
  files,
  onFilesChange,
  accept = ".pdf",
  multiple = true,
  label = "Drop files here or click to browse",
  hint,
  append = false,
}: FileDropzoneProps) {
  const { entitlements } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proGate, setProGate] = useState<ProGateState | null>(null);

    ? `${acceptLabel(accept)} · up to ${formatFileLimit(entitlements.fileLimitMb)} on Pro`
    : `${acceptLabel(accept)} · up to ${formatFileLimit(FREE_FILE_LIMIT_MB)} without an account`;

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const list = Array.from(incoming);
      const invalid = list.filter((file) => !fileMatchesAccept(file, accept));

      if (invalid.length) {
        setProGate(null);
        setError(`Unsupported file type. Accepted formats: ${acceptLabel(accept)}.`);
        return;
      }

      if (!entitlements.isPro) {
        const needsPro = list.find((file) => file.size > FREE_FILE_LIMIT_BYTES);
        if (needsPro) {
          setError(null);
          setProGate({ fileName: needsPro.name, fileSize: needsPro.size });
          return;
        }
      } else {
        const oversized = list.filter((file) => file.size > PRO_FILE_LIMIT_BYTES);
        if (oversized.length) {
          setProGate(null);
          setError(
            `${oversized[0].name} exceeds your Pro plan limit of ${formatFileLimit(entitlements.fileLimitMb)} (${formatBytes(oversized[0].size)}).`
          );
          return;
        }
      }

      setProGate(null);
      setError(null);
      if (append) {
        onFilesChange(list);
      } else if (multiple) {
        onFilesChange([...files, ...list]);
      } else {
        onFilesChange(list.slice(0, 1));
      }
    },
    [accept, append, entitlements.fileLimitMb, entitlements.isPro, files, multiple, onFilesChange]
  );

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files.length) {
      addFiles(event.dataTransfer.files);
    }
  };

  return (
    <div>
      <div
        className={`dropzone ${dragging ? "dragging" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <div className="dropzone-icon">
          <FileUp size={40} strokeWidth={1.5} />
        </div>
        <p>{label}</p>
        <p className="hint">{hint ?? defaultHint}</p>
      </div>

      {proGate && (
        <UploadProGate
          fileName={proGate.fileName}
          fileSize={proGate.fileSize}
          onDismiss={() => setProGate(null)}
        />
      )}

      {error && (
        <p className="dropzone-error">
          <AlertCircle size={16} />
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        className="hidden-input"
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          if (e.target.files?.length) {
            addFiles(e.target.files);
          }
          e.target.value = "";
        }}
      />

      {!append && files.length > 0 && (
        <p className="file-hint">{files.length} file(s) ready in workspace.</p>
      )}
    </div>
  );
}
