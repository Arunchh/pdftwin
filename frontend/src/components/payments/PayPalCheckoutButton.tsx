import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  createPayPalSubscription,
  fetchPaymentConfig,
  type PaymentConfig,
} from "../../services/payments";

interface PayPalCheckoutButtonProps {
  onError?: (message: string) => void;
}

export default function PayPalCheckoutButton({ onError }: PayPalCheckoutButtonProps) {
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPaymentConfig()
      .then(setConfig)
      .catch((error) => onError?.(error instanceof Error ? error.message : "Could not load payments."))
      .finally(() => setLoading(false));
  }, [onError]);

  const handleCheckout = async () => {
    setSubmitting(true);
    try {
      const returnUrl = `${window.location.origin}${window.location.pathname}#pricing?subscription=success`;
      const cancelUrl = `${window.location.origin}${window.location.pathname}#pricing?subscription=cancelled`;
      const result = await createPayPalSubscription(returnUrl, cancelUrl);
      window.location.href = result.approval_url;
    } catch (error) {
      onError?.(error instanceof Error ? error.message : "Could not start PayPal checkout.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <button type="button" className="btn btn-primary" disabled>
        <Loader2 size={18} className="spin" />
        Loading checkout…
      </button>
    );
  }

  if (!config?.configured) {
    return (
      <button type="button" className="btn btn-primary" disabled title="Connect PayPal in admin settings first">
        PayPal not configured
      </button>
    );
  }

  return (
    <button type="button" className="btn btn-primary paypal-checkout-btn" disabled={submitting} onClick={handleCheckout}>
      {submitting ? (
        <>
          <Loader2 size={18} className="spin" />
          Redirecting…
        </>
      ) : (
        <>Subscribe with PayPal · ${config.pro_price}/{config.pro_currency === "USD" ? "mo" : config.pro_currency}</>
      )}
    </button>
  );
}
