import { Sparkles } from "lucide-react";
import { BUSINESS_TAGLINE } from "../../config/formats";
import { openCheckout } from "../../utils/checkoutEvents";
import BrandLogo from "../BrandLogo";

interface SiteHeaderProps {
  activeToolLabel?: string;
}

export default function SiteHeader({ activeToolLabel }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="brand" href="/">
          <BrandLogo size={36} className="brand-logo" />
          <span className="brand-text">
            PDFTwin
            <small>{BUSINESS_TAGLINE}</small>
          </span>
        </a>

        <nav className="site-nav" aria-label="Main">
          <a href="/#tools">Tools</a>
          <a href="/formats">Formats</a>
          <a href="/pricing">Pricing</a>
        </nav>

        <div className="site-header-actions">
          {activeToolLabel && <span className="active-tool-pill">{activeToolLabel}</span>}
          <span className="plan-badge">
            <Sparkles size={14} />
            Free plan
          </span>
          <button type="button" className="btn btn-primary btn-sm" onClick={openCheckout}>
            Upgrade to Pro
          </button>
        </div>
      </div>
    </header>
  );
}
