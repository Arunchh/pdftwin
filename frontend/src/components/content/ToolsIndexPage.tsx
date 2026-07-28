import { FileStack, FileText } from "lucide-react";
import {
  INPUT_SCOPE_ORDER,
  SINGLE_PDF_SUBCATEGORY_ORDER,
  SUBCATEGORY_ORDER,
  TOOLS,
  WORKSPACE_CATEGORY_ORDER,
  singlePdfToolsInSubcategory,
  toolPath,
  toolsInScope,
  toolsInSubcategory,
  type InputScope,
  type ToolCategory,
} from "../../config/tools";
import { useI18n } from "../../i18n/I18nProvider";

function ToolIndexLink({
  tool,
  category,
}: {
  tool: (typeof TOOLS)[number];
  category: ToolCategory;
}) {
  const { locale, messages } = useI18n();
  const Icon = tool.icon;
  const copy = messages.tools[tool.id];

  return (
    <li>
      <a href={toolPath(tool.id, locale)} className="tools-index-tool-link">
        <span className={`tools-index-tool-icon tools-index-tool-icon--${category}`}>
          <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <span className="tools-index-tool-copy">
          <strong>{copy.name}</strong>
          <small>{copy.description}</small>
        </span>
        {tool.inputScope && (
          <span className={`tools-index-tool-scope tools-index-tool-scope--${tool.inputScope}`}>
            {messages.toolGrid.inputScopeBadges[tool.inputScope]}
          </span>
        )}
      </a>
    </li>
  );
}

export default function ToolsIndexPage() {
  const { messages, localizePath } = useI18n();
  const { toolsIndex } = messages;
  const navLabels = {
    "pdf-from": messages.nav.pdfFrom,
    "to-pdf": messages.nav.toPdf,
    "pdf-ops": messages.nav.pdfOps,
  };

  const renderScopeBlock = (category: ToolCategory, scope: InputScope) => {
    const scopeCopy = messages.toolGrid.inputScopes[scope];
    const ScopeIcon = scope === "single" ? FileText : FileStack;

    return (
      <div key={scope} className={`tools-index-scope-block tools-index-scope-block--${scope}`}>
        <p className="tools-index-scope-label">
          <ScopeIcon size={15} strokeWidth={2} aria-hidden="true" />
          <span>
            <strong>{scopeCopy.title}</strong>
            <small>{scopeCopy.hint}</small>
          </span>
        </p>

        {scope === "single" && category === "pdf-ops" ? (
          SINGLE_PDF_SUBCATEGORY_ORDER.map((subcategory) => {
            const tools = singlePdfToolsInSubcategory(subcategory);
            if (!tools.length) return null;

            return (
              <div key={subcategory} className="tools-index-subcategory">
                <p className="tools-index-subcategory-label">
                  {messages.toolGrid.subcategories[subcategory]}
                </p>
                <ul className="tools-index-tool-list">
                  {tools.map((tool) => (
                    <ToolIndexLink key={tool.id} tool={tool} category={category} />
                  ))}
                </ul>
              </div>
            );
          })
        ) : (
          <ul className="tools-index-tool-list">
            {toolsInScope(category, scope).map((tool) => (
              <ToolIndexLink key={tool.id} tool={tool} category={category} />
            ))}
          </ul>
        )}
      </div>
    );
  };

  const renderCategoryTools = (category: ToolCategory) => {
    if (category === "pdf-ops") {
      return INPUT_SCOPE_ORDER.map((scope) => renderScopeBlock(category, scope));
    }

    const subcategories = SUBCATEGORY_ORDER[category];

    if (!subcategories) {
      return (
        <ul className="tools-index-tool-list">
          {TOOLS.filter((tool) => tool.category === category).map((tool) => (
            <ToolIndexLink key={tool.id} tool={tool} category={category} />
          ))}
        </ul>
      );
    }

    return subcategories.map((subcategory) => {
      const tools = toolsInSubcategory(category, subcategory);
      if (!tools.length) return null;

      return (
        <div key={subcategory} className="tools-index-subcategory">
          <p className="tools-index-subcategory-label">
            {messages.toolGrid.subcategories[subcategory]}
          </p>
          <ul className="tools-index-tool-list">
            {tools.map((tool) => (
              <ToolIndexLink key={tool.id} tool={tool} category={category} />
            ))}
          </ul>
        </div>
      );
    });
  };

  return (
    <article className="tools-index-page">
      <header className="tools-index-header">
        <p className="tools-index-eyebrow">{messages.meta.siteName}</p>
        <h1>{toolsIndex.heading}</h1>
        <p className="tools-index-lead">{toolsIndex.subheading}</p>
        <div className="tools-index-actions">
          <a className="btn btn-primary" href={`${localizePath("/")}#workspace`}>
            {toolsIndex.compareCta}
          </a>
          <a className="btn btn-secondary" href={localizePath("/")}>
            {toolsIndex.homeCta}
          </a>
        </div>
      </header>

      <div className="tools-index-grid">
        {WORKSPACE_CATEGORY_ORDER.map((category) => (
          <section
            key={category}
            className={`tools-index-column tools-index-column--${category}`}
            aria-labelledby={`tools-index-${category}`}
          >
            <div className={`tools-index-column-header tools-index-column-header--${category}`}>
              <h2 id={`tools-index-${category}`}>{messages.toolGrid.categories[category]}</h2>
              <span>{navLabels[category]}</span>
            </div>
            {renderCategoryTools(category)}
          </section>
        ))}
      </div>

      <footer className="tools-index-footer">
        <a href={localizePath("/formats")}>{messages.nav.formats}</a>
        <a href={localizePath("/guides/compare-pdf-online")}>{messages.hero.seeCompareGuide}</a>
        <a href={localizePath("/pricing")}>{messages.nav.pricing}</a>
      </footer>
    </article>
  );
}
