import { ArrowRight, Building2, Gauge, Layers3, Sparkles, Zap } from "lucide-react";
import { formatFileLimit, FREE_FILE_LIMIT_MB } from "../../config/limits";
import { useI18n } from "../../i18n/I18nProvider";

export default function HeroSection() {
  const { messages, localizePath } = useI18n();

  const heroStats = [
    { icon: Layers3, value: "12", label: messages.hero.statTools, tone: "sapphire" },
    {
      icon: Gauge,
      value: formatFileLimit(FREE_FILE_LIMIT_MB),
      label: messages.hero.statFreeLimit,
      tone: "amethyst",
    },
    { icon: Zap, value: "0", label: messages.hero.statInstall, tone: "emerald" },
  ] as const;

  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="hero-eyebrow">
          <Building2 size={16} />
          {messages.footer.tagline}
        </p>
        <h1>
          {messages.hero.titleLead}
          <span>{messages.hero.titleHighlight}</span>
        </h1>
        <p className="hero-description">{messages.hero.description}</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href={localizePath("/tools/convert")}>
            {messages.hero.openWorkspace}
            <ArrowRight size={18} />
          </a>
          <a className="btn btn-secondary" href={localizePath("/formats")}>
            {messages.hero.seeFormats}
          </a>
        </div>
        <p className="hero-footnote">
          <Sparkles size={14} />
          {messages.hero.footnote}
        </p>
      </div>

      <div className="hero-stats">
        {heroStats.map(({ icon: Icon, value, label, tone }) => (
          <div key={label} className={`hero-stat-card hero-stat-card--${tone}`}>
            <span className="hero-stat-icon">
              <Icon size={18} />
            </span>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
