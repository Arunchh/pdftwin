import { fileKey } from "../utils/files";

interface PdfSelectListProps {
  files: File[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  label?: string;
}

export default function PdfSelectList({
  files,
  selectedKey,
  onSelect,
  label = "Choose PDF",
}: PdfSelectListProps) {
  if (!files.length) {
    return <p className="file-hint muted">Upload at least one PDF in the upload section above.</p>;
  }

  return (
    <div className="pdf-select-block">
      <p className="order-section-title">{label}</p>
      <div className="pdf-select-list">
        {files.map((file) => {
          const key = fileKey(file);
          const active = (selectedKey ?? fileKey(files[0])) === key;

          return (
            <button
              key={key}
              type="button"
              className={`pdf-select-item ${active ? "active" : ""}`}
              onClick={() => onSelect(key)}
            >
              <span className="pdf-select-item-row">
                <span className="order-list-position">{files.indexOf(file) + 1}</span>
                <span className="order-list-label">{file.name}</span>
              </span>
              <span className="order-list-meta">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
