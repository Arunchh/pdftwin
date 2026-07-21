import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import {
  TOOLS,
  TOOL_CATEGORIES,
  toolPath,
  type ToolCategory,
} from "../../config/tools";

const CATEGORY_ORDER: ToolCategory[] = ["convert", "organize", "security"];

const NAV_LABELS: Record<ToolCategory, string> = {
  convert: "Convert",
  organize: "Organize",
  security: "Protect",
};

export default function SiteNav() {
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

  return (
    <>
      <button
        type="button"
        className="site-nav-toggle"
        aria-expanded={mobileOpen}
        aria-controls="site-nav-panel"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        onClick={() => setMobileOpen((open) => !open)}
      >
        {mobileOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
      </button>

      {mobileOpen && (
        <button
          type="button"
          className="site-nav-backdrop"
          aria-label="Close menu"
          onClick={closeMobile}
        />
      )}

      <nav
        className={`site-nav ${mobileOpen ? "site-nav--open" : ""}`}
        id="site-nav-panel"
        aria-label="Main"
      >
        <a className="site-nav-item" href="/#tools" onClick={closeMobile}>
          All tools
        </a>

        {CATEGORY_ORDER.map((category) => {
          const tools = TOOLS.filter((tool) => tool.category === category);
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
                {NAV_LABELS[category]}
                <ChevronDown size={15} className="site-nav-chevron" aria-hidden="true" />
              </button>

              <div className="site-nav-dropdown-panel">
                <div className={`site-nav-dropdown-header site-nav-dropdown-header--${category}`}>
                  <strong>{TOOL_CATEGORIES[category]}</strong>
                </div>
                <ul className="site-nav-dropdown-grid">
                  {tools.map((tool) => {
                    const Icon = tool.icon;

                    return (
                      <li key={tool.id}>
                        <a
                          href={toolPath(tool.id)}
                          className="site-nav-tool-link"
                          onClick={closeMobile}
                        >
                          <span className={`site-nav-tool-icon site-nav-tool-icon--${category}`}>
                            <Icon size={18} strokeWidth={1.75} />
                          </span>
                          <span className="site-nav-tool-copy">
                            <strong>{tool.shortLabel}</strong>
                            <small>{tool.description}</small>
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}

        <a className="site-nav-item" href="/formats" onClick={closeMobile}>
          Formats
        </a>
        <a className="site-nav-item" href="/pricing" onClick={closeMobile}>
          Pricing
        </a>
      </nav>
    </>
  );
}
