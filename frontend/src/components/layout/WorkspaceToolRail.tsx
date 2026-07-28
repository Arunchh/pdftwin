import {
  SINGLE_PDF_SUBCATEGORY_ORDER,
  singlePdfToolsInSubcategory,
  type ToolId,
} from "../../config/tools";
import { useI18n } from "../../i18n/I18nProvider";

interface WorkspaceToolRailProps {
  activeTool: ToolId;
  onNavigate: (toolId: ToolId) => void;
}

export default function WorkspaceToolRail({ activeTool, onNavigate }: WorkspaceToolRailProps) {
  const { messages } = useI18n();
  const scopeLabel = messages.toolGrid.inputScopes.single.title;

  return (
    <aside className="workspace-tool-rail" aria-label={scopeLabel}>
      {SINGLE_PDF_SUBCATEGORY_ORDER.map((subcategory, groupIndex) => {
        const tools = singlePdfToolsInSubcategory(subcategory);
        if (!tools.length) return null;

        return (
          <div key={subcategory} className="workspace-tool-rail-group">
            {groupIndex > 0 && (
              <div className="workspace-tool-rail-divider" role="separator" aria-hidden="true" />
            )}
            <p className="workspace-tool-rail-group-label sr-only">
              {messages.toolGrid.subcategories[subcategory]}
            </p>
            {tools.map((tool) => {
              const Icon = tool.icon;
              const copy = messages.tools[tool.id];
              const isActive = tool.id === activeTool;

              return (
                <button
                  key={tool.id}
                  type="button"
                  className={`workspace-tool-rail-btn workspace-tool-rail-btn--${tool.subcategory ?? "default"} ${isActive ? "active" : ""}`}
                  title={`${copy.shortLabel} — ${copy.description}`}
                  aria-label={copy.name}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => onNavigate(tool.id)}
                >
                  <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                  <span className="workspace-tool-rail-tooltip">{copy.shortLabel}</span>
                </button>
              );
            })}
          </div>
        );
      })}
    </aside>
  );
}
