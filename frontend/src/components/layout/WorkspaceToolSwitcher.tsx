import type { ToolId } from "../../config/tools";
import { TOOLS, toolPath } from "../../config/tools";

interface WorkspaceToolSwitcherProps {
  activeTool: ToolId;
}

export default function WorkspaceToolSwitcher({ activeTool }: WorkspaceToolSwitcherProps) {
  return (
    <div className="workspace-tool-switcher" role="tablist" aria-label="Business file tools">
      {TOOLS.map((tool) => {
        const Icon = tool.icon;
        const isActive = tool.id === activeTool;

        return (
          <a
            key={tool.id}
            href={toolPath(tool.id)}
            role="tab"
            aria-selected={isActive}
            className={`workspace-tool-tab workspace-tool-tab--${tool.category} ${isActive ? "active" : ""}`}
            title={tool.description}
          >
            <Icon size={16} />
            <span className="workspace-tool-tab-label">{tool.shortLabel}</span>
          </a>
        );
      })}
      <a href="/#tools" className="workspace-tool-browse">
        All tools
      </a>
    </div>
  );
}
