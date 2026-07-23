import { UserCircle2 } from "lucide-react";
import { openCheckout } from "../../utils/checkoutEvents";
import { useAuth } from "../../hooks/useAuth";
import { useI18n } from "../../i18n/I18nProvider";
import BrandLogo from "../BrandLogo";
import SiteNav from "./SiteNav";

interface SiteHeaderProps {
  activeToolLabel?: string;
}

export default function SiteHeader({ activeToolLabel }: SiteHeaderProps) {
  const { user, isAuthenticated, entitlements } = useAuth();
  const { messages, localizePath } = useI18n();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="brand" href={localizePath("/")}>
          <BrandLogo size={34} className="brand-logo" />
          <span className="brand-text">PDFTwin</span>
        </a>

        <SiteNav />

        <div className="site-header-actions">
          {activeToolLabel && (
            <span className="active-tool-pill">{activeToolLabel}</span>
          )}
          {isAuthenticated && user ? (
            <a className="site-header-signin" href={localizePath("/account")}>
              <UserCircle2 size={16} aria-hidden="true" />
              {messages.nav.account}
            </a>
          ) : (
            <a className="site-header-signin" href={localizePath("/login")}>
              {messages.nav.signIn}
            </a>
          )}
          {!entitlements.isPro && (
            <button type="button" className="btn btn-primary btn-sm" onClick={openCheckout}>
              {messages.nav.upgradePro}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
