/** Swap to `supabase` / `paypal` when live integrations are ready. */
export const AUTH_PROVIDER = import.meta.env.VITE_AUTH_PROVIDER ?? "mock";
export const BILLING_PROVIDER = import.meta.env.VITE_BILLING_PROVIDER ?? "mock";
