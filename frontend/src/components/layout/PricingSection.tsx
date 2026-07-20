import { useEffect, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { PRICING_PLANS } from "../../config/pricing";
import { fetchPaymentConfig } from "../../services/payments";
import PayPalCheckoutButton from "../payments/PayPalCheckoutButton";

export default function PricingSection() {
  const [paymentsReady, setPaymentsReady] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPaymentConfig()
      .then((config) => setPaymentsReady(config.configured))
      .catch(() => setPaymentsReady(false));

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
              paymentsReady ? (
                <PayPalCheckoutButton onError={setCheckoutMessage} />
              ) : (
                <button type="button" className="btn btn-primary" disabled>
                  Connect PayPal to enable checkout
                </button>
              )
            ) : (
              <a className="btn btn-secondary" href="#tools">
                {plan.cta}
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
