import {
  CATEGORY_ORDER,
  TOOLS,
  toolPath,
  type ToolCategory,
} from "../../config/tools";
import { useI18n } from "../../i18n/I18nProvider";
import ToolCardLink from "./ToolCardLink";

export default function HomeToolsSection() {
  const { messages, localizePath } = useI18n();
  const { complementary, seoTools } = messages.home;
  const featuredTools = TOOLS.filter((tool) => complementary.toolIds.includes(tool.id));

  return (
    <section className="home-tools-section" id="tools">
      <div className="section-heading">
        <h2>{complementary.heading}</h2>
        <p>{complementary.subheading}</p>
      </div>

      <div className="home-tools-grid">
        {featuredTools.map((tool) => (
          <ToolCardLink key={tool.id} tool={tool} />
        ))}
      </div>

      <div className="home-seo-tools">
        <div className="section-heading">
          <h2>{seoTools.heading}</h2>
          <p>{seoTools.subheading}</p>
        </div>

        <nav className="home-seo-tools-nav" aria-label={seoTools.heading}>
          {CATEGORY_ORDER.map((category) => (
            <HomeSeoCategoryLinks key={category} category={category} />
          ))}
        </nav>

        <div className="home-tools-footer-links">
          <a href={localizePath("/formats")}>{messages.nav.formats}</a>
          <a href={localizePath("/guides/compare-pdf-online")}>{messages.hero.seeCompareGuide}</a>
          <a href={localizePath("/pricing")}>{messages.nav.pricing}</a>
        </div>
      </div>
    </section>
  );
}

function HomeSeoCategoryLinks({ category }: { category: ToolCategory }) {
  const { locale, messages } = useI18n();
  const categoryTools = TOOLS.filter((tool) => tool.category === category);

  return (
    <div className={`home-seo-tools-group home-seo-tools-group--${category}`}>
      <h3>{messages.toolGrid.categories[category]}</h3>
      <ul>
        {categoryTools.map((tool) => (
          <li key={tool.id}>
            <a href={toolPath(tool.id, locale)}>{messages.tools[tool.id].name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
