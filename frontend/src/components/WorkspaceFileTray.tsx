import { FolderOpen, Trash2, X } from "lucide-react";
import { formatBytes, formatFileLimit } from "../config/limits";
import FileDropzone from "./FileDropzone";
import IconButton from "./IconButton";

interface WorkspaceFileTrayProps {
  accept: string;
  uploadTitle: string;
  uploadLabel: string;
  files: File[];
  records: Array<{ id: string; name: string; size: number }>;
  loading: boolean;
  entitlementsLabel: string;
  fileLimitMb: number;
  isPro: boolean;
  onFilesChange: (files: File[]) => void;
  onRemoveFile: (id: string) => void;
  onClearAll: () => void;
}

export default function WorkspaceFileTray({
  accept,
  uploadTitle,
  uploadLabel,
  files,
  records,
  loading,
  entitlementsLabel,
  fileLimitMb,
  isPro,
  onFilesChange,
  onRemoveFile,
  onClearAll,
}: WorkspaceFileTrayProps) {
  return (
    <aside className="workspace-files-column panel">
      <div className="workspace-files-header">
        <div>
          <h3>
            <FolderOpen size={18} aria-hidden="true" />
            Your files
          </h3>
          <p className="description">Saved in your browser — switch tools without re-uploading.</p>
        </div>
        <span className={`workspace-limit ${isPro ? "workspace-limit--pro" : ""}`}>
          {entitlementsLabel} · up to {formatFileLimit(fileLimitMb)} per file
        </span>
      </div>

      {loading ? (
        <p className="file-hint muted">Loading workspace files…</p>
      ) : (
        <>
          <div className="workspace-files-upload">
            <p className="workspace-files-upload-title">{uploadTitle}</p>
            <FileDropzone
              files={files}
              onFilesChange={onFilesChange}
              accept={accept}
              label={uploadLabel}
              append
            />
          </div>

          {records.length === 0 ? (
            <p className="file-hint muted">No files yet — upload above to get started.</p>
          ) : (
            <>
              <ul className="workspace-tray-list">
                {records.map((record) => (
                  <li key={record.id} className="workspace-tray-item">
                    <div>
                      <strong className="workspace-tray-item-name">{record.name}</strong>
                      <span>{formatBytes(record.size)}</span>
                    </div>
                    <button
                      type="button"
                      className="workspace-tray-remove"
                      aria-label={`Remove ${record.name}`}
                      onClick={() => onRemoveFile(record.id)}
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="workspace-files-actions">
                <IconButton
                  icon={<Trash2 size={16} />}
                  label="Clear all files"
                  variant="secondary"
                  onClick={onClearAll}
                />
              </div>
            </>
          )}
        </>
      )}
    </aside>
  );
}
