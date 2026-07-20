import { useCallback, useRef, useState } from "react";
import { AlertCircle, FileUp, X } from "lucide-react";
import { formatBytes, formatFileLimit, FREE_FILE_LIMIT_BYTES, FREE_FILE_LIMIT_MB } from "../config/limits";
import { acceptLabel, fileMatchesAccept } from "../utils/fileTypes";
import IconButton from "./IconButton";

interface FileDropzoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  hint?: string;
}

export default function FileDropzone({
  files,
  onFilesChange,
  accept = ".pdf",
  multiple = true,
  label = "Drop files here or click to browse",
  hint = `PDF only · up to ${formatFileLimit(FREE_FILE_LIMIT_MB)} per file on Free`,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const list = Array.from(incoming);
      const invalid = list.filter((file) => !fileMatchesAccept(file, accept));

      if (invalid.length) {
        setError(`Unsupported file type. Accepted formats: ${acceptLabel(accept)}.`);
        return;
      }

      const oversized = list.filter((file) => file.size > FREE_FILE_LIMIT_BYTES);

      if (oversized.length) {
        setError(
          `${oversized[0].name} exceeds the ${formatFileLimit(FREE_FILE_LIMIT_MB)} Free plan limit (${formatBytes(oversized[0].size)}).`
        );
        return;
      }

      setError(null);
      if (multiple) {
        onFilesChange([...files, ...list]);
      } else {
        onFilesChange(list.slice(0, 1));
      }
    },
    [accept, files, multiple, onFilesChange]
  );

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files.length) {
      addFiles(event.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    setError(null);
    onFilesChange(files.filter((_, i) => i !== index));
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
        <p className="hint">{hint}</p>
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

      {files.length > 0 && (
        <div className="file-list">
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="file-item">
              <div>
                <div className="name">{file.name}</div>
                <div className="meta">{formatBytes(file.size)}</div>
              </div>
              <IconButton
                icon={<X size={18} />}
                label="Remove file"
                variant="ghost"
                iconOnly
                onClick={() => removeFile(index)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
