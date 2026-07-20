export interface PaymentConfig {
  configured: boolean;
  client_id: string;
  mode: string;
  pro_price: string;
  pro_currency: string;
}

export interface PayPalConnectResult {
  connected: boolean;
  mode: string;
  message: string;
  token_preview?: string;
}

export interface PayPalSubscriptionResult {
  subscription_id: string;
  approval_url: string;
  plan_id: string;
}

export interface PayPalSubscriptionStatus {
  subscription_id: string;
  status: string;
  plan_id?: string;
}

async function parseJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail =
      typeof payload === "object" && payload && "detail" in payload
        ? String((payload as { detail: unknown }).detail)
        : "Request failed.";
    throw new Error(detail);
  }
  return payload as T;
}

export async function fetchPaymentConfig(): Promise<PaymentConfig> {
  const response = await fetch("/api/payments/config");
  return parseJson<PaymentConfig>(response);
}

export async function connectPayPalAccount(input: {
  client_id: string;
  client_secret: string;
  mode: "sandbox" | "live";
}): Promise<PayPalConnectResult> {
  const response = await fetch("/api/payments/connect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseJson<PayPalConnectResult>(response);
}

export async function createPayPalSubscription(
  returnUrl: string,
  cancelUrl: string
): Promise<PayPalSubscriptionResult> {
  const response = await fetch("/api/payments/create-subscription", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      return_url: returnUrl,
      cancel_url: cancelUrl,
    }),
  });
  return parseJson<PayPalSubscriptionResult>(response);
}

export async function fetchPayPalSubscriptionStatus(
  subscriptionId: string
): Promise<PayPalSubscriptionStatus> {
  const response = await fetch(`/api/payments/subscription/${subscriptionId}`);
  return parseJson<PayPalSubscriptionStatus>(response);
}
