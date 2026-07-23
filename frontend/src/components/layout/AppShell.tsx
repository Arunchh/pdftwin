import type { ReactNode } from "react";
import type { Locale } from "../../i18n/types";
import { I18nProvider } from "../../i18n/I18nProvider";
import AuthProvider from "../auth/AuthProvider";
import CheckoutHost from "../CheckoutHost";
import SeoStructuredData from "../SeoStructuredData";
import VercelAnalytics from "../VercelAnalytics";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

interface AppShellProps {
  locale: Locale;
  activeToolLabel?: string;
  children: ReactNode;
}

export default function AppShell({ locale, activeToolLabel, children }: AppShellProps) {
  return (
    <I18nProvider locale={locale}>
      <div className="site">
        <SeoStructuredData />
        <SiteHeader activeToolLabel={activeToolLabel} />
        <main className="site-main">{children}</main>
        <SiteFooter />
        <CheckoutHost />
        <AuthProvider />
        <VercelAnalytics />
      </div>
    </I18nProvider>
  );
}
