import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import FileDropzone from "./components/FileDropzone";
import IconButton from "./components/IconButton";
import ConvertExtractPanel from "./components/ConvertExtractPanel";
import ArrangeMergePanel from "./components/ArrangeMergePanel";
import SplitPanel from "./components/SplitPanel";
import ExtractPagesPanel from "./components/ExtractPagesPanel";
import LockUnlockPanel from "./components/LockUnlockPanel";
import SiteHeader from "./components/layout/SiteHeader";
import SiteFooter from "./components/layout/SiteFooter";
import HeroSection from "./components/layout/HeroSection";
import TrustBar from "./components/layout/TrustBar";
import ToolGrid from "./components/layout/ToolGrid";
import WorkspaceToolSwitcher from "./components/layout/WorkspaceToolSwitcher";
import PricingSection from "./components/layout/PricingSection";
import ProCheckoutModal from "./components/payments/ProCheckoutModal";
import SeoStructuredData from "./components/SeoStructuredData";
import { toolById } from "./config/tools";
import { formatFileLimit, FREE_FILE_LIMIT_MB } from "./config/limits";
import { useHashRoute } from "./hooks/useHashRoute";
import { useProCheckout } from "./hooks/useProCheckout";
import { defaultPdfOrder, reconcilePdfOrder } from "./utils/files";

export type { ToolId } from "./config/tools";

export default function App() {
  const { tool, section, selectTool, goHome, goPricing } = useHashRoute();
  const checkout = useProCheckout();
  const workspaceRef = useRef<HTMLElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [pdfOrder, setPdfOrder] = useState<File[]>([]);
  const [mergeOrderFrozen, setMergeOrderFrozen] = useState(false);

  useEffect(() => {
    setPdfOrder((current) => reconcilePdfOrder(current, files));
  }, [files]);

  useEffect(() => {
    if (defaultPdfOrder(files).length < 2) {
      setMergeOrderFrozen(false);
    }
  }, [files]);

  useEffect(() => {
    if (section === "pricing") {
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [section]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split("?")[1] ?? "");
    if (params.get("checkout") === "pro") {
      checkout.openCheckout();
    }
  }, [checkout.openCheckout]);

  const scrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSelectTool = (toolId: Parameters<typeof selectTool>[0]) => {
    selectTool(toolId);
    requestAnimationFrame(scrollToWorkspace);
  };

  const handleMergedFile = (file: File) => {
    setFiles((current) => [...current, file]);
  };

  const inWorkspace = section === "tools";

  const handleFilesChange = (nextFiles: File[]) => {
    setFiles(nextFiles);
    if (!nextFiles.length) {
      setPdfOrder([]);
      setMergeOrderFrozen(false);
    }
  };

  const handleUpgrade = () => {
    goPricing();
    requestAnimationFrame(() => checkout.openCheckout());
  };

  const activeTool = toolById(tool);

  return (
    <div className={`site ${inWorkspace ? "site--focused" : ""}`}>
      <SeoStructuredData />
      <SiteHeader
        onLogoClick={() => {
          goHome();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onPricingClick={goPricing}
        onUpgradeClick={handleUpgrade}
        activeToolLabel={inWorkspace ? activeTool.name : undefined}
      />

      <main className="site-main">
        {!inWorkspace && (
          <>
            <HeroSection onGetStarted={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })} />
            <TrustBar />
          </>
        )}
        {!inWorkspace && <ToolGrid activeTool={tool} onSelectTool={handleSelectTool} />}

        <section className="workspace" ref={workspaceRef} id="workspace">
          <div className="section-heading workspace-heading">
            <h2>{activeTool.name}</h2>
            <p>{activeTool.description}</p>
          </div>

          <WorkspaceToolSwitcher
            activeTool={tool}
            onSelectTool={handleSelectTool}
            onBrowseAll={
              inWorkspace
                ? () => {
                    goHome();
                    requestAnimationFrame(() =>
                      document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })
                    );
                  }
                : undefined
            }
          />

          <div className="panel upload-section">
            <div className="workspace-upload-header">
              <div>
                <h3>Upload PDFs</h3>
                <p className="description">
                  Drop your files once — every tool in this workspace shares the same upload.
                </p>
              </div>
              <span className="workspace-limit">Free · up to {formatFileLimit(FREE_FILE_LIMIT_MB)} per file</span>
            </div>

            <FileDropzone
              files={files}
              onFilesChange={handleFilesChange}
              accept=".pdf"
              hint={`PDF only · up to ${formatFileLimit(FREE_FILE_LIMIT_MB)} per file on Free`}
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

          {tool === "convert-extract" && <ConvertExtractPanel files={files} />}
          {tool === "arrange-merge" && (
            <ArrangeMergePanel
              files={files}
              pdfOrder={pdfOrder}
              onPdfOrderChange={setPdfOrder}
              orderFrozen={mergeOrderFrozen}
              onOrderFrozenChange={setMergeOrderFrozen}
              onMergedFile={handleMergedFile}
              onConvertMerged={() => handleSelectTool("convert-extract")}
            />
          )}
          {tool === "split" && <SplitPanel files={files} />}
          {tool === "extract-pages" && <ExtractPagesPanel files={files} />}
          {tool === "lock-unlock" && <LockUnlockPanel files={files} />}
        </section>

        <PricingSection onUpgrade={handleUpgrade} />
      </main>

      <SiteFooter onUpgradeClick={handleUpgrade} />

      <ProCheckoutModal
        open={checkout.open}
        step={checkout.step}
        termsAccepted={checkout.termsAccepted}
        error={checkout.error}
        onClose={checkout.closeCheckout}
        onTermsChange={checkout.setTermsAccepted}
        onContinueToConfirm={checkout.goToConfirm}
        onContinueToPay={checkout.goToPay}
        onPayWithPayPal={checkout.startPayPalCheckout}
        onCancelCheckout={checkout.handleCancelCheckout}
        onBackFromConfirm={() => checkout.setStep("plan")}
        onBackFromPay={() => checkout.setStep("confirm")}
        onRetryCheckout={() => checkout.setStep("plan")}
      />
    </div>
  );
}
