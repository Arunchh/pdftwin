import { useEffect, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { CHECKOUT_PRICE } from "../../config/checkout";
import { useI18n } from "../../i18n/I18nProvider";
import { openCheckout } from "../../utils/checkoutEvents";

export default function PricingSection() {
  const { messages, localizePath } = useI18n();
  const { pricing } = messages;
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const subscription = params.get("subscription");

    if (subscription === "success") {
      setCheckoutMessage(pricing.checkoutSuccess);
    } else if (subscription === "cancelled") {
      setCheckoutMessage(pricing.checkoutCancelled);
    }
  }, [pricing.checkoutCancelled, pricing.checkoutSuccess]);

  const plans = [
    { id: "free" as const, highlighted: false, ...pricing.plans.free },
    { id: "pro" as const, highlighted: true, ...pricing.plans.pro },
  ];

  return (
    <section className="pricing-section" id="pricing">
      <div className="section-heading">
        <h2>{pricing.heading}</h2>
        <p>{pricing.subheading}</p>
      </div>

      {checkoutMessage && <p className="pricing-banner">{checkoutMessage}</p>}

      <div className="pricing-grid">
        {plans.map((plan) => (
          <article
            key={plan.id}
            className={`pricing-card ${plan.highlighted ? "highlighted" : ""}`}
          >
            {plan.highlighted && (
              <span className="pricing-badge">
                <Sparkles size={12} />
                {pricing.bestForTeams}
              </span>
            )}
            <h3>{plan.name}</h3>
            <p className="pricing-price">
              {plan.id === "pro" ? CHECKOUT_PRICE : "$0"}
              <span>/{plan.id === "pro" ? pricing.proPeriod : pricing.freePeriod}</span>
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
              <button type="button" className="btn btn-primary" onClick={openCheckout}>
                {plan.cta}
              </button>
            ) : (
              <a className="btn btn-secondary" href={localizePath("/tools/convert")}>
                {plan.cta}
              </a>
            )}
          </article>
        ))}
      </div>

      <div className="pricing-trust-footer">
        <p>{pricing.trustFooter}</p>
      </div>

      <section className="pricing-faq" id="faq" aria-labelledby="pricing-faq-heading">
        <div className="section-heading">
          <h2 id="pricing-faq-heading">{pricing.faqHeading}</h2>
        </div>
        <div className="pricing-faq-list">
          {pricing.faq.map((item) => (
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
