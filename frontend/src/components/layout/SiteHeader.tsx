import { UserCircle2 } from "lucide-react";
import { openCheckout } from "../../utils/checkoutEvents";
import { useAuth } from "../../hooks/useAuth";
import BrandLogo from "../BrandLogo";
import SiteNav from "./SiteNav";

interface SiteHeaderProps {
  activeToolLabel?: string;
}

export default function SiteHeader({ activeToolLabel }: SiteHeaderProps) {
  const { user, isAuthenticated, entitlements } = useAuth();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="brand" href="/">
          <BrandLogo size={34} className="brand-logo" />
          <span className="brand-text">PDFTwin</span>
        </a>

        <SiteNav />

        <div className="site-header-actions">
          {activeToolLabel && (
            <span className="active-tool-pill">{activeToolLabel}</span>
          )}
          {isAuthenticated && user ? (
            <a className="site-header-signin" href="/account">
              <UserCircle2 size={16} aria-hidden="true" />
              Account
            </a>
          ) : (
            <a className="site-header-signin" href="/login">
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
