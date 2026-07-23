import { ArrowRight } from "lucide-react";
import {
  COMPARISON_FAQ,
  COMPARISON_META,
  COMPARISON_ROWS,
  PDFTWIN_WINS,
  WHEN_OTHERS_WIN,
} from "../../content/comparison";
import { useI18n } from "../../i18n/I18nProvider";

export default function ComparisonPage() {
  const { localizePath } = useI18n();

  return (
    <article className="content-page comparison-page">
      <header className="content-hero">
        <p className="content-eyebrow">Comparison · Updated {COMPARISON_META.updated}</p>
        <h1>{COMPARISON_META.h1}</h1>
        <p className="content-intro">{COMPARISON_META.intro}</p>
        <a className="btn btn-primary content-cta" href={localizePath("/tools/merge")}>
          Try PDFTwin free
          <ArrowRight size={18} aria-hidden="true" />
        </a>
      </header>

      <section className="content-section" aria-labelledby="comparison-table">
        <h2 id="comparison-table">Feature comparison (2026)</h2>
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col">PDFTwin</th>
                <th scope="col">iLovePDF</th>
                <th scope="col">Smallpdf</th>
                <th scope="col">Sejda</th>
                <th scope="col">PDF24</th>
                <th scope="col">ihatepdf</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  <td className="comparison-highlight">{row.pdftwin}</td>
                  <td>{row.ilovepdf}</td>
                  <td>{row.smallpdf}</td>
                  <td>{row.sejda}</td>
                  <td>{row.pdf24}</td>
                  <td>{row.ihatepdf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="content-section content-columns" aria-labelledby="pdftwin-wins">
        <div>
          <h2 id="pdftwin-wins">Where PDFTwin wins</h2>
          <ul className="content-card-list">
            {PDFTWIN_WINS.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 id="when-others-win">When others win</h2>
          <ul className="content-card-list">
            {WHEN_OTHERS_WIN.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="content-section" aria-labelledby="comparison-faq">
        <h2 id="comparison-faq">Comparison FAQ</h2>
        <dl className="content-faq">
          {COMPARISON_FAQ.map((item) => (
            <div key={item.question}>
              <dt>{item.question}</dt>
              <dd>{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className="content-footer">
        <p>
          <a href={localizePath("/resources")}>How PDFTwin works</a>
          {" · "}
          <a href="/faq">FAQ</a>
          {" · "}
          <a href={localizePath("/pricing")}>Pricing</a>
        </p>
      </footer>
    </article>
  );
}
