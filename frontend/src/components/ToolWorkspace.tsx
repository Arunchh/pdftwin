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
import WorkspaceToolRail from "./layout/WorkspaceToolRail";
import type { ToolId } from "../config/tools";
import { TOOL_UPLOAD_CONFIG, WORKSPACE_ACCEPT } from "../config/upload";
import { WorkspaceNavProvider } from "../context/WorkspaceNavContext";
import { useAuth } from "../hooks/useAuth";
import { useI18n } from "../i18n/I18nProvider";
import { useWorkspaceFiles } from "../hooks/useWorkspaceFiles";
import { useWorkspaceNavigation } from "../hooks/useWorkspaceNavigation";
import { recordToolVisit } from "../stores/workspaceUsageStore";
import { defaultPdfOrder, getPdfFiles, reconcilePdfOrder } from "../utils/files";

interface ToolWorkspaceProps {
  toolId: ToolId | null;
  variant?: "default" | "homeHero";
}

export default function ToolWorkspace({
  toolId: initialToolId,
  variant = "default",
}: ToolWorkspaceProps) {
  const isHomeHero = variant === "homeHero";
  const { messages } = useI18n();
  const { entitlements } = useAuth();
  const { entries, files, loading, addFiles, removeFile, clearAll } = useWorkspaceFiles();
  const { activeToolId, activeTool, navigateToTool } = useWorkspaceNavigation(initialToolId);
  const [pdfOrder, setPdfOrder] = useState<File[]>([]);
  const [mergeOrderFrozen, setMergeOrderFrozen] = useState(false);
  const [compareReviewMode, setCompareReviewMode] = useState(false);

  const isCompareTool = activeToolId === "pdf-compare";
  const hideWorkspaceChrome = isCompareTool && compareReviewMode;
  
  // If we're on the home page and have files but no active tool, we suggest tools instead of showing a panel.
  const isSuggestingTools = isHomeHero && entries.length > 0 && !activeToolId;

  const uploadConfig = activeToolId ? TOOL_UPLOAD_CONFIG[activeToolId] : TOOL_UPLOAD_CONFIG["pdf-compare"];
  const pdfFiles = getPdfFiles(files);
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

  const renderToolPanel = () => {
    if (!activeToolId) {
      if (isSuggestingTools) {
        return (
          <div className="workspace-suggestions">
            <h3>Suggested next steps</h3>
            <p>Select a tool to process your {entries.length === 1 ? "file" : "files"}</p>
            <div className="workspace-suggestions-grid">
              {entries.length >= 2 ? (
                <>
                  <button className="btn btn-primary" onClick={() => navigateToTool("pdf-compare")}>Compare PDFs</button>
                  <button className="btn btn-secondary" onClick={() => navigateToTool("arrange-merge")}>Merge PDFs</button>
                </>
              ) : (
                <>
                  <button className="btn btn-secondary" onClick={() => navigateToTool("compress-pdf")}>Compress PDF</button>
                  <button className="btn btn-secondary" onClick={() => navigateToTool("convert-extract")}>Convert to Word</button>
                  <button className="btn btn-secondary" onClick={() => navigateToTool("split")}>Split PDF</button>
                  <button className="btn btn-secondary" onClick={() => navigateToTool("sign-pdf")}>Sign PDF</button>
                </>
              )}
            </div>
          </div>
        );
      }
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
          <ComparePanel pdfFiles={pdfFiles} onReviewModeChange={setCompareReviewMode} />
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
          }${isHomeHero ? " workspace--home-hero" : ""}${
            hideWorkspaceChrome ? " workspace--compare-review" : ""
          }`}
          id="workspace"
        >
          {!hideWorkspaceChrome && !isHomeHero && toolCopy && (
            <div className="section-heading workspace-heading">
              <h2>{toolCopy.name}</h2>
              <p>{toolCopy.description}</p>
            </div>
          )}

          {!hideWorkspaceChrome && isHomeHero && (
            <WorkspaceFileTray
              variant="hero"
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

          {(!isHomeHero || entries.length > 0) && (
            <div
              className={`workspace-layout${
                isHomeHero ? " workspace-layout--home-hero" : ""
              }${hideWorkspaceChrome ? " workspace-layout--compare-review" : ""}`}
            >
              <div className="workspace-action-column">{renderToolPanel()}</div>

              {!hideWorkspaceChrome && !isHomeHero && (
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
          )}
        </section>
      </div>
    </WorkspaceNavProvider>
  );
}
