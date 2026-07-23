import { ArrowRight, CheckCircle2 } from "lucide-react";
import { toolPath } from "../../config/tools";
import { useI18n } from "../../i18n/I18nProvider";
import type { SeoLanding } from "../../i18n/seoLandings";
import { getSeoLanding, relatedLandingPath, seoLandingPath } from "../../i18n/seoLandings";

interface ToolSeoLandingProps {
  landing: SeoLanding;
}

export default function ToolSeoLanding({ landing }: ToolSeoLandingProps) {
  const { locale, messages } = useI18n();
  const toolHref = toolPath(landing.toolId, locale);

  return (
    <article className="seo-landing">
      <header className="seo-landing-hero">
        <p className="seo-landing-eyebrow">PDFTwin</p>
        <h1>{landing.h1}</h1>
        <p className="seo-landing-intro">{landing.intro}</p>
        <a className="btn btn-primary seo-landing-cta" href={toolHref}>
          {landing.ctaLabel}
          <ArrowRight size={18} aria-hidden="true" />
        </a>
      </header>

      <section className="seo-landing-section" aria-labelledby="seo-benefits">
        <h2 id="seo-benefits">{messages.seoLanding.benefitsTitle}</h2>
        <ul className="seo-landing-benefits">
          {landing.benefits.map((benefit) => (
            <li key={benefit}>
              <CheckCircle2 size={18} aria-hidden="true" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="seo-landing-section" aria-labelledby="seo-steps">
        <h2 id="seo-steps">{messages.seoLanding.stepsTitle}</h2>
        <ol className="seo-landing-steps">
          {landing.steps.map((step, index) => (
            <li key={step.title}>
              <span className="seo-landing-step-num">{index + 1}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {landing.faq.length > 0 && (
        <section className="seo-landing-section" aria-labelledby="seo-faq">
          <h2 id="seo-faq">{messages.seoLanding.faqTitle}</h2>
          <dl className="seo-landing-faq">
            {landing.faq.map((item) => (
              <div key={item.question}>
                <dt>{item.question}</dt>
                <dd>{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {landing.relatedSlugs && landing.relatedSlugs.length > 0 && (
        <section className="seo-landing-section" aria-labelledby="seo-related">
          <h2 id="seo-related">{messages.seoLanding.relatedTitle}</h2>
          <ul className="seo-landing-related">
            {landing.relatedSlugs.map((slug) => {
              const related = getSeoLanding(landing.locale, slug);
              if (!related) return null;
              const href = relatedLandingPath(landing.locale, slug) ?? seoLandingPath(related);
              return (
                <li key={slug}>
                  <a href={href}>{related.h1}</a>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <footer className="seo-landing-footer">
        <a className="btn btn-primary" href={toolHref}>
          {landing.ctaLabel}
        </a>
      </footer>
    </article>
  );
}
