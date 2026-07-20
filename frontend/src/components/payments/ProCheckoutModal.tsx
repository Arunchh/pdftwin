import { useEffect, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleAlert,
  Sparkles,
  X,
} from "lucide-react";
import {
  CHECKOUT_FAQ,
  CHECKOUT_LIVE,
  CHECKOUT_PRICE,
  PRO_CHECKOUT_SUMMARY,
  PRO_PLAN,
  type CheckoutStep,
} from "../../config/checkout";
import CheckoutTrustSignals from "./CheckoutTrustSignals";
import PayPalBrandButton from "./PayPalBrandButton";

interface ProCheckoutModalProps {
  open: boolean;
  step: CheckoutStep;
  termsAccepted: boolean;
  error: string | null;
  onClose: () => void;
  onTermsChange: (accepted: boolean) => void;
  onContinueToConfirm: () => void;
  onContinueToPay: () => void;
  onPayWithPayPal: () => void;
  onCancelCheckout: () => void;
  onBackFromConfirm: () => void;
  onBackFromPay: () => void;
  onRetryCheckout: () => void;
}

const STEPS: CheckoutStep[] = ["plan", "confirm", "pay"];

function stepIndex(step: CheckoutStep): number {
  if (step === "redirecting") return 2;
  if (step === "success" || step === "cancelled") return 3;
  return STEPS.indexOf(step);
}

