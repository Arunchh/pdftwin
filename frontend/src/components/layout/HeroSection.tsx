import { ArrowRight, Gauge, Layers3, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { formatFileLimit, FREE_FILE_LIMIT_MB } from "../../config/limits";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HERO_STATS = [
  { icon: Layers3, value: "5", label: "Professional tools" },
  { icon: Gauge, value: formatFileLimit(FREE_FILE_LIMIT_MB), label: "Free per file" },
  { icon: Zap, value: "0", label: "Accounts needed" },
] as const;

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="hero-eyebrow">
          <ShieldCheck size={16} />
          Private, browser-based PDF workspace
        </p>
        <h1>
          Handle every PDF task
          <span> without leaving your browser</span>
        </h1>
        <p className="hero-description">
          Merge, split, convert, extract, and protect documents in seconds. Upload once, work
          across every tool, and download results instantly — no install or signup on the Free plan.
        </p>
        <div className="hero-actions">
          <button type="button" className="btn btn-primary" onClick={onGetStarted}>
            Open the workspace
            <ArrowRight size={18} />
          </button>
          <a className="btn btn-secondary" href="#pricing">
            Compare plans
          </a>
        </div>
        <p className="hero-footnote">
          <Sparkles size={14} />
          Pro unlocks larger files and priority processing via PayPal.
        </p>
      </div>

      <div className="hero-stats">
        {HERO_STATS.map(({ icon: Icon, value, label }) => (
          <div key={label} className="hero-stat-card">
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
