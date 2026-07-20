import { BUSINESS_TAGLINE } from "../../config/formats";
import { openCheckout } from "../../utils/checkoutEvents";
import BrandLogo from "../BrandLogo";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <BrandLogo size={32} />
          <div>
            <strong>PDFTwin</strong>
            <p>{BUSINESS_TAGLINE}</p>
          </div>
        </div>
        <div className="site-footer-links">
          <a href="/#tools">Tools</a>
          <a href="/formats">Formats</a>
          <a href="/pricing">Pricing</a>
          <a href="/pricing#faq">FAQ</a>
          <button type="button" className="site-footer-link-btn" onClick={openCheckout}>
            Upgrade to Pro
          </button>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
        <p className="site-footer-note">
          Files are processed in memory and never stored permanently. Pro subscriptions are billed
          securely through PayPal — cancel anytime from your PayPal account.
        </p>
      </div>
    </footer>
  );
}