export default function ProCheckoutModal({
  open,
  step,
  termsAccepted,
  error,
  onClose,
  onTermsChange,
  onContinueToConfirm,
  onContinueToPay,
  onPayWithPayPal,
  onCancelCheckout,
  onBackFromConfirm,
  onBackFromPay,
  onRetryCheckout,
}: ProCheckoutModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && step !== "redirecting") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose, step]);

  if (!open) return null;

  const currentStep = stepIndex(step);
  const isTerminal = step === "success" || step === "cancelled" || step === "redirecting";

  return (
    <div className="checkout-overlay" role="presentation" onClick={step === "redirecting" ? undefined : onClose}>
      <div
        ref={dialogRef}
        className="checkout-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="checkout-header">
          <div>
            <p className="checkout-eyebrow">
              <Sparkles size={14} />
              PDFTwin Pro
            </p>
            <h2 id="checkout-title">
              {step === "success"
                ? "You're all set"
                : step === "cancelled"
                  ? "Checkout cancelled"
                  : step === "redirecting"
                    ? "Connecting to PayPal"
                    : "Upgrade to Pro"}
            </h2>
          </div>
          {step !== "redirecting" && (
            <button type="button" className="checkout-close" onClick={onClose} aria-label="Close checkout">
              <X size={20} />
            </button>
          )}
        </header>

        {!isTerminal && (
          <div className="checkout-progress" aria-label="Checkout progress">
            {["Review plan", "Confirm details", "Pay with PayPal"].map((label, index) => (
              <div
                key={label}
                className={`checkout-progress-step ${index <= currentStep ? "active" : ""} ${index === currentStep ? "current" : ""}`}
              >
                <span className="checkout-progress-dot">{index < currentStep ? <Check size={12} /> : index + 1}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        )}

        {!CHECKOUT_LIVE && step !== "success" && step !== "cancelled" && (
          <p className="checkout-preview-banner">
            Secure checkout preview — live PayPal billing connects when the backend is enabled.
          </p>
        )}

        {error && (
          <p className="checkout-error">
            <CircleAlert size={16} />
            {error}
          </p>
        )}

        <div className="checkout-body">
          {step === "plan" && (
            <>
              <div className="checkout-plan-card">
                <div className="checkout-plan-price">
                  <strong>{CHECKOUT_PRICE}</strong>
                  <span>/{PRO_PLAN.period.replace("per ", "")}</span>
                </div>
                <p className="checkout-plan-description">{PRO_PLAN.description}</p>
                <ul className="checkout-feature-list">
                  {PRO_PLAN.features.map((feature) => (
                    <li key={feature}>
                      <Check size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <CheckoutTrustSignals compact />

              <div className="checkout-actions">
                <button type="button" className="btn btn-primary" onClick={onContinueToConfirm}>
                  Continue
                  <ArrowRight size={18} />
                </button>
              </div>
            </>
          )}

          {step === "confirm" && (
            <>
              <CheckoutTrustSignals />

              <label className="checkout-terms">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(event) => onTermsChange(event.target.checked)}
                />
                <span>
                  I understand PDFTwin Pro is a monthly subscription billed through PayPal until I
                  cancel. I can manage billing anytime from my PayPal account.
                </span>
              </label>

              <details className="checkout-faq">
                <summary>Common questions ({CHECKOUT_FAQ.length})</summary>
                <div className="checkout-faq-list">
                  {CHECKOUT_FAQ.map((item) => (
                    <div key={item.question} className="checkout-faq-item">
                      <strong>{item.question}</strong>
                      <p>{item.answer}</p>
                    </div>
                  ))}
                </div>
              </details>

              <div className="checkout-actions split">
                <button type="button" className="btn btn-secondary" onClick={onBackFromConfirm}>
                  <ArrowLeft size={18} />
                  Back
                </button>
                <button type="button" className="btn btn-primary" onClick={onContinueToPay}>
                  Continue to payment
                  <ArrowRight size={18} />
                </button>
              </div>
            </>
          )}

          {step === "pay" && (
            <>
              <div className="checkout-order-summary">
                <div className="checkout-order-row">
                  <span>{PRO_CHECKOUT_SUMMARY.name}</span>
                  <strong>{PRO_CHECKOUT_SUMMARY.priceLabel}</strong>
                </div>
                <div className="checkout-order-row muted">
                  <span>{PRO_CHECKOUT_SUMMARY.tagline}</span>
                  <span>{PRO_CHECKOUT_SUMMARY.fileLimit} files</span>
                </div>
                <div className="checkout-order-total">
                  <span>Due today</span>
                  <strong>{CHECKOUT_PRICE}</strong>
                </div>
                <p className="checkout-order-note">{PRO_CHECKOUT_SUMMARY.billingNote}</p>
              </div>

              <div className="checkout-pay-block">
                <p className="checkout-pay-lead">
                  You'll finish payment on PayPal's secure site. PDFTwin never stores your payment
                  details.
                </p>
                <PayPalBrandButton onClick={onPayWithPayPal} />
                <button type="button" className="checkout-cancel-link" onClick={onCancelCheckout}>
                  Cancel checkout
                </button>
              </div>

              <ul className="checkout-pay-badges">
                <li>Buyer Protection eligible</li>
                <li>Encrypted connection</li>
                <li>Cancel anytime in PayPal</li>
              </ul>

              <div className="checkout-actions">
                <button type="button" className="btn btn-secondary" onClick={onBackFromPay}>
                  <ArrowLeft size={18} />
                  Back
                </button>
              </div>
            </>
          )}

          {step === "redirecting" && (
            <div className="checkout-redirecting">
              <div className="checkout-redirecting-spinner" aria-hidden="true" />
              <h3>Taking you to PayPal</h3>
              <p>
                {CHECKOUT_LIVE
                  ? "Complete your subscription approval on PayPal to activate Pro."
                  : "Simulating PayPal secure checkout…"}
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="checkout-result success">
              <span className="checkout-result-icon">
                <CheckCircle2 size={40} />
              </span>
              <h3>Subscription confirmed</h3>
              <p>
                {CHECKOUT_LIVE
                  ? "Thanks for subscribing to PDFTwin Pro. Your larger file limits and priority processing will activate shortly."
                  : "This is a preview of the checkout experience. Live PayPal billing will activate Pro automatically once connected — you were not charged."}
              </p>
              <div className="checkout-actions">
                <button type="button" className="btn btn-primary" onClick={onClose}>
                  Back to PDFTwin
                </button>
              </div>
            </div>
          )}

          {step === "cancelled" && (
            <div className="checkout-result cancelled">
              <h3>No worries — your files are still here</h3>
              <p>You can keep using every free tool, or upgrade to Pro whenever you're ready.</p>
              <div className="checkout-actions split">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Continue with Free
                </button>
                <button type="button" className="btn btn-primary" onClick={onRetryCheckout}>
                  Try again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
