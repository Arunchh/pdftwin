import { ArrowRight, CheckCircle2, Download, X } from "lucide-react";
import type { ToolId } from "../config/tools";
import { toolPath } from "../config/tools";
import { TOOL_NEXT_STEPS } from "../config/toolNextSteps";
import { formatBytes } from "../config/limits";
import { downloadBlob } from "../api";
import { useWorkspaceNav } from "../context/WorkspaceNavContext";
import { useI18n } from "../i18n/I18nProvider";
import type { ToolResult } from "../types/toolResult";

interface ToolResultCardProps {
  toolId: ToolId;
  result: ToolResult;
  onDismiss?: () => void;
}

export default function ToolResultCard({ toolId, result, onDismiss }: ToolResultCardProps) {
  const { locale } = useI18n();
  const workspaceNav = useWorkspaceNav();
  const nextSteps = TOOL_NEXT_STEPS[toolId] ?? [];

  const handleDownload = () => {
    downloadBlob(result.blob, result.filename);
  };

  return (
    <div className="tool-result-card" role="status" aria-live="polite">
      <div className="tool-result-card-header">
        <div className="tool-result-card-title">
          <CheckCircle2 size={22} aria-hidden="true" />
          <div>
            <strong>{result.title}</strong>
            {result.detail && <p className="tool-result-card-detail">{result.detail}</p>}
          </div>
        </div>
        {onDismiss && (
          <button type="button" className="tool-result-card-dismiss" onClick={onDismiss} aria-label="Dismiss">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="tool-result-card-file">
        <span className="tool-result-card-filename">{result.filename}</span>
        <span className="tool-result-card-size">{formatBytes(result.blob.size)}</span>
      </div>

      <div className="tool-result-card-actions">
        <button type="button" className="btn btn-primary" onClick={handleDownload}>
          <Download size={18} aria-hidden="true" />
          Download
        </button>
      </div>

      {nextSteps.length > 0 && (
        <div className="tool-result-next-steps">
          <p className="tool-result-next-label">Continue with this file</p>
          <div className="tool-result-next-actions">
            {nextSteps.slice(0, 2).map((step) =>
              workspaceNav ? (
                <button
                  key={step.toolId}
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => workspaceNav.navigateToTool(step.toolId)}
                >
                  {step.label}
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              ) : (
                <a
                  key={step.toolId}
                  href={toolPath(step.toolId, locale)}
                  className="btn btn-secondary btn-sm"
                >
                  {step.label}
                  <ArrowRight size={14} aria-hidden="true" />
                </a>
              )
            )}
            {nextSteps.length > 2 && (
              workspaceNav ? (
                <button
                  key={nextSteps[2].toolId}
                  type="button"
                  className="tool-result-next-link"
                  onClick={() => workspaceNav.navigateToTool(nextSteps[2].toolId)}
                >
                  {nextSteps[2].label}
                </button>
              ) : (
                <a
                  key={nextSteps[2].toolId}
                  href={toolPath(nextSteps[2].toolId, locale)}
                  className="tool-result-next-link"
                >
                  {nextSteps[2].label}
                </a>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
