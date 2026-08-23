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

      <nav className="home-featured-tools-grid" aria-label={complementary.heading}>
        {featuredTools.map((tool) => {
          const Icon = tool.icon;
          const copy = messages.tools[tool.id];
          return (
            <a key={tool.id} href={toolPath(tool.id, locale)} className="featured-tool-card">
              <span className={`featured-tool-icon featured-tool-icon--${tool.category}`}>
                <Icon size={24} strokeWidth={1.5} />
              </span>
              <div>
                <strong>{copy.name}</strong>
                <p>{copy.description}</p>
              </div>
            </a>
          );
        })}
      </nav>
      
      <div className="home-browse-all">
        <a href={localizePath("/tools")} className="btn btn-secondary">
          {messages.nav.browseToolIndex}
        </a>
      </div>

      <div className="home-seo-tools">
        <div className="sr-only">
          <h2>{seoTools.heading}</h2>
        </div>

        <nav className="home-seo-tools-nav home-seo-tools-nav--quiet" aria-label={seoTools.heading}>
          {CATEGORY_ORDER.map((category) => (
            <HomeSeoCategoryLinks key={category} category={category} />
          ))}
        </nav>
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
