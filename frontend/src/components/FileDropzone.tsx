import { useCallback, useRef, useState } from "react";
import { AlertCircle, FileUp } from "lucide-react";
import { formatBytes, formatFileLimit } from "../config/limits";
import { acceptLabel, fileMatchesAccept } from "../utils/fileTypes";
import { useAuth } from "../hooks/useAuth";

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

  const limitBytes = entitlements.fileLimitBytes;
  const defaultHint = `${acceptLabel(accept)} · up to ${formatFileLimit(entitlements.fileLimitMb)} on ${entitlements.label}`;

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const list = Array.from(incoming);
      const invalid = list.filter((file) => !fileMatchesAccept(file, accept));

      if (invalid.length) {
        setError(`Unsupported file type. Accepted formats: ${acceptLabel(accept)}.`);
        return;
      }

      const oversized = list.filter((file) => file.size > limitBytes);

      if (oversized.length) {
        setError(
          `${oversized[0].name} exceeds your ${entitlements.label} plan limit of ${formatFileLimit(entitlements.fileLimitMb)} (${formatBytes(oversized[0].size)}).`
        );
        return;
      }

      setError(null);
      if (append) {
        onFilesChange(list);
      } else if (multiple) {
        onFilesChange([...files, ...list]);
      } else {
        onFilesChange(list.slice(0, 1));
      }
    },
    [accept, append, entitlements.label, entitlements.fileLimitMb, files, limitBytes, multiple, onFilesChange]
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
