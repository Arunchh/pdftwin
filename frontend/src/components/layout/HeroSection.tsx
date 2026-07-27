import { ArrowRight, Columns2, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";

const TRUST_ICONS = [ShieldCheck, Zap, Columns2] as const;

export default function HeroSection() {
  const { messages, localizePath } = useI18n();

  return (
    <section className="hero hero--compare">
      <div className="hero-copy">
        <p className="hero-eyebrow">
          <Columns2 size={16} />
          {messages.footer.tagline}
        </p>
        <h1>
          {messages.hero.titleLead}
          <span>{messages.hero.titleHighlight}</span>
        </h1>
        <p className="hero-description">{messages.hero.description}</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href={localizePath("/tools/compare")}>
            {messages.hero.compareNow}
            <ArrowRight size={18} />
          </a>
          <a className="btn btn-secondary" href={`${localizePath("/")}#tools`}>
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
      </div>

      <div className="hero-visual" aria-hidden="true">
        <div className="hero-compare-demo">
          <div className="hero-compare-pane">
            <span>Contract_v1.pdf</span>
            <div className="hero-compare-page" />
            <div className="hero-compare-page hero-compare-page--dim" />
          </div>
          <div className="hero-compare-pane">
            <span>Contract_v2.pdf</span>
            <div className="hero-compare-page hero-compare-page--highlight" />
            <div className="hero-compare-page" />
          </div>
        </div>
        <p className="hero-visual-caption">{messages.hero.visualCaption}</p>
      </div>
    </section>
  );
}
