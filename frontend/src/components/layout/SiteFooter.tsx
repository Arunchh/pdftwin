import { openCheckout } from "../../utils/checkoutEvents";
import { useI18n } from "../../i18n/I18nProvider";
import BrandLogo from "../BrandLogo";

export default function SiteFooter() {
  const { messages, localizePath } = useI18n();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <BrandLogo size={32} />
          <div>
            <strong>PDFTwin</strong>
            <p>{messages.footer.tagline}</p>
          </div>
        </div>
        <div className="site-footer-links">
          <a href={`${localizePath("/")}#tools`}>{messages.footer.tools}</a>
          <a href={localizePath("/formats")}>{messages.footer.formats}</a>
          <a href={localizePath("/pricing")}>{messages.footer.pricing}</a>
          <a href={localizePath("/login")}>{messages.footer.signIn}</a>
          <a href={localizePath("/account")}>{messages.footer.account}</a>
          <a href={localizePath("/privacy")}>{messages.footer.privacy}</a>
          <a href={localizePath("/terms")}>{messages.footer.terms}</a>
          <a href="/faq">{messages.footer.faq}</a>
          <a href="/resources">{messages.footer.resources}</a>
          <a href="/blog">{messages.footer.blog}</a>
          <a href="/compare/ilovepdf">{messages.footer.compare}</a>
          <button type="button" className="site-footer-link-btn" onClick={openCheckout}>
            {messages.footer.upgradePro}
          </button>
        </div>
        <p className="site-footer-note">{messages.footer.note}</p>
      </div>
    </footer>
  );
}
