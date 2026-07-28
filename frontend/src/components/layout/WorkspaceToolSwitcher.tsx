import { FileStack, FileText } from "lucide-react";
import {
  WORKSPACE_CATEGORY_ORDER,
  INPUT_SCOPE_ORDER,
  SINGLE_PDF_SUBCATEGORY_ORDER,
  SUBCATEGORY_ORDER,
  TOOLS,
  singlePdfToolsInSubcategory,
  toolById,
  toolPath,
  toolsInScope,
  toolsInSubcategory,
  type ToolCategory,
  type ToolId,
} from "../../config/tools";
import { useI18n } from "../../i18n/I18nProvider";
import type { Locale } from "../../i18n/types";

interface WorkspaceToolSwitcherProps {
  activeTool: ToolId;
  onNavigate: (toolId: ToolId) => void;
}

function firstToolInCategory(category: ToolCategory): ToolId {
  return TOOLS.find((tool) => tool.category === category)?.id ?? TOOLS[0].id;
}

export default function WorkspaceToolSwitcher({
  activeTool,
  onNavigate,
}: WorkspaceToolSwitcherProps) {
  const { locale, messages } = useI18n();
  const active = toolById(activeTool);
  const activeCategory = active.category;

  const categoryLabels: Record<ToolCategory, string> = {
    "pdf-from": messages.toolGrid.categories["pdf-from"],
    "to-pdf": messages.toolGrid.categories["to-pdf"],
    "pdf-ops": messages.toolGrid.categories["pdf-ops"],
  };

  const renderToolTab = (tool: (typeof TOOLS)[number]) => {
    const Icon = tool.icon;
    const isActive = tool.id === activeTool;
    const copy = messages.tools[tool.id];

    return (
      <button
        key={tool.id}
        type="button"
        role="tab"
        aria-selected={isActive}
        className={`workspace-tool-tab workspace-tool-tab--${tool.category} workspace-tool-tab--scope-${tool.inputScope ?? "none"} ${isActive ? "active" : ""}`}
        title={copy.description}
        onClick={() => onNavigate(tool.id)}
      >
        <Icon size={16} />
        <span className="workspace-tool-tab-label">{copy.shortLabel}</span>
        {tool.inputScope && (
          <span className={`workspace-tool-tab-scope workspace-tool-tab-scope--${tool.inputScope}`}>
            {messages.toolGrid.inputScopeBadges[tool.inputScope]}
          </span>
        )}
      </button>
    );
  };

  const renderPdfOpsTabs = () =>
    INPUT_SCOPE_ORDER.flatMap((scope) => {
      const scopeCopy = messages.toolGrid.inputScopes[scope];
      const ScopeIcon = scope === "single" ? FileText : FileStack;

      const scopeHeader = (
        <span key={`scope-${scope}`} className={`workspace-tool-scope-label workspace-tool-scope-label--${scope}`}>
          <ScopeIcon size={12} strokeWidth={2} aria-hidden="true" />
          {scopeCopy.title}
        </span>
      );

      if (scope === "single") {
        return [
          scopeHeader,
          ...SINGLE_PDF_SUBCATEGORY_ORDER.flatMap((subcategory) => {
            const tools = singlePdfToolsInSubcategory(subcategory);
            if (!tools.length) return [];

            return [
              <span key={`label-${subcategory}`} className="workspace-tool-subcategory-label">
                {messages.toolGrid.subcategories[subcategory]}
              </span>,
              ...tools.map((tool) => renderToolTab(tool)),
            ];
          }),
        ];
      }

      return [scopeHeader, ...toolsInScope("pdf-ops", "multi").map((tool) => renderToolTab(tool))];
    });

  const renderToolTabs = () => {
    if (activeCategory === "pdf-ops") {
      return renderPdfOpsTabs();
    }

    const subcategories = SUBCATEGORY_ORDER[activeCategory];

    if (!subcategories) {
      return TOOLS.filter((tool) => tool.category === activeCategory).map((tool) =>
        renderToolTab(tool),
      );
    }

    return subcategories.flatMap((subcategory) => {
      const tools = toolsInSubcategory(activeCategory, subcategory);
      if (!tools.length) return [];

      return [
        <span key={`label-${subcategory}`} className="workspace-tool-subcategory-label">
          {messages.toolGrid.subcategories[subcategory]}
        </span>,
        ...tools.map((tool) => renderToolTab(tool)),
      ];
    });
  };

  return (
    <nav className="workspace-nav" aria-label="Tool navigation">
      <div className="workspace-category-tabs" role="tablist" aria-label="Tool categories">
        {WORKSPACE_CATEGORY_ORDER.map((category) => {
          const isActive = category === activeCategory;
          const targetTool = firstToolInCategory(category);

          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`workspace-category-tab workspace-category-tab--${category} ${isActive ? "active" : ""}`}
              onClick={() => onNavigate(targetTool)}
            >
              {categoryLabels[category]}
            </button>
          );
        })}
        <a href={locale === "en" ? "/#tools" : `/${locale}/#tools`} className="workspace-tool-browse">
          All tools
        </a>
      </div>

      <div
        className={`workspace-tool-switcher${activeCategory === "pdf-ops" ? " workspace-tool-switcher--scoped" : ""}`}
        role="tablist"
        aria-label={`${categoryLabels[activeCategory]} tools`}
      >
        {renderToolTabs()}
      </div>
    </nav>
  );
}

/** Fallback href for no-JS and SEO — kept on tool pages via static routes. */
export function workspaceToolHref(toolId: ToolId, locale: Locale = "en") {
  return toolPath(toolId, locale);
}
