import { ChevronDown, FolderOpen, Trash2, X } from "lucide-react";
import { formatBytes, formatFileLimit } from "../config/limits";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { fileForRecord } from "../utils/files";
import FileDropzone from "./FileDropzone";
import IconButton from "./IconButton";
import WorkspaceFileThumbnail from "./WorkspaceFileThumbnail";

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
  const isMobile = useMediaQuery("(max-width: 640px)");
  const showCollapsibleList = isMobile && records.length > 0;

  return (
    <aside className="workspace-files-column panel">
      <div className="workspace-files-header">
        <div>
          <h3>
            <FolderOpen size={18} aria-hidden="true" />
            Your files
            {records.length > 0 && (
              <span className="workspace-files-count">{records.length}</span>
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
              files={files}
              onFilesChange={onFilesChange}
              accept={accept}
              label={uploadLabel}
              append
            />
          </div>

          {records.length === 0 ? (
            <p className="file-hint muted">No files yet — upload above to get started.</p>
          ) : showCollapsibleList ? (
            <details className="workspace-files-mobile-details" open>
              <summary className="workspace-files-mobile-summary">
                <span>
                  {records.length} file{records.length === 1 ? "" : "s"} in workspace
                </span>
                <ChevronDown size={18} aria-hidden="true" />
              </summary>
              <FileList
                files={files}
                records={records}
                onRemoveFile={onRemoveFile}
                onClearAll={onClearAll}
              />
            </details>
          ) : (
            <FileList
              files={files}
              records={records}
              onRemoveFile={onRemoveFile}
              onClearAll={onClearAll}
            />
          )}
        </>
      )}
    </aside>
  );
}

function FileList({
  files,
  records,
  onRemoveFile,
  onClearAll,
}: {
  files: File[];
  records: Array<{ id: string; name: string; size: number }>;
  onRemoveFile: (id: string) => void;
  onClearAll: () => void;
}) {
  return (
    <>
      <ul className="workspace-tray-list">
        {records.map((record) => {
          const file = fileForRecord(record, files);
          return (
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
          );
        })}
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
