import { FileStack, FileText } from "lucide-react";
import {
  CATEGORY_ORDER,
  INPUT_SCOPE_ORDER,
  SINGLE_PDF_SUBCATEGORY_ORDER,
  SUBCATEGORY_ORDER,
  TOOLS,
  singlePdfToolsInSubcategory,
  toolsInScope,
  toolsInSubcategory,
  type ToolCategory,
} from "../../config/tools";
import { useI18n } from "../../i18n/I18nProvider";
import ToolCardLink from "./ToolCardLink";

function ToolCardGrid({ tools }: { tools: typeof TOOLS }) {
  return (
    <div className="tool-grid">
      {tools.map((tool) => (
        <ToolCardLink key={tool.id} tool={tool} />
      ))}
    </div>
  );
}

function PdfOpsScopeColumns() {
  const { messages } = useI18n();

  return (
    <div className="tool-scope-columns">
      {INPUT_SCOPE_ORDER.map((scope) => {
        const scopeCopy = messages.toolGrid.inputScopes[scope];
        const ScopeIcon = scope === "single" ? FileText : FileStack;

        return (
          <div key={scope} className={`tool-scope-column tool-scope-column--${scope}`}>
            <div className="tool-scope-heading">
              <span className={`tool-scope-icon tool-scope-icon--${scope}`} aria-hidden="true">
                <ScopeIcon size={18} strokeWidth={1.75} />
              </span>
              <div className="tool-scope-copy">
                <h4>{scopeCopy.title}</h4>
                <p>{scopeCopy.hint}</p>
              </div>
            </div>

            {scope === "single" ? (
              SINGLE_PDF_SUBCATEGORY_ORDER.map((subcategory) => {
                const tools = singlePdfToolsInSubcategory(subcategory);
                if (!tools.length) return null;

                return (
                  <div key={subcategory} className="tool-subcategory">
                    <div className="tool-subcategory-heading">
                      <h5>{messages.toolGrid.subcategories[subcategory]}</h5>
                    </div>
                    <ToolCardGrid tools={tools} />
                  </div>
                );
              })
            ) : (
              <ToolCardGrid tools={toolsInScope("pdf-ops", "multi")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ToolGrid() {
  const { messages } = useI18n();

  const renderCategoryTools = (category: ToolCategory) => {
    if (category === "pdf-ops") {
      return <PdfOpsScopeColumns />;
    }

    const subcategories = SUBCATEGORY_ORDER[category];

    if (!subcategories) {
      return <ToolCardGrid tools={TOOLS.filter((tool) => tool.category === category)} />;
    }

    return subcategories.map((subcategory) => {
      const tools = toolsInSubcategory(category, subcategory);
      if (!tools.length) return null;

      return (
        <div key={subcategory} className="tool-subcategory">
          <div className="tool-subcategory-heading">
            <h4>{messages.toolGrid.subcategories[subcategory]}</h4>
          </div>
          <ToolCardGrid tools={tools} />
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
