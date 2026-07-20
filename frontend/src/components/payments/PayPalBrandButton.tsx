import { Loader2 } from "lucide-react";

interface PayPalBrandButtonProps {
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export default function PayPalBrandButton({
  loading = false,
  disabled = false,
  onClick,
}: PayPalBrandButtonProps) {
  return (
    <button
      type="button"
      className="paypal-brand-btn"
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <>
          <Loader2 size={18} className="spin" />
          Connecting to PayPal…
        </>
      ) : (
        <>
          <span className="paypal-brand-mark" aria-hidden="true">
            Pay<span>Pal</span>
          </span>
          Subscribe
        </>
      )}
    </button>
  );
}
