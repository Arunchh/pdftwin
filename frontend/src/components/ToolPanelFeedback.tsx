import type { ToolId } from "../config/tools";
import type { ToolResult } from "../types/toolResult";
import ToolResultCard from "./ToolResultCard";

interface ToolPanelFeedbackProps {
  toolId: ToolId;
  error?: string | null;
  notice?: string | null;
  result?: ToolResult | null;
  onDismissResult?: () => void;
}

export default function ToolPanelFeedback({
  toolId,
  error,
  notice,
  result,
  onDismissResult,
}: ToolPanelFeedbackProps) {
  return (
    <>
      {error && <div className="message error">{error}</div>}
      {notice && <div className="message success">{notice}</div>}
      {result && (
        <ToolResultCard toolId={toolId} result={result} onDismiss={onDismissResult} />
      )}
    </>
  );
}
