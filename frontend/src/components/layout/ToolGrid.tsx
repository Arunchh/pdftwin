import type { ToolId } from "../../config/tools";
import { TOOL_CATEGORIES, TOOLS, type ToolCategory } from "../../config/tools";

interface ToolGridProps {
  activeTool: ToolId;
  onSelectTool: (toolId: ToolId) => void;
}

const CATEGORY_ORDER: ToolCategory[] = ["convert", "organize", "security"];

const CATEGORY_HINTS: Record<ToolCategory, string> = {
  convert: "Export content from PDFs into editable formats",
  organize: "Restructure pages and combine documents",
  security: "Control who can open your files",
};

export default function ToolGrid({ activeTool, onSelectTool }: ToolGridProps) {
  return (
    <section className="tool-grid-section" id="tools">
      <div className="section-heading">
        <h2>Pick a tool, upload once</h2>
        <p>
          Every tool shares the same upload area below. Switch tasks without re-uploading your
          files.
        </p>
      </div>

      {CATEGORY_ORDER.map((category) => (
        <div key={category} className="tool-category">
          <div className="tool-category-heading">
            <h3>{TOOL_CATEGORIES[category]}</h3>
            <p>{CATEGORY_HINTS[category]}</p>
          </div>
          <div className="tool-grid">
            {TOOLS.filter((tool) => tool.category === category).map((tool) => {
              const Icon = tool.icon;
              const isActive = tool.id === activeTool;

              return (
                <button
                  key={tool.id}
                  type="button"
                  className={`tool-card ${isActive ? "active" : ""}`}
                  onClick={() => onSelectTool(tool.id)}
                >
                  <span className="tool-card-icon">
                    <Icon size={22} />
                  </span>
                  <span className="tool-card-body">
                    <strong>{tool.name}</strong>
                    <span>{tool.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
