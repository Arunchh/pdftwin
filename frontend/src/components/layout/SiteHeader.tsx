import { Sparkles, UserCircle2 } from "lucide-react";
import { BUSINESS_TAGLINE } from "../../config/formats";
import { openCheckout } from "../../utils/checkoutEvents";
import { useAuth } from "../../hooks/useAuth";
import BrandLogo from "../BrandLogo";

interface SiteHeaderProps {
  activeToolLabel?: string;
}

export default function SiteHeader({ activeToolLabel }: SiteHeaderProps) {
  const { user, isAuthenticated, entitlements } = useAuth();

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
          <span className={`plan-badge ${entitlements.isPro ? "plan-badge--pro" : ""}`}>
            <Sparkles size={14} />
            {entitlements.label} plan
          </span>
          {isAuthenticated && user ? (
            <a className="btn btn-secondary btn-sm account-link" href="/account">
              <UserCircle2 size={16} />
              Account
            </a>
          ) : (
            <a className="btn btn-secondary btn-sm" href="/login">
              Sign in
            </a>
          )}
          {!entitlements.isPro && (
            <button type="button" className="btn btn-primary btn-sm" onClick={openCheckout}>
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
