import {
  CATEGORY_ORDER,
  TOOLS,
  toolPath,
  type ToolCategory,
} from "../../config/tools";
import { useI18n } from "../../i18n/I18nProvider";

export default function HomeToolsSection() {
  const { locale, messages, localizePath } = useI18n();
  const { complementary, seoTools } = messages.home;
  const featuredTools = complementary.toolIds
    .map((toolId) => TOOLS.find((tool) => tool.id === toolId))
    .filter((tool): tool is (typeof TOOLS)[number] => Boolean(tool));

  return (
    <section className="home-tools-section" id="tools">
      <div className="section-heading">
        <h2>{complementary.heading}</h2>
        <p>{complementary.subheading}</p>
      </div>

      <nav className="home-featured-tools" aria-label={complementary.heading}>
        <ul>
          {featuredTools.map((tool) => (
            <li key={tool.id}>
              <a href={toolPath(tool.id, locale)}>{messages.tools[tool.id].name}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="home-seo-tools">
        <div className="section-heading">
          <h2>{seoTools.heading}</h2>
          <p>{seoTools.subheading}</p>
          <p className="home-tools-index-link">
            <a href={localizePath("/tools")}>{messages.nav.browseToolIndex}</a>
          </p>
        </div>

        <nav className="home-seo-tools-nav" aria-label={seoTools.heading}>
          {CATEGORY_ORDER.map((category) => (
            <HomeSeoCategoryLinks key={category} category={category} />
          ))}
        </nav>

        <div className="home-tools-footer-links">
          <a href="#formats">{messages.nav.formats}</a>
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
