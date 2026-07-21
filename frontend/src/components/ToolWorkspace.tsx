import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import FileDropzone from "./FileDropzone";
import IconButton from "./IconButton";
import ConvertExtractPanel from "./ConvertExtractPanel";
import ArrangeMergePanel from "./ArrangeMergePanel";
import SplitPanel from "./SplitPanel";
import ExtractPagesPanel from "./ExtractPagesPanel";
import LockUnlockPanel from "./LockUnlockPanel";
import ImageConvertPanel from "./ImageConvertPanel";
import ComparePanel from "./ComparePanel";
import WorkspaceToolSwitcher from "./layout/WorkspaceToolSwitcher";
import type { ToolId } from "../config/tools";
import { toolById, toolPath } from "../config/tools";
import { TOOL_UPLOAD_CONFIG } from "../config/upload";
import { formatFileLimit, FREE_FILE_LIMIT_MB } from "../config/limits";
import { defaultPdfOrder, reconcilePdfOrder } from "../utils/files";

interface ToolWorkspaceProps {
  toolId: ToolId;
}

export default function ToolWorkspace({ toolId }: ToolWorkspaceProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [pdfOrder, setPdfOrder] = useState<File[]>([]);
  const [mergeOrderFrozen, setMergeOrderFrozen] = useState(false);

  const activeTool = toolById(toolId);
  const uploadConfig = TOOL_UPLOAD_CONFIG[toolId];
  const isCompare = toolId === "pdf-compare";

  useEffect(() => {
    setPdfOrder((current) => reconcilePdfOrder(current, files));
  }, [files]);

  useEffect(() => {
    if (defaultPdfOrder(files).length < 2) {
      setMergeOrderFrozen(false);
    }
  }, [files]);

  const handleFilesChange = (nextFiles: File[]) => {
    setFiles(nextFiles);
    if (!nextFiles.length) {
      setPdfOrder([]);
      setMergeOrderFrozen(false);
    }
  };

  return (
    <section className={`workspace site--focused workspace--${activeTool.category}`} id="workspace">
      <div className="section-heading workspace-heading">
        <h2>{activeTool.name}</h2>
        <p>{activeTool.description}</p>
      </div>

      <WorkspaceToolSwitcher activeTool={toolId} />

      {!isCompare && (
        <div className="panel upload-section">
          <div className="workspace-upload-header">
            <div>
              <h3>{uploadConfig.title}</h3>
              <p className="description">
                Drop your files once — every tool in this workspace shares the same upload.
              </p>
            </div>
            <span className="workspace-limit">
              Free · up to {formatFileLimit(FREE_FILE_LIMIT_MB)} per file
            </span>
          </div>

          <FileDropzone
            files={files}
            onFilesChange={handleFilesChange}
            accept={uploadConfig.accept}
            label={uploadConfig.label}
            hint={uploadConfig.hint}
          />

          {files.length > 0 && (
            <div className="actions">
              <IconButton
                icon={<Trash2 size={18} />}
                label="Clear all files"
                variant="secondary"
                onClick={() => handleFilesChange([])}
              />
            </div>
          )}
        </div>
      )}

      {toolId === "convert-extract" && <ConvertExtractPanel files={files} />}
      {toolId === "image-convert" && <ImageConvertPanel files={files} />}
      {toolId === "pdf-compare" && <ComparePanel />}
      {toolId === "arrange-merge" && (
        <ArrangeMergePanel
          files={files}
          pdfOrder={pdfOrder}
          onPdfOrderChange={setPdfOrder}
          orderFrozen={mergeOrderFrozen}
          onOrderFrozenChange={setMergeOrderFrozen}
          onMergedFile={(file) => setFiles((current) => [...current, file])}
          onConvertMerged={() => {
            window.location.href = toolPath("convert-extract");
          }}
        />
      )}
      {toolId === "split" && <SplitPanel files={files} />}
      {toolId === "extract-pages" && <ExtractPagesPanel files={files} />}
      {toolId === "lock-unlock" && <LockUnlockPanel files={files} />}
    </section>
  );
}
