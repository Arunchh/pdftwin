import { useEffect, useState } from "react";
import { ChevronDown, FileStack, FileText, Menu, X } from "lucide-react";
import {
  CATEGORY_ORDER,
  INPUT_SCOPE_ORDER,
  SINGLE_PDF_SUBCATEGORY_ORDER,
  SUBCATEGORY_ORDER,
  TOOLS,
  singlePdfToolsInSubcategory,
  toolPath,
  toolsInScope,
  toolsInSubcategory,
  type InputScope,
  type ToolCategory,
} from "../../config/tools";
import LanguageSwitcher from "../../i18n/LanguageSwitcher";
import { useI18n } from "../../i18n/I18nProvider";

function NavToolLink({
  tool,
  category,
  onNavigate,
}: {
  tool: (typeof TOOLS)[number];
  category: ToolCategory;
  onNavigate: () => void;
}) {
  const { locale, messages } = useI18n();
  const Icon = tool.icon;
  const copy = messages.tools[tool.id];

  return (
    <li>
      <a href={toolPath(tool.id, locale)} className="site-nav-tool-link" onClick={onNavigate}>
        <span className={`site-nav-tool-icon site-nav-tool-icon--${category}`}>
          <Icon size={18} strokeWidth={1.75} />
        </span>
        <span className="site-nav-tool-copy">
          <strong>{copy.shortLabel}</strong>
          <small>{copy.description}</small>
        </span>
        {tool.inputScope && (
          <span className={`site-nav-tool-scope site-nav-tool-scope--${tool.inputScope}`}>
            {messages.toolGrid.inputScopeBadges[tool.inputScope]}
          </span>
        )}
      </a>
    </li>
  );
}

export default function SiteNav() {
  const { messages, localizePath } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<ToolCategory | null>(null);

  useEffect(() => {
    if (!mobileOpen) {
      setExpandedCategory(null);
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const toggleCategory = (category: ToolCategory) => {
    if (!window.matchMedia("(max-width: 900px)").matches) return;
    setExpandedCategory((current) => (current === category ? null : category));
  };

  const navLabels = {
    "pdf-from": messages.nav.pdfFrom,
    "to-pdf": messages.nav.toPdf,
    "pdf-ops": messages.nav.pdfOps,
  };

  const renderScopeBlock = (category: ToolCategory, scope: InputScope) => {
    const scopeCopy = messages.toolGrid.inputScopes[scope];
    const ScopeIcon = scope === "single" ? FileText : FileStack;

    return (
      <div key={scope} className={`site-nav-scope-block site-nav-scope-block--${scope}`}>
        <p className="site-nav-scope-label">
          <ScopeIcon size={13} strokeWidth={2} aria-hidden="true" />
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
              <div key={subcategory} className="site-nav-subcategory">
                <p className="site-nav-subcategory-label">
                  {messages.toolGrid.subcategories[subcategory]}
                </p>
                <ul className="site-nav-dropdown-grid">
                  {tools.map((tool) => (
                    <NavToolLink
                      key={tool.id}
                      tool={tool}
                      category={category}
                      onNavigate={closeMobile}
                    />
                  ))}
                </ul>
              </div>
            );
          })
        ) : (
          <ul className="site-nav-dropdown-grid">
            {toolsInScope(category, scope).map((tool) => (
              <NavToolLink
                key={tool.id}
                tool={tool}
                category={category}
                onNavigate={closeMobile}
              />
            ))}
          </ul>
        )}
      </div>
    );
  };

  const renderNavTools = (category: ToolCategory) => {
    if (category === "pdf-ops") {
      return INPUT_SCOPE_ORDER.map((scope) => renderScopeBlock(category, scope));
    }

    const subcategories = SUBCATEGORY_ORDER[category];

    if (!subcategories) {
      return (
        <ul className="site-nav-dropdown-grid">
          {TOOLS.filter((tool) => tool.category === category).map((tool) => (
            <NavToolLink
              key={tool.id}
              tool={tool}
              category={category}
              onNavigate={closeMobile}
            />
          ))}
        </ul>
      );
    }

    return subcategories.map((subcategory) => {
      const tools = toolsInSubcategory(category, subcategory);
      if (!tools.length) return null;

      return (
        <div key={subcategory} className="site-nav-subcategory">
          <p className="site-nav-subcategory-label">{messages.toolGrid.subcategories[subcategory]}</p>
          <ul className="site-nav-dropdown-grid">
            {tools.map((tool) => (
              <NavToolLink
                key={tool.id}
                tool={tool}
                category={category}
                onNavigate={closeMobile}
              />
            ))}
          </ul>
        </div>
      );
    });
  };

  return (
    <>
      <button
        type="button"
        className="site-nav-toggle"
        aria-expanded={mobileOpen}
        aria-controls="site-nav-panel"
        aria-label={mobileOpen ? messages.nav.closeMenu : messages.nav.openMenu}
        onClick={() => setMobileOpen((open) => !open)}
      >
        {mobileOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
      </button>

      {mobileOpen && (
        <button
          type="button"
          className="site-nav-backdrop"
          aria-label={messages.nav.closeMenu}
          onClick={closeMobile}
        />
      )}

      <nav
        className={`site-nav ${mobileOpen ? "site-nav--open" : ""}`}
        id="site-nav-panel"
        aria-label={messages.nav.main}
      >
        <a className="site-nav-item" href={`${localizePath("/")}#tools`} onClick={closeMobile}>
          {messages.nav.allTools}
        </a>

        {CATEGORY_ORDER.map((category) => {
          const isExpanded = expandedCategory === category;

          return (
            <div
              key={category}
              className={`site-nav-dropdown site-nav-dropdown--${category}${
                isExpanded ? " site-nav-dropdown--expanded" : ""
              }`}
            >
              <button
                type="button"
                className="site-nav-trigger"
                aria-haspopup="true"
                aria-expanded={isExpanded}
                onClick={() => toggleCategory(category)}
              >
                {navLabels[category]}
                <ChevronDown size={15} className="site-nav-chevron" aria-hidden="true" />
              </button>

              <div className="site-nav-dropdown-panel">
                <div className={`site-nav-dropdown-header site-nav-dropdown-header--${category}`}>
                  <strong>{messages.toolGrid.categories[category]}</strong>
                </div>
                {renderNavTools(category)}
              </div>
            </div>
          );
        })}

        <a className="site-nav-item" href={localizePath("/formats")} onClick={closeMobile}>
          {messages.nav.formats}
        </a>
        <a className="site-nav-item" href={localizePath("/pricing")} onClick={closeMobile}>
          {messages.nav.pricing}
        </a>

        <a
          className="site-nav-item site-nav-compare btn btn-primary btn-sm"
          href={`${localizePath("/")}#workspace`}
          onClick={closeMobile}
        >
          {messages.tools["pdf-compare"].shortLabel}
        </a>

        <div className="site-nav-language">
          <LanguageSwitcher variant="nav" />
        </div>
      </nav>
    </>
  );
}
