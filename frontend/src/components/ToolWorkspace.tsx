import { useEffect, useState } from "react";
import ConvertExtractPanel from "./ConvertExtractPanel";
import ArrangeMergePanel from "./ArrangeMergePanel";
import SplitPanel from "./SplitPanel";
import ExtractPagesPanel from "./ExtractPagesPanel";
import RemovePagesPanel from "./RemovePagesPanel";
import LockUnlockPanel from "./LockUnlockPanel";
import ImageConvertPanel from "./ImageConvertPanel";
import ImageResizePanel from "./ImageResizePanel";
import ImagesToPdfPanel from "./ImagesToPdfPanel";
import PdfToJpgPanel from "./PdfToJpgPanel";
import PdfToTextPanel from "./PdfToTextPanel";
import OcrPanel from "./OcrPanel";
import ComparePanel from "./ComparePanel";
import CompressPanel from "./CompressPanel";
import RotatePanel from "./RotatePanel";
import WatermarkPanel from "./WatermarkPanel";
import WordToPdfPanel from "./WordToPdfPanel";
import SignPdfPanel from "./SignPdfPanel";
import WorkspaceFileTray from "./WorkspaceFileTray";
import WorkspaceToolSwitcher from "./layout/WorkspaceToolSwitcher";
import type { ToolId } from "../config/tools";
import { toolById } from "../config/tools";
import { TOOL_UPLOAD_CONFIG } from "../config/upload";
import { useAuth } from "../hooks/useAuth";
import { useWorkspaceFiles } from "../hooks/useWorkspaceFiles";
import { recordToolVisit } from "../stores/workspaceUsageStore";
import { defaultPdfOrder, getPdfFiles, reconcilePdfOrder } from "../utils/files";

interface ToolWorkspaceProps {
  toolId: ToolId;
}

export default function ToolWorkspace({ toolId }: ToolWorkspaceProps) {
  const { entitlements } = useAuth();
  const { records, files, loading, addFiles, removeFile, clearAll } = useWorkspaceFiles();
  const [pdfOrder, setPdfOrder] = useState<File[]>([]);
  const [mergeOrderFrozen, setMergeOrderFrozen] = useState(false);

  const activeTool = toolById(toolId);
  const uploadConfig = TOOL_UPLOAD_CONFIG[toolId];
  const pdfFiles = getPdfFiles(files);

  useEffect(() => {
    recordToolVisit(toolId);
  }, [toolId]);

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

  const renderToolPanel = () => {
    switch (toolId) {
      case "convert-extract":
        return <ConvertExtractPanel files={files} />;
      case "image-convert":
        return <ImageConvertPanel files={files} />;
      case "image-resize":
        return <ImageResizePanel files={files} />;
      case "images-to-pdf":
        return <ImagesToPdfPanel files={files} />;
      case "pdf-to-jpg":
        return <PdfToJpgPanel files={files} />;
      case "pdf-to-text":
        return <PdfToTextPanel files={files} />;
      case "ocr-pdf":
        return <OcrPanel files={files} />;
      case "compress-pdf":
        return <CompressPanel files={files} />;
      case "word-to-pdf":
        return <WordToPdfPanel files={files} />;
      case "pdf-compare":
        return <ComparePanel pdfFiles={pdfFiles} />;
      case "arrange-merge":
        return (
          <ArrangeMergePanel
            files={files}
            pdfOrder={pdfOrder}
            onPdfOrderChange={setPdfOrder}
            orderFrozen={mergeOrderFrozen}
            onOrderFrozenChange={setMergeOrderFrozen}
          onMergedFile={(file) => addFiles([file])}
        />
        );
      case "split":
        return <SplitPanel files={files} />;
      case "extract-pages":
        return <ExtractPagesPanel files={files} />;
      case "remove-pages":
        return <RemovePagesPanel files={files} />;
      case "rotate-pdf":
        return <RotatePanel files={files} />;
      case "watermark-pdf":
        return <WatermarkPanel files={files} />;
      case "lock-unlock":
        return <LockUnlockPanel files={files} />;
      case "sign-pdf":
        return <SignPdfPanel files={files} />;
      default:
        return null;
    }
  };

  return (
    <section className={`workspace site--focused workspace--${activeTool.category}`} id="workspace">
      <div className="section-heading workspace-heading">
        <h2>{activeTool.name}</h2>
        <p>{activeTool.description}</p>
      </div>

      <WorkspaceToolSwitcher activeTool={toolId} />

      <div className="workspace-layout">
        <WorkspaceFileTray
          accept={uploadConfig.accept}
          uploadTitle={uploadConfig.title}
          uploadLabel={uploadConfig.label}
          files={files}
          records={records}
          loading={loading}
          entitlementsLabel={entitlements.label}
          fileLimitMb={entitlements.fileLimitMb}
          isPro={entitlements.isPro}
          onFilesChange={handleIncomingFiles}
          onRemoveFile={removeFile}
          onClearAll={handleClearAll}
        />

        <div className="workspace-action-column">{renderToolPanel()}</div>
      </div>
    </section>
  );
}
