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
import CompressPanel from "./CompressPanel";
import RotatePanel from "./RotatePanel";
import WorkspaceFileTray from "./WorkspaceFileTray";
import WorkspaceToolSwitcher from "./layout/WorkspaceToolSwitcher";
import type { ToolId } from "../config/tools";
import { toolById, toolPath } from "../config/tools";
import { TOOL_UPLOAD_CONFIG } from "../config/upload";
import { formatFileLimit } from "../config/limits";
import { useAuth } from "../hooks/useAuth";
import { useWorkspaceFiles } from "../hooks/useWorkspaceFiles";
import { defaultPdfOrder, reconcilePdfOrder } from "../utils/files";

interface ToolWorkspaceProps {
  toolId: ToolId;
}

export default function ToolWorkspace({ toolId }: ToolWorkspaceProps) {
  const { entitlements } = useAuth();
  const { files, loading, addFiles, clearAll } = useWorkspaceFiles();
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

  const handleIncomingFiles = async (incoming: File[]) => {
    await addFiles(incoming);
  };

  const handleClearAll = async () => {
    await clearAll();
    setPdfOrder([]);
    setMergeOrderFrozen(false);
  };

  return (
    <section className={`workspace site--focused workspace--${activeTool.category}`} id="workspace">
      <div className="section-heading workspace-heading">
        <h2>{activeTool.name}</h2>
        <p>{activeTool.description}</p>
      </div>

      <WorkspaceToolSwitcher activeTool={toolId} />

      {!isCompare && (
        <>
          <WorkspaceFileTray />

          <div className="panel upload-section">
            <div className="workspace-upload-header">
              <div>
                <h3>{uploadConfig.title}</h3>
                <p className="description">
                  Files go into your workspace tray and stay available across every tool.
                </p>
              </div>
              <span className={`workspace-limit ${entitlements.isPro ? "workspace-limit--pro" : ""}`}>
                {entitlements.label} · up to {formatFileLimit(entitlements.fileLimitMb)} per file
              </span>
            </div>

            {!loading && (
              <FileDropzone
                files={files}
                onFilesChange={handleIncomingFiles}
                accept={uploadConfig.accept}
                label={uploadConfig.label}
                append
              />
            )}

            {files.length > 0 && (
              <div className="actions">
                <IconButton
                  icon={<Trash2 size={18} />}
                  label="Clear workspace"
                  variant="secondary"
                  onClick={handleClearAll}
                />
              </div>
            )}
          </div>
        </>
      )}

      {toolId === "convert-extract" && <ConvertExtractPanel files={files} />}
      {toolId === "image-convert" && <ImageConvertPanel files={files} />}
      {toolId === "compress-pdf" && <CompressPanel files={files} />}
      {toolId === "pdf-compare" && <ComparePanel />}
      {toolId === "arrange-merge" && (
        <ArrangeMergePanel
          files={files}
          pdfOrder={pdfOrder}
          onPdfOrderChange={setPdfOrder}
          orderFrozen={mergeOrderFrozen}
          onOrderFrozenChange={setMergeOrderFrozen}
          onMergedFile={(file) => addFiles([file])}
          onConvertMerged={() => {
            window.location.href = toolPath("convert-extract");
          }}
        />
      )}
      {toolId === "split" && <SplitPanel files={files} />}
      {toolId === "extract-pages" && <ExtractPagesPanel files={files} />}
      {toolId === "rotate-pdf" && <RotatePanel files={files} />}
      {toolId === "lock-unlock" && <LockUnlockPanel files={files} />}
    </section>
  );
}
