import { useEffect, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { SUBSCRIPTION_FAQ } from "../../config/faq";
import { PRICING_PLANS } from "../../config/pricing";
interface PricingSectionProps {
  onUpgrade: () => void;
}

export default function PricingSection({ onUpgrade }: PricingSectionProps) {
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split("?")[1] ?? "");
    const subscription = params.get("subscription");

    if (subscription === "success") {
      setCheckoutMessage("Thanks! Your PayPal subscription is being activated.");
    } else if (subscription === "cancelled") {
      setCheckoutMessage("Checkout was cancelled. You can try again anytime.");
    }
  }, []);

  return (
    <section className="pricing-section" id="pricing">
      <div className="section-heading">
        <h2>Simple, honest pricing</h2>
        <p>
          Start free with every core tool. Upgrade to Pro when you need bigger files and faster
          processing — billed securely through PayPal.
        </p>
      </div>

      {checkoutMessage && <p className="pricing-banner">{checkoutMessage}</p>}

      <div className="pricing-grid">
        {PRICING_PLANS.map((plan) => (
          <article
            key={plan.id}
            className={`pricing-card ${plan.highlighted ? "highlighted" : ""}`}
          >
            {plan.highlighted && (
              <span className="pricing-badge">
                <Sparkles size={12} />
                Best for teams
              </span>
            )}
            <h3>{plan.name}</h3>
            <p className="pricing-price">
              {plan.price}
              <span>/{plan.period}</span>
            </p>
            <p className="pricing-description">{plan.description}</p>
            <ul className="pricing-features">
              {plan.features.map((feature) => (
                <li key={feature}>
                  <Check size={16} />
                  {feature}
                </li>
              ))}
            </ul>

            {plan.id === "pro" ? (
              <button type="button" className="btn btn-primary" onClick={onUpgrade}>
                {plan.cta}
              </button>
            ) : (
              <a className="btn btn-secondary" href="#tools">
                {plan.cta}
              </a>
            )}
          </article>
        ))}
      </div>

      <div className="pricing-trust-footer">
        <p>
          <strong>Trusted checkout.</strong> PayPal handles payment security, subscription billing,
          and cancellation — so you stay in control.
        </p>
      </div>

      <section className="pricing-faq" id="faq" aria-labelledby="pricing-faq-heading">
        <div className="section-heading">
          <h2 id="pricing-faq-heading">Frequently asked questions</h2>
          <p>Everything you need to know about PDFTwin Free and Pro before you subscribe.</p>
        </div>
        <div className="pricing-faq-list">
          {SUBSCRIPTION_FAQ.map((item) => (
            <details key={item.question} className="pricing-faq-item">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </section>
  );
}
