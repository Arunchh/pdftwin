import type { ReactNode } from "react";
import type { Locale } from "../../i18n/types";
import { I18nProvider } from "../../i18n/I18nProvider";
import AuthProvider from "../auth/AuthProvider";
import CheckoutHost from "../CheckoutHost";
import SeoStructuredData from "../SeoStructuredData";
import VercelAnalytics from "../VercelAnalytics";
import AnnouncementBanner from "./AnnouncementBanner";
import FormatSupportSection from "./FormatSupportSection";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

interface AppShellProps {
  locale: Locale;
  children: ReactNode;
}

export default function AppShell({ locale, children }: AppShellProps) {
  return (
    <I18nProvider locale={locale}>
      <div className="site">
        <SeoStructuredData />
        <AnnouncementBanner />
        <SiteHeader />
        <main className="site-main">{children}</main>
        <div className="site-prefooter">
          <FormatSupportSection />
        </div>
        <SiteFooter />
        <CheckoutHost />
        <AuthProvider />
        <VercelAnalytics />
      </div>
    </I18nProvider>
  );
}
