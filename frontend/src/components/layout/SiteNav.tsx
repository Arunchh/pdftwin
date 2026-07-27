import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import {
  CATEGORY_ORDER,
  SUBCATEGORY_ORDER,
  TOOLS,
  toolPath,
  toolsInSubcategory,
  type ToolCategory,
} from "../../config/tools";
import LanguageSwitcher from "../../i18n/LanguageSwitcher";
import { useI18n } from "../../i18n/I18nProvider";

export default function SiteNav() {
  const { locale, messages, localizePath } = useI18n();
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

  const renderNavTools = (category: ToolCategory) => {
    const subcategories = SUBCATEGORY_ORDER[category];

    if (!subcategories) {
      return (
        <ul className="site-nav-dropdown-grid">
          {TOOLS.filter((tool) => tool.category === category).map((tool) => {
            const Icon = tool.icon;
            const copy = messages.tools[tool.id];

            return (
              <li key={tool.id}>
                <a
                  href={toolPath(tool.id, locale)}
                  className="site-nav-tool-link"
                  onClick={closeMobile}
                >
                  <span className={`site-nav-tool-icon site-nav-tool-icon--${category}`}>
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  <span className="site-nav-tool-copy">
                    <strong>{copy.shortLabel}</strong>
                    <small>{copy.description}</small>
                  </span>
                </a>
              </li>
            );
          })}
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
            {tools.map((tool) => {
              const Icon = tool.icon;
              const copy = messages.tools[tool.id];

              return (
                <li key={tool.id}>
                  <a
                    href={toolPath(tool.id, locale)}
                    className="site-nav-tool-link"
                    onClick={closeMobile}
                  >
                    <span className={`site-nav-tool-icon site-nav-tool-icon--${category}`}>
                      <Icon size={18} strokeWidth={1.75} />
                    </span>
                    <span className="site-nav-tool-copy">
                      <strong>{copy.shortLabel}</strong>
                      <small>{copy.description}</small>
                    </span>
                  </a>
                </li>
              );
            })}
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

        <div className="site-nav-language">
          <LanguageSwitcher variant="nav" />
        </div>
      </nav>
    </>
  );
}
