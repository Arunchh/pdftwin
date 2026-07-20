import { TOOL_CATEGORIES, TOOLS, toolPath, type ToolCategory } from "../../config/tools";

const CATEGORY_ORDER: ToolCategory[] = ["convert", "organize", "security"];

const CATEGORY_HINTS: Record<ToolCategory, string> = {
  convert: "Turn PDFs and images into the formats your team delivers to clients",
  organize: "Combine, split, compare, and pull pages from business documents",
  security: "Protect confidential contracts and financial files",
};

export default function ToolGrid() {
  return (
    <section className="tool-grid-section" id="tools">
      <div className="section-heading">
        <h2>One upload, every business format</h2>
        <p>
          Pick a tool below and upload once. Switch between PDF and image tasks without starting
          over.
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

              return (
                <a
                  key={tool.id}
                  href={toolPath(tool.id)}
                  className={`tool-card tool-card--${tool.category}`}
                >
                  <span className="tool-card-icon">
                    <Icon size={22} />
                  </span>
                  <span className="tool-card-body">
                    <strong>{tool.name}</strong>
                    <span>{tool.description}</span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
