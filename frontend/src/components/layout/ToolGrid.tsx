import { TOOLS, toolPath, type ToolCategory } from "../../config/tools";
import { useI18n } from "../../i18n/I18nProvider";

const CATEGORY_ORDER: ToolCategory[] = ["convert", "organize", "security"];

export default function ToolGrid() {
  const { locale, messages } = useI18n();

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
          <div className="tool-grid">
            {TOOLS.filter((tool) => tool.category === category).map((tool) => {
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
        </div>
      ))}
    </section>
  );
}
