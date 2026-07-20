import { useEffect } from "react";
import ProCheckoutModal from "./payments/ProCheckoutModal";
import { CHECKOUT_EVENT } from "../utils/checkoutEvents";
import { useProCheckout } from "../hooks/useProCheckout";

export default function CheckoutHost() {
  const checkout = useProCheckout();

  useEffect(() => {
    const onCheckout = () => checkout.openCheckout();
    window.addEventListener(CHECKOUT_EVENT, onCheckout);
    return () => window.removeEventListener(CHECKOUT_EVENT, onCheckout);
  }, [checkout.openCheckout]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "pro") {
      checkout.openCheckout();
    }
  }, [checkout.openCheckout]);

  return (
    <ProCheckoutModal
      open={checkout.open}
      step={checkout.step}
      termsAccepted={checkout.termsAccepted}
      error={checkout.error}
      onClose={checkout.closeCheckout}
      onTermsChange={checkout.setTermsAccepted}
      onContinueToConfirm={checkout.goToConfirm}
      onContinueToPay={checkout.goToPay}
      onPayWithPayPal={checkout.startPayPalCheckout}
      onCancelCheckout={checkout.handleCancelCheckout}
      onBackFromConfirm={() => checkout.setStep("plan")}
      onBackFromPay={() => checkout.setStep("confirm")}
      onRetryCheckout={() => checkout.setStep("plan")}
    />
  );
}
