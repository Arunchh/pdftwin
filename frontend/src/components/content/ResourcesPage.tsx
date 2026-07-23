import { ArrowRight, Monitor, Server } from "lucide-react";
import {
  CLIENT_TOOLS,
  RESOURCES_META,
  RESOURCES_SECTIONS,
  SERVER_TOOLS,
} from "../../content/resources";
import { useI18n } from "../../i18n/I18nProvider";

export default function ResourcesPage() {
  const { localizePath } = useI18n();

  return (
    <article className="content-page resources-page">
      <header className="content-hero">
        <p className="content-eyebrow">Resources · Updated {RESOURCES_META.updated}</p>
        <h1>{RESOURCES_META.h1}</h1>
        <p className="content-intro">{RESOURCES_META.intro}</p>
        <a className="btn btn-primary content-cta" href={localizePath("/tools/compare")}>
          Open Compare PDF
          <ArrowRight size={18} aria-hidden="true" />
        </a>
      </header>

      {RESOURCES_SECTIONS.map((section) => (
        <section key={section.id} className="content-section" id={section.id}>
          <h2>{section.title}</h2>
          <p>{section.body}</p>
          {section.bullets && (
            <ul className="content-bullets">
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <section className="content-section content-columns" aria-labelledby="tool-split">
        <div>
          <h2 id="tool-split">
            <Monitor size={20} aria-hidden="true" /> Client-side tools
          </h2>
          <ul className="content-bullets">
            {CLIENT_TOOLS.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>
            <Server size={20} aria-hidden="true" /> Server-side tools
          </h2>
          <ul className="content-bullets">
            {SERVER_TOOLS.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="content-footer">
        <p>
          <a href="/compare/ilovepdf">PDFTwin vs iLovePDF</a>
          {" · "}
          <a href="/faq">FAQ</a>
          {" · "}
          <a href="/blog">Blog</a>
          {" · "}
          <a href={localizePath("/privacy")}>Privacy</a>
        </p>
      </footer>
    </article>
  );
}
