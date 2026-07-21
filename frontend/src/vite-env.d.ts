/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_PROVIDER?: string;
  readonly VITE_BILLING_PROVIDER?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_CHECKOUT_LIVE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
