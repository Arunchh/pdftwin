import { Lock, Receipt, RefreshCw, ShieldCheck } from "lucide-react";
import { CHECKOUT_TRUST_ITEMS, type CheckoutTrustIcon } from "../../config/checkout";

const TRUST_ICONS: Record<CheckoutTrustIcon, typeof ShieldCheck> = {
  shield: ShieldCheck,
  refresh: RefreshCw,
  receipt: Receipt,
  lock: Lock,
};

interface CheckoutTrustSignalsProps {
  compact?: boolean;
}

export default function CheckoutTrustSignals({ compact = false }: CheckoutTrustSignalsProps) {
  return (
    <ul className={`checkout-trust-grid ${compact ? "compact" : ""}`}>
      {CHECKOUT_TRUST_ITEMS.map((item) => {
        const Icon = TRUST_ICONS[item.icon];
        return (
          <li key={item.title} className="checkout-trust-item">
            <span className="checkout-trust-icon">
              <Icon size={18} />
            </span>
            <div>
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
