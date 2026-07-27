# Supabase auth — setup, architecture, and production deploy

PDFTwin uses **Supabase Auth** for live accounts on [pdftwin.com](https://pdftwin.com) and a **mock auth adapter** for local preview when env vars are not set.

This document covers the Supabase project, database schema, environment variables, the Astro 5 production build fix, Vercel deploy steps, and verification.

---

## Status (2026-07-27)

| Item | Status |
|------|--------|
| Supabase project **PDF Twin** | Live (`tcwvrdykeojriwsxglbn`) |
| Table `public.profiles` | Applied (RLS + auto-profile trigger) |
| Production auth on pdftwin.com | **Live** — runtime env injection + Supabase client |
| PayPal billing | Deferred — `VITE_BILLING_PROVIDER=mock` |
| Cloud workspace (Supabase Storage) | Deferred |

---

## Supabase project

| Setting | Value |
|---------|--------|
| Project name | PDF Twin |
| Project URL | `https://tcwvrdykeojriwsxglbn.supabase.co` |
| Region | us-east-1 |
| Dashboard | [Project settings → API](https://supabase.com/dashboard/project/tcwvrdykeojriwsxglbn/settings/api) |

### Database

Migration: [`supabase/migrations/20260721131000_profiles_and_plans.sql`](../../supabase/migrations/20260721131000_profiles_and_plans.sql)

**`public.profiles`**

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | References `auth.users(id)` ON DELETE CASCADE |
| `email` | text | Copied from auth user |
| `plan` | text | `free` or `pro` (default `free`) |
| `paypal_subscription_id` | text | Nullable — for future PayPal wiring |
| `created_at` | timestamptz | Auto |
| `updated_at` | timestamptz | Auto-updated on change |

**Also configured on the remote database:**

- Row Level Security (users can read/update their own row)
- Trigger `on_auth_user_created` — inserts a `profiles` row when a user signs up
- Trigger `profiles_set_updated_at` — keeps `updated_at` fresh

Supabase also manages **`auth.users`** (built-in). The app only adds `public.profiles` for plan state.

---

## Frontend code map

| File | Role |
|------|------|
| [`frontend/src/lib/supabaseClient.ts`](../../frontend/src/lib/supabaseClient.ts) | Creates Supabase JS client |
| [`frontend/src/adapters/auth/supabaseAuthAdapter.ts`](../../frontend/src/adapters/auth/supabaseAuthAdapter.ts) | Sign up, sign in, sign out, `setPlan` |
| [`frontend/src/adapters/auth/mockAuthAdapter.ts`](../../frontend/src/adapters/auth/mockAuthAdapter.ts) | localStorage preview auth |
| [`frontend/src/adapters/auth/index.ts`](../../frontend/src/adapters/auth/index.ts) | Picks adapter at **runtime** |
| [`frontend/src/config/runtimeEnv.ts`](../../frontend/src/config/runtimeEnv.ts) | Reads `window.__PDFTWIN_ENV__` or dev fallback |
| [`frontend/src/config/providers.ts`](../../frontend/src/config/providers.ts) | `getAuthProvider()` / `getBillingProvider()` |
| [`frontend/src/layouts/BaseLayout.astro`](../../frontend/src/layouts/BaseLayout.astro) | Injects runtime env into every page |
| [`frontend/src/components/auth/AuthProvider.tsx`](../../frontend/src/components/auth/AuthProvider.tsx) | Session sync + auth state listener |

---

## Environment variables

All frontend provider vars use the `VITE_` prefix (Vite convention). Copy [`frontend/.env.example`](../../frontend/.env.example) to `frontend/.env` for local dev.

| Variable | Values | Required when |
|----------|--------|----------------|
| `VITE_AUTH_PROVIDER` | `mock` \| `supabase` | Always (defaults to `mock` if unset) |
| `VITE_SUPABASE_URL` | Supabase project URL | `VITE_AUTH_PROVIDER=supabase` |
| `VITE_SUPABASE_ANON_KEY` | Anon public key (JWT) | `VITE_AUTH_PROVIDER=supabase` |
| `VITE_BILLING_PROVIDER` | `mock` \| `paypal` | Optional (default `mock`) |
| `VITE_CHECKOUT_LIVE` | `true` \| `false` | Optional (default `false`) |

**Never** put the Supabase `service_role` key in frontend or Vercel env — it bypasses RLS.

### Local development

```bash
cd frontend
cp .env.example .env
# Fill in VITE_SUPABASE_ANON_KEY from Supabase Dashboard → Settings → API
npm run dev
```

Open the URL printed in the terminal (usually `http://localhost:4321`). Sign-up copy should say *"Create your PDFTwin account…"* (not *"stored locally in this preview"*).

### Vercel (production)

In **Vercel → Project → Settings → Environment Variables**, set all five `VITE_*` vars above for **Production** (and Preview if desired).

`VITE_*` variables are embedded at **build time**. After changing them, **redeploy** — saving alone does not update an already-built site.

---

## Astro 5 production build fix

### Problem

Astro 5 static builds can evaluate `import.meta.env.VITE_*` correctly when **pre-rendering HTML** but fail to inline the same values into **client JavaScript bundles** (React islands). Symptom:

- Signup page HTML showed Supabase copy
- Client JS still used **mock auth** (`localStorage`, `pdftwin_mock_users`)
- Real sign-up on pdftwin.com never hit Supabase

### Solution (shipped 2026-07-27)

1. **`experimental.staticImportMetaEnv: true`** in [`frontend/astro.config.mjs`](../../frontend/astro.config.mjs) — aligns Astro with Vite env inlining (preview for Astro 6).

2. **Runtime env injection** in `BaseLayout.astro` — at build time, Astro reads env vars and embeds them in an inline script:

   ```html
   <script>
     window.__PDFTWIN_ENV__ = {
       authProvider: "supabase",
       billingProvider: "mock",
       supabaseUrl: "https://…",
       supabaseAnonKey: "eyJ…",
       checkoutLive: false
     };
   </script>
   ```

3. **`getRuntimeEnv()`** in React code — auth, billing, and Supabase client read from `window.__PDFTWIN_ENV__` in the browser; local dev falls back to `import.meta.env` when the window object is not yet set.

4. **Runtime adapter selection** — `getAuthAdapter()` chooses mock vs Supabase at call time so production builds include both adapters and pick correctly after hydration.

### Why the anon key in HTML is acceptable

The Supabase **anon** key is designed for client-side use. Security comes from **Row Level Security** on `profiles` and Supabase Auth policies — not from hiding the anon key.

---

## Supabase Dashboard checklist

### Authentication → URL Configuration

| Setting | Value |
|---------|--------|
| Site URL | `https://pdftwin.com` |
| Redirect URLs | `https://pdftwin.com/**`, `http://localhost:4321/**` |

### Authentication → Providers → Email

- **Confirm email ON** (default): users must click the confirmation link before sign-in works.
- **Confirm email OFF**: instant sign-in after signup (better for early testing).

---

## Deploy to production

From the repo root (requires Vercel CLI linked to the project):

```bash
vercel deploy --prod
```

Or push to `main` if the GitHub → Vercel integration is enabled.

Build command (from [`vercel.json`](../../vercel.json)):

```bash
cd frontend && npm install && npm run build
```

Output: `frontend/dist/` (static) + Python serverless handler for `/api/*`.

---

## Verification

### 1. Runtime env in HTML

```bash
curl -s https://pdftwin.com/signup | grep -o '"authProvider":"supabase"'
```

Should match `"authProvider":"supabase"`.

### 2. Supabase code in client bundle

Production ships a hashed bundle such as `/_astro/useAuth.*.js`. It should contain `signInWithPassword` (Supabase auth), not only `pdftwin_mock_users`.

### 3. End-to-end signup

1. Open [pdftwin.com/signup](https://pdftwin.com/signup)
2. Create an account
3. Confirm email (if confirmation is enabled)
4. Sign in → [pdftwin.com/account](https://pdftwin.com/account)
5. In Supabase **Table Editor → profiles**, confirm a new row with `plan = free`

---

## Without PayPal (current mode)

With `VITE_BILLING_PROVIDER=mock`:

- Real accounts and plan state in `profiles`
- **Enable Pro preview** on `/account` toggles `free` ↔ `pro` in the database (for testing limits)
- **Upgrade to Pro** runs checkout UI only — no charge until PayPal is wired

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|----------------|-----|
| Signup says *"stored locally in this preview"* | `VITE_AUTH_PROVIDER` not set at build time | Set Vercel env vars and redeploy |
| Signup works but sign-in fails | Email not confirmed | Confirm email or disable confirmation in Supabase |
| `Missing VITE_SUPABASE_URL…` in console | Anon key or URL missing at build | Add vars in Vercel + redeploy |
| Local dev shows mock copy | No `frontend/.env` or wrong dev server port | Copy `.env.example` → `.env`, restart `npm run dev` |
| Profile row missing after signup | Migration not applied | Run migration SQL in Supabase SQL Editor |

---

## Related docs

- [Implementation status — Billing & auth](./implementation-status.md#billing--auth)
- [README — Environment variables](../../README.md#environment-variables)
- [Roadmap — Cloud workspace](../strategy/roadmap.md) (Supabase Storage — deferred)
