import { useCallback, useState } from "react";
import type { CheckoutStep } from "../config/checkout";
import { CHECKOUT_LIVE } from "../config/checkout";
import { createPayPalSubscription } from "../services/payments";

const PREVIEW_COMPLETE_KEY = "pdftwin_pro_checkout_preview";

export function hasPreviewCheckoutComplete(): boolean {
  try {
    return sessionStorage.getItem(PREVIEW_COMPLETE_KEY) === "1";
  } catch {
    return false;
  }
}

export function useProCheckout() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<CheckoutStep>("plan");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStep("plan");
    setTermsAccepted(false);
    setError(null);
  }, []);

  const openCheckout = useCallback(() => {
    reset();
    setOpen(true);
  }, [reset]);

  const closeCheckout = useCallback(() => {
    setOpen(false);
    reset();
  }, [reset]);

  const goToConfirm = useCallback(() => {
    setError(null);
    setStep("confirm");
  }, []);

  const goToPay = useCallback(() => {
    if (!termsAccepted) {
      setError("Please confirm the subscription terms to continue.");
      return;
    }
    setError(null);
    setStep("pay");
  }, [termsAccepted]);

  const runPreviewCheckout = useCallback(async () => {
    setStep("redirecting");
    setError(null);
    await new Promise((resolve) => window.setTimeout(resolve, 1800));
    try {
      sessionStorage.setItem(PREVIEW_COMPLETE_KEY, "1");
    } catch {
      /* ignore storage errors */
    }
    setStep("success");
  }, []);

  const startPayPalCheckout = useCallback(async () => {
    setError(null);

    if (CHECKOUT_LIVE) {
      setStep("redirecting");
      try {
        const returnUrl = `${window.location.origin}${window.location.pathname}#pricing?subscription=success`;
        const cancelUrl = `${window.location.origin}${window.location.pathname}#pricing?subscription=cancelled`;
        const result = await createPayPalSubscription(returnUrl, cancelUrl);
        window.location.href = result.approval_url;
      } catch (err) {
        setStep("pay");
        setError(err instanceof Error ? err.message : "Could not start PayPal checkout.");
      }
      return;
    }

    await runPreviewCheckout();
  }, [runPreviewCheckout]);

  const handleCancelCheckout = useCallback(() => {
    setStep("cancelled");
  }, []);

  return {
    open,
    step,
    termsAccepted,
    error,
    isLive: CHECKOUT_LIVE,
    setTermsAccepted,
    openCheckout,
    closeCheckout,
    goToConfirm,
    goToPay,
    startPayPalCheckout,
    handleCancelCheckout,
    setStep,
  };
}
