import { ChevronDown, FolderOpen, Trash2, X } from "lucide-react";
import { formatBytes, formatFileLimit } from "../config/limits";
import { useMediaQuery } from "../hooks/useMediaQuery";
import type { WorkspaceEntry } from "../adapters/storage";
import FileDropzone from "./FileDropzone";
import IconButton from "./IconButton";
import WorkspaceFileThumbnail from "./WorkspaceFileThumbnail";

interface WorkspaceFileTrayProps {
  accept: string;
  uploadTitle: string;
  uploadLabel: string;
  entries: WorkspaceEntry[];
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
  entries,
  loading,
  entitlementsLabel,
  fileLimitMb,
  isPro,
  onFilesChange,
  onRemoveFile,
  onClearAll,
}: WorkspaceFileTrayProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const showCollapsibleList = isMobile && entries.length > 0;
  const trayFiles = entries.map((entry) => entry.file);

  return (
    <aside className="workspace-files-column panel">
      <div className="workspace-files-header">
        <div>
          <h3>
            <FolderOpen size={18} aria-hidden="true" />
            Your files
            {entries.length > 0 && (
              <span className="workspace-files-count">{entries.length}</span>
            )}
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
              files={trayFiles}
              onFilesChange={onFilesChange}
              accept={accept}
              label={uploadLabel}
              append
            />
          </div>

          {entries.length === 0 ? (
            <p className="file-hint muted">No files yet — upload above to get started.</p>
          ) : showCollapsibleList ? (
            <details className="workspace-files-mobile-details" open>
              <summary className="workspace-files-mobile-summary">
                <span>
                  {entries.length} file{entries.length === 1 ? "" : "s"} in workspace
                </span>
                <ChevronDown size={18} aria-hidden="true" />
              </summary>
              <FileList entries={entries} onRemoveFile={onRemoveFile} onClearAll={onClearAll} />
            </details>
          ) : (
            <FileList entries={entries} onRemoveFile={onRemoveFile} onClearAll={onClearAll} />
          )}
        </>
      )}
    </aside>
  );
}

function FileList({
  entries,
  onRemoveFile,
  onClearAll,
}: {
  entries: WorkspaceEntry[];
  onRemoveFile: (id: string) => void;
  onClearAll: () => void;
}) {
  return (
    <>
      <ul className="workspace-tray-list">
        {entries.map(({ record, file }) => (
          <li key={record.id} className="workspace-tray-item">
            <WorkspaceFileThumbnail file={file} name={record.name} />
            <div className="workspace-tray-item-meta">
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
  );
}
