import {
  CATEGORY_ORDER,
  SUBCATEGORY_ORDER,
  TOOLS,
  toolPath,
  toolsInSubcategory,
  type ToolCategory,
} from "../../config/tools";
import { useI18n } from "../../i18n/I18nProvider";

function ToolCards({ tools }: { tools: typeof TOOLS }) {
  const { locale, messages } = useI18n();

  return (
    <div className="tool-grid">
      {tools.map((tool) => {
        const Icon = tool.icon;
        const copy = messages.tools[tool.id];

        return (
          <a
            key={tool.id}
            href={toolPath(tool.id, locale)}
            className={`tool-card tool-card--${tool.category}`}
            title={copy.description}
          >
            <span className="tool-card-icon">
              <Icon size={28} strokeWidth={1.75} />
            </span>
            <span className="tool-card-label">{copy.shortLabel}</span>
          </a>
        );
      })}
    </div>
  );
}

export default function ToolGrid() {
  const { messages } = useI18n();

  const renderCategoryTools = (category: ToolCategory) => {
    const subcategories = SUBCATEGORY_ORDER[category];

    if (!subcategories) {
      return <ToolCards tools={TOOLS.filter((tool) => tool.category === category)} />;
    }

    return subcategories.map((subcategory) => {
      const tools = toolsInSubcategory(category, subcategory);
      if (!tools.length) return null;

      return (
        <div key={subcategory} className="tool-subcategory">
          <div className="tool-subcategory-heading">
            <h4>{messages.toolGrid.subcategories[subcategory]}</h4>
          </div>
          <ToolCards tools={tools} />
        </div>
      );
    });
  };

  return (
    <section className="tool-grid-section" id="tools">
      <div className="section-heading">
        <h2>{messages.toolGrid.heading}</h2>
        <p>{messages.toolGrid.subheading}</p>
      </div>

      {CATEGORY_ORDER.map((category) => (
        <div key={category} className={`tool-category tool-category--${category}`}>
          <div className="tool-category-heading">
            <h3>{messages.toolGrid.categories[category]}</h3>
            <p>{messages.toolGrid.categoryHints[category]}</p>
          </div>
          {renderCategoryTools(category)}
        </div>
      ))}
    </section>
  );
}
