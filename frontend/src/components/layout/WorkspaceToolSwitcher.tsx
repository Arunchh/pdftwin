import type { ToolCategory, ToolId } from "../../config/tools";
import { TOOLS, toolById, toolPath } from "../../config/tools";
import { useI18n } from "../../i18n/I18nProvider";

const CATEGORY_ORDER: ToolCategory[] = ["convert", "organize", "security"];

interface WorkspaceToolSwitcherProps {
  activeTool: ToolId;
}

function firstToolInCategory(category: ToolCategory): ToolId {
  return TOOLS.find((tool) => tool.category === category)?.id ?? TOOLS[0].id;
}

export default function WorkspaceToolSwitcher({ activeTool }: WorkspaceToolSwitcherProps) {
  const { locale, messages } = useI18n();
  const active = toolById(activeTool);
  const activeCategory = active.category;

  const categoryLabels: Record<ToolCategory, string> = {
    convert: messages.toolGrid.categories.convert,
    organize: messages.toolGrid.categories.organize,
    security: messages.toolGrid.categories.security,
  };

  const categoryTools = TOOLS.filter((tool) => tool.category === activeCategory);

  return (
    <nav className="workspace-nav" aria-label="Tool navigation">
      <div className="workspace-category-tabs" role="tablist" aria-label="Tool categories">
        {CATEGORY_ORDER.map((category) => {
          const isActive = category === activeCategory;
          const href = toolPath(firstToolInCategory(category), locale);

          return (
            <a
              key={category}
              href={href}
              role="tab"
              aria-selected={isActive}
              className={`workspace-category-tab workspace-category-tab--${category} ${isActive ? "active" : ""}`}
            >
              {categoryLabels[category]}
            </a>
          );
        })}
        <a href={locale === "en" ? "/#tools" : `/${locale}/#tools`} className="workspace-tool-browse">
          All tools
        </a>
      </div>

      <div className="workspace-tool-switcher" role="tablist" aria-label={`${categoryLabels[activeCategory]} tools`}>
        {categoryTools.map((tool) => {
          const Icon = tool.icon;
          const isActive = tool.id === activeTool;
          const copy = messages.tools[tool.id];

          return (
            <a
              key={tool.id}
              href={toolPath(tool.id, locale)}
              role="tab"
              aria-selected={isActive}
              className={`workspace-tool-tab workspace-tool-tab--${tool.category} ${isActive ? "active" : ""}`}
              title={copy.description}
            >
              <Icon size={16} />
              <span className="workspace-tool-tab-label">{copy.shortLabel}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
