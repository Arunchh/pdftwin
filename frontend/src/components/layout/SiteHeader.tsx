import { Sparkles } from "lucide-react";
import BrandLogo from "../BrandLogo";

interface SiteHeaderProps {
  onLogoClick: () => void;
  onPricingClick: () => void;
  onUpgradeClick: () => void;
  activeToolLabel?: string;
}

export default function SiteHeader({
  onLogoClick,
  onPricingClick,
  onUpgradeClick,
  activeToolLabel,
}: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <button type="button" className="brand" onClick={onLogoClick}>
          <BrandLogo size={36} className="brand-logo" />
          <span className="brand-text">
            PDFTwin
            <small>Your PDF workspace</small>
          </span>
        </button>

        <nav className="site-nav" aria-label="Main">
          <a
            href="#tools"
            onClick={(event) => {
              event.preventDefault();
              onLogoClick();
            }}
          >
            Tools
          </a>
          <button type="button" className="site-nav-link" onClick={onPricingClick}>
            Pricing
          </button>
        </nav>

        <div className="site-header-actions">
          {activeToolLabel && (
            <span className="active-tool-pill">{activeToolLabel}</span>
          )}
          <span className="plan-badge">
            <Sparkles size={14} />
            Free plan
          </span>
          <button type="button" className="btn btn-primary btn-sm" onClick={onUpgradeClick}>
            Upgrade to Pro
          </button>
        </div>
      </div>
    </header>
  );
}
