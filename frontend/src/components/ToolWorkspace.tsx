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
import CompareFileTray from "./compare/CompareFileTray";
import CompressPanel from "./CompressPanel";
import RotatePanel from "./RotatePanel";
import WatermarkPanel from "./WatermarkPanel";
import WordToPdfPanel from "./WordToPdfPanel";
import SignPdfPanel from "./SignPdfPanel";
import WorkspaceFileTray from "./WorkspaceFileTray";
import WorkspaceToolRail from "./layout/WorkspaceToolRail";
import type { ToolId } from "../config/tools";
import { TOOL_UPLOAD_CONFIG, WORKSPACE_ACCEPT } from "../config/upload";
import { WorkspaceNavProvider } from "../context/WorkspaceNavContext";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../i18n/I18nProvider";
import { useWorkspaceFiles } from "../hooks/useWorkspaceFiles";
import { useWorkspaceNavigation } from "../hooks/useWorkspaceNavigation";
import { recordToolVisit } from "../stores/workspaceUsageStore";
import { defaultPdfOrder, reconcilePdfOrder } from "../utils/files";

interface ToolWorkspaceProps {
  toolId: ToolId | null;
  variant?: "default" | "homeCompare";
}

export default function ToolWorkspace({
  toolId: initialToolId,
  variant = "default",
}: ToolWorkspaceProps) {
  const isHomeCompare = variant === "homeCompare";
  const { messages } = useI18n();
  const { entitlements } = useAuth();
  const { entries, files, loading, addFiles, removeFile, clearAll } = useWorkspaceFiles();
  const { activeToolId, activeTool, navigateToTool } = useWorkspaceNavigation(initialToolId);
  const [pdfOrder, setPdfOrder] = useState<File[]>([]);
  const [mergeOrderFrozen, setMergeOrderFrozen] = useState(false);
  const [compareReviewMode, setCompareReviewMode] = useState(false);
  const [compareLeftFile, setCompareLeftFile] = useState<File | null>(null);
  const [compareRightFile, setCompareRightFile] = useState<File | null>(null);
  const [compareTrigger, setCompareTrigger] = useState(0);
  const [canCompare, setCanCompare] = useState(false);
  const [compareLoading, setCompareLoading] = useState(false);

  const isCompareTool = activeToolId === "pdf-compare";
  const hideWorkspaceChrome = isCompareTool && compareReviewMode;

  const uploadConfig = activeToolId ? TOOL_UPLOAD_CONFIG[activeToolId] : TOOL_UPLOAD_CONFIG["pdf-compare"];
  const toolCopy = activeToolId ? messages.tools[activeToolId] : null;

  useEffect(() => {
    if (activeToolId) {
      recordToolVisit(activeToolId);
    }
  }, [activeToolId]);

  useEffect(() => {
    if (!isCompareTool) {
      setCompareReviewMode(false);
    }
  }, [isCompareTool]);

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

  const handleCompareSwap = () => {
    setCompareLeftFile(compareRightFile);
    setCompareRightFile(compareLeftFile);
  };

  const handleCompare = () => {
    setCompareTrigger((current) => current + 1);
  };

  const handleReviewReadinessChange = (state: { ready: boolean; loading: boolean }) => {
    setCanCompare(state.ready);
    setCompareLoading(state.loading);
  };

  const renderToolPanel = () => {
    if (!activeToolId) {
      return null;
    }

    switch (activeToolId) {
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
        return (
          <ComparePanel
            leftFile={compareLeftFile}
            rightFile={compareRightFile}
            onLeftFileChange={setCompareLeftFile}
            onRightFileChange={setCompareRightFile}
            onReviewModeChange={setCompareReviewMode}
            compareTrigger={compareTrigger}
            onReviewReadinessChange={handleReviewReadinessChange}
          />
        );
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
    <WorkspaceNavProvider navigateToTool={navigateToTool}>
      <div
        className={`workspace-frame${
          (!hideWorkspaceChrome && activeTool) ? " workspace-frame--with-rail" : ""
        }`}
      >
        {!hideWorkspaceChrome && activeTool && (
          <WorkspaceToolRail activeTool={activeTool.id} onNavigate={navigateToTool} />
        )}

        <section
          className={`workspace site--focused${
            activeTool ? ` workspace--${activeTool.category}` : ""
          }${
            isCompareTool ? " workspace--compare" : ""
          }${isHomeCompare ? " workspace--home-compare" : ""}${
            hideWorkspaceChrome ? " workspace--compare-review" : ""
          }`}
          id="workspace"
        >
          {!hideWorkspaceChrome && !isHomeCompare && toolCopy && (
            <div className="section-heading workspace-heading">
              <h2>{toolCopy.name}</h2>
              <p>{toolCopy.description}</p>
            </div>
          )}

          <div
            className={`workspace-layout${
              isCompareTool ? " workspace-layout--compare" : ""
            }${hideWorkspaceChrome ? " workspace-layout--compare-review" : ""}`}
          >
            <div className="workspace-action-column">{renderToolPanel()}</div>

            {!hideWorkspaceChrome && isCompareTool && (
              <CompareFileTray
                leftFile={compareLeftFile}
                rightFile={compareRightFile}
                onLeftFileChange={setCompareLeftFile}
                onRightFileChange={setCompareRightFile}
                onSwap={handleCompareSwap}
                onCompare={handleCompare}
                canCompare={canCompare}
                compareLoading={compareLoading}
                fileLimitMb={entitlements.fileLimitMb}
                entitlementsLabel={entitlements.label}
                isPro={entitlements.isPro}
              />
            )}

            {!hideWorkspaceChrome && !isCompareTool && (
              <WorkspaceFileTray
                accept={WORKSPACE_ACCEPT}
                uploadTitle={uploadConfig.title}
                uploadLabel={uploadConfig.label}
                entries={entries}
                loading={loading}
                entitlementsLabel={entitlements.label}
                fileLimitMb={entitlements.fileLimitMb}
                isPro={entitlements.isPro}
                onFilesChange={handleIncomingFiles}
                onRemoveFile={removeFile}
                onClearAll={handleClearAll}
              />
            )}
          </div>
        </section>
      </div>
    </WorkspaceNavProvider>
  );
}
