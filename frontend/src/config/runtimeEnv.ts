export interface PdfTwinRuntimeEnv {
  authProvider: string;
  billingProvider: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  checkoutLive: boolean;
}

declare global {
  interface Window {
    __PDFTWIN_ENV__?: PdfTwinRuntimeEnv;
  }
}

const devFallback: PdfTwinRuntimeEnv = {
  authProvider: import.meta.env.VITE_AUTH_PROVIDER ?? "mock",
  billingProvider: import.meta.env.VITE_BILLING_PROVIDER ?? "mock",
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? "",
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
  checkoutLive: import.meta.env.VITE_CHECKOUT_LIVE === "true",
};

export function getRuntimeEnv(): PdfTwinRuntimeEnv {
  if (typeof window !== "undefined" && window.__PDFTWIN_ENV__) {
    return window.__PDFTWIN_ENV__;
  }
  return devFallback;
}
