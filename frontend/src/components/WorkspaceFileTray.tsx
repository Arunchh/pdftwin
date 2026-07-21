import { FolderOpen, Trash2, X } from "lucide-react";
import { formatBytes } from "../config/limits";
import { useWorkspaceFiles } from "../hooks/useWorkspaceFiles";
import IconButton from "./IconButton";

export default function WorkspaceFileTray() {
  const { records, loading, removeFile, clearAll } = useWorkspaceFiles();

  if (loading) {
    return (
      <aside className="workspace-tray panel">
        <p className="file-hint muted">Loading workspace files…</p>
      </aside>
    );
  }

  return (
    <aside className="workspace-tray panel">
      <div className="workspace-tray-header">
        <div>
          <h3>
            <FolderOpen size={18} />
            Workspace files
          </h3>
          <p className="description">
            Saved in your browser — switch tools without re-uploading.
          </p>
        </div>
        {records.length > 0 && (
          <IconButton
            icon={<Trash2 size={16} />}
            label="Clear tray"
            variant="secondary"
            onClick={() => clearAll()}
          />
        )}
      </div>

      {records.length === 0 ? (
        <p className="file-hint muted">Upload files below to fill your workspace tray.</p>
      ) : (
        <ul className="workspace-tray-list">
          {records.map((record) => (
            <li key={record.id} className="workspace-tray-item">
              <div>
                <strong>{record.name}</strong>
                <span>{formatBytes(record.size)}</span>
              </div>
              <button
                type="button"
                className="workspace-tray-remove"
                aria-label={`Remove ${record.name}`}
                onClick={() => removeFile(record.id)}
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
