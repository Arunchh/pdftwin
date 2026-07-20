import type { ToolId } from "../../config/tools";
import { TOOLS } from "../../config/tools";

interface WorkspaceToolSwitcherProps {
  activeTool: ToolId;
  onSelectTool: (toolId: ToolId) => void;
  onBrowseAll?: () => void;
}

export default function WorkspaceToolSwitcher({
  activeTool,
  onSelectTool,
  onBrowseAll,
}: WorkspaceToolSwitcherProps) {
  return (
    <div className="workspace-tool-switcher" role="tablist" aria-label="PDF tools">
      {TOOLS.map((tool) => {
        const Icon = tool.icon;
        const isActive = tool.id === activeTool;

        return (
          <button
            key={tool.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`workspace-tool-tab ${isActive ? "active" : ""}`}
            onClick={() => onSelectTool(tool.id)}
            title={tool.description}
          >
            <Icon size={16} />
            <span className="workspace-tool-tab-label">{tool.shortLabel}</span>
          </button>
        );
      })}
      {onBrowseAll && (
        <button type="button" className="workspace-tool-browse" onClick={onBrowseAll}>
          All tools
        </button>
      )}
    </div>
  );
}
