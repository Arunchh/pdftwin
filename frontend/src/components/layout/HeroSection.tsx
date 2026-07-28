import { ShieldCheck, Sparkles, Zap, Columns2 } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";

const TRUST_ICONS = [ShieldCheck, Zap, Columns2] as const;

export default function HeroSection() {
  const { messages, localizePath } = useI18n();

  return (
    <section className="hero hero--compare hero--marketing" aria-labelledby="home-marketing-heading">
      <h2 id="home-marketing-heading" className="sr-only">
        {messages.hero.titleLead}
        {messages.hero.titleHighlight}
      </h2>
      <p className="hero-description">{messages.hero.description}</p>
      <div className="hero-actions">
        <a className="btn btn-secondary" href={localizePath("/tools")}>
          {messages.hero.seeAllTools}
        </a>
        <a className="btn btn-secondary" href={localizePath("/guides/compare-pdf-online")}>
          {messages.hero.seeCompareGuide}
        </a>
      </div>
      <ul className="hero-trust-chips" aria-label="Trust highlights">
        {messages.hero.trustChips.map((chip, index) => {
          const Icon = TRUST_ICONS[index] ?? ShieldCheck;
          return (
            <li key={chip}>
              <Icon size={14} aria-hidden="true" />
              {chip}
            </li>
          );
        })}
      </ul>
      <p className="hero-footnote">
        <Sparkles size={14} />
        {messages.hero.footnote}
      </p>
    </section>
  );
}
