import { ArrowRight, Building2, Gauge, Layers3, Sparkles, Zap } from "lucide-react";
import { formatFileLimit, FREE_FILE_LIMIT_MB } from "../../config/limits";
import { BUSINESS_TAGLINE } from "../../config/formats";

const HERO_STATS = [
  { icon: Layers3, value: "12", label: "Business tools", tone: "sapphire" },
  { icon: Gauge, value: formatFileLimit(FREE_FILE_LIMIT_MB), label: "Free per file", tone: "amethyst" },
  { icon: Zap, value: "0", label: "Install required", tone: "emerald" },
] as const;

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="hero-eyebrow">
          <Building2 size={16} />
          {BUSINESS_TAGLINE}
        </p>
        <h1>
          One workspace for every
          <span> file format your business touches</span>
        </h1>
        <p className="hero-description">
          Convert PDFs to Word and Excel, export WebP-ready images, compare contract revisions side
          by side, merge reports, and protect confidential files — without switching tools.
        </p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="/tools/convert">
            Open the workspace
            <ArrowRight size={18} />
          </a>
          <a className="btn btn-secondary" href="/formats">
            See supported formats
          </a>
        </div>
        <p className="hero-footnote">
          <Sparkles size={14} />
          Pro adds higher limits and priority processing for growing teams.
        </p>
      </div>

      <div className="hero-stats">
        {HERO_STATS.map(({ icon: Icon, value, label, tone }) => (
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
