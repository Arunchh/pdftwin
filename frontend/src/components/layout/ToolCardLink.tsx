import { FileStack, FileText } from "lucide-react";
import { toolPath, type ToolDefinition } from "../../config/tools";
import { useI18n } from "../../i18n/I18nProvider";

interface ToolCardLinkProps {
  tool: ToolDefinition;
  onClick?: () => void;
}

export default function ToolCardLink({ tool, onClick }: ToolCardLinkProps) {
  const { locale, messages } = useI18n();
  const Icon = tool.icon;
  const copy = messages.tools[tool.id];
  const scope = tool.inputScope;

  return (
    <a
      href={toolPath(tool.id, locale)}
      className={`tool-card tool-card--${tool.category}${scope ? ` tool-card--scope-${scope}` : ""}`}
      title={copy.description}
      onClick={onClick}
    >
      {scope && (
        <span className={`tool-card-input-badge tool-card-input-badge--${scope}`}>
          {scope === "single" ? (
            <FileText size={11} strokeWidth={2} aria-hidden="true" />
          ) : (
            <FileStack size={11} strokeWidth={2} aria-hidden="true" />
          )}
          {messages.toolGrid.inputScopeBadges[scope]}
        </span>
      )}
      <span className="tool-card-icon">
        <Icon size={28} strokeWidth={1.75} />
      </span>
      <span className="tool-card-label">{copy.shortLabel}</span>
    </a>
  );
}
