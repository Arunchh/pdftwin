import { ALL_FAQ, FAQ_CATEGORIES, faqByCategory, type FaqCategory } from "../../config/faq";
import { useI18n } from "../../i18n/I18nProvider";

const CATEGORY_ORDER: FaqCategory[] = [
  "getting-started",
  "privacy-security",
  "limits-pricing",
  "tools",
  "subscription",
];

export default function FaqPage() {
  const { localizePath } = useI18n();

  return (
    <article className="content-page faq-page">
      <header className="content-hero">
        <p className="content-eyebrow">Help center</p>
        <h1>Frequently asked questions</h1>
        <p className="content-intro">
          Answers about privacy, free limits, tools, and Pro billing — inspired by help content from
          leading PDF workspaces, tailored to how PDFTwin actually works.
        </p>
      </header>

      {CATEGORY_ORDER.map((category) => {
        const items = faqByCategory(category);
        if (items.length === 0) return null;
        return (
          <section key={category} className="content-section" aria-labelledby={`faq-${category}`}>
            <h2 id={`faq-${category}`}>{FAQ_CATEGORIES[category]}</h2>
            <div className="content-faq-accordion">
              {items.map((item) => (
                <details key={item.question} className="content-faq-item">
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        );
      })}

      <footer className="content-footer">
        <p>
          Still stuck? See <a href={localizePath("/resources")}>how PDFTwin works</a>,{" "}
          <a href="/compare/ilovepdf">compare alternatives</a>, or{" "}
          <a href={localizePath("/pricing")}>Pro pricing</a>.
        </p>
        <p className="content-meta">{ALL_FAQ.length} questions · Updated July 2026</p>
      </footer>
    </article>
  );
}
