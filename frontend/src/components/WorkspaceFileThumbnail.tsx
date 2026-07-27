import { FileSpreadsheet, FileText, ImageIcon } from "lucide-react";
import { useFileThumbnail } from "../hooks/useFileThumbnail";
import { isDocxFile, isImageFile, isPdfFile } from "../utils/files";

interface WorkspaceFileThumbnailProps {
  file: File | undefined;
  name: string;
}

export default function WorkspaceFileThumbnail({ file, name }: WorkspaceFileThumbnailProps) {
  const { thumbnailUrl, loading } = useFileThumbnail(file);

  if (thumbnailUrl) {
    return (
      <img
        src={thumbnailUrl}
        alt=""
        className="workspace-tray-thumb"
        loading="lazy"
        decoding="async"
      />
    );
  }

  if (loading) {
    return <span className="workspace-tray-thumb workspace-tray-thumb--loading" aria-hidden="true" />;
  }

  const Icon = isPdfFile({ name })
    ? FileText
    : isImageFile({ name })
      ? ImageIcon
      : isDocxFile({ name })
        ? FileSpreadsheet
        : FileText;

  return (
    <span className="workspace-tray-thumb workspace-tray-thumb--icon" aria-hidden="true">
      <Icon size={18} />
    </span>
  );
}
