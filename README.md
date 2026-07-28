# PDFTwin

**PDFTwin** is a multi-page business file conversion workspace — **18 tools** for comparing PDFs side by side, converting documents, merging and splitting files, signing and protecting PDFs, and extracting text — all in the browser with no install.

**Hero differentiator:** **Compare two PDFs** with linked scroll, real zoom, single-page review, and fullscreen — runs locally in the browser (no upload for viewing). The homepage leads with compare: upload files directly under the headline, pick a tool, and work — complementary tools finish the review workflow (extract → merge → sign).

Live site: [pdftwin.com](https://pdftwin.com) · Operated by **Helios Impex** (India)

**Internal docs:** [docs/README.md](docs/README.md) — competitive research (ihatepdf), monetization plan, roadmap, [compare-first homepage](docs/product/compare-first-homepage.md), implementation status, [i18n](docs/product/i18n.md).

## Languages

PDFTwin supports **English** (default), **Spanish** (`/es/`), **French** (`/fr/`), **Dutch** (`/nl/`), and **Portuguese** (`/pt/`). On Vercel, first-time visitors from matching regions are redirected based on country and browser language. Use the **language switcher** in the main nav bar (to the right of **Compare**) to switch manually.

## Features

Tools are grouped in **navigation** and on the home **SEO tool index** (`/#tools`) by **what you are trying to do**, then by **how many files you need**:

| Group | When to use it |
|-------|----------------|
| **PDF to Other Formats** | You have a PDF and want Word, Excel, images, or text |
| **Convert to PDF** | You have Word docs, images, or photos and want a PDF |
| **Work with PDFs → One PDF** | You have a single PDF to split, rotate, sign, watermark, compress, or protect |
| **Work with PDFs → Multiple PDFs** | You need to merge several PDFs or compare two versions side by side |

Each tool card shows a **1 PDF** or **2+ PDFs** badge so you can tell at a glance whether you need one file or several.

### PDF to Other Formats (1 PDF each)
- **Document conversion** — PDF to Word (.docx) or Excel (.xlsx); extract embedded images as WebP, PNG, or JPEG *(server)*
- **PDF to JPG/PNG** — Export PDF pages as image files; multi-page downloads as ZIP *(client-side)*
- **PDF to Text** — Extract selectable text to a `.txt` file *(client-side)*
- **OCR text extract** — Turn scanned PDFs and photos into editable text with Tesseract.js *(client-side)*

### Convert to PDF
- **Word to PDF** — Convert DOCX proposals and contracts into share-ready PDFs *(server, 1 file)*
- **Images to PDF** — Combine JPG, PNG, and other images into one PDF *(client-side, multiple images)*
- **Image conversion** — PNG, JPG, WebP, GIF, BMP, TIFF → WebP, PNG, or JPEG *(server, multiple files)*
- **Resize images** — Shrink photos and brand assets with quality and dimension controls *(server, multiple files)*

### Work with PDFs — One PDF
- **Split PDF** — Split one PDF into separate files by page range *(client-side)*
- **Extract pages** — Pull selected pages into a new PDF *(client-side)*
- **Remove pages** — Delete unwanted pages from a PDF *(client-side)*
- **Rotate PDF** — Rotate all pages or selected pages by 90°, 180°, or 270° *(client-side)*
- **Watermark PDF** — Add confidential or draft watermarks across every page *(server)*
- **Sign PDF** — Draw a signature or upload a PNG and place it on selected pages *(client-side)*
- **Compress PDF** — Reduce file size with quality presets *(server)*
- **Lock & unlock** — Add password protection or remove restrictions when permitted *(server)*

### Work with PDFs — Multiple PDFs
- **Compare PDFs** — Dedicated setup + **immersive review viewer**: side-by-side panes, linked scroll, working zoom, fit-width, single-page mode, page navigation, fullscreen *(client-side, PDF.js)* — see [compare-first docs](docs/product/compare-first-homepage.md)
- **Merge & arrange** — Combine multiple PDFs and reorder pages; free tier merges up to **5 PDFs** at once *(client-side)*

### Account & Workspace (preview)
- **Mock sign-in** — Create an account stored in the browser (localStorage) for preview; ready to swap to Supabase later
- **Pro preview** — Toggle Pro plan from Account or checkout flow to unlock 200 MB uploads and unlimited PDF → Word/Excel exports
- **Tool workspace** — On `/tools/*`: vertical **tool rail** (single-PDF edit tools) + tool panel + files column. On `/`: upload-first hero with rail beside the default Compare panel — see [tool workspace UI](docs/product/tool-workspace-ui.md)
- **Vertical tool rail** — Paint-style icon bar for split, rotate, watermark, sign, compress, protect, etc.; pick other tools from header **All tools** or `/tools/` catalog
- **Conversion-direction categories** — PDF → other formats, convert → PDF, and work-with-PDFs groupings in **All tools** nav and `/tools/` catalog
- **Single vs multi-PDF columns** — “One PDF” and “Multiple PDFs” side-by-side in the Work with PDFs section, with **1 PDF** / **2+ PDFs** badges on each tool card
- **Instant tool switching** — Switch tools in the workspace without a full page reload; browser back/forward supported
- **Result cards** — After processing, a result card shows filename and an explicit Download button (no silent auto-download)
- **Next-step suggestions** — Result cards link to related tools (e.g. Merge → Convert, Compress → Protect)
- **Persistent file tray** — Files stay in IndexedDB while you switch between tools — no re-upload needed
- **Compare + tray** — Pick left/right PDFs from the workspace tray; open **compare viewer** for full-width review mode
- **Compare-first homepage** — Hero, workflow strip, featured tools, and crawlable tool index — see [compare-first homepage](docs/product/compare-first-homepage.md)

## Architecture

PDFTwin is **not a single-page app**. It uses **Astro** to pre-render real URLs; interactive tools hydrate as **React islands** only where needed.

| Route | Page |
|-------|------|
| `/` | Home — compare hero, review workflow, featured tools, SEO tool index (`#tools`) |
| `/tools/` | Full tool catalog index (mega-menu layout, all 18 tools) |
| `/formats` | Format reference |
| `/pricing` | Plans, FAQ, Pro checkout |
| `/login` | Sign in |
| `/signup` | Create account |
| `/account` | Plan, profile, workspace usage |
| `/privacy` | Privacy policy (Helios Impex; client vs server processing, cookies, Supabase) |
| `/terms` | Terms of use (plans, no warranties, limited liability, India governing law) |
| `/tools/convert` | Document conversion |
| `/tools/images` | Image conversion |
| `/tools/images-to-pdf` | Images to PDF |
| `/tools/pdf-to-jpg` | PDF to JPG/PNG |
| `/tools/pdf-to-text` | PDF to text |
| `/tools/ocr` | OCR text extract |
| `/tools/resize` | Resize & compress images |
| `/tools/word-to-pdf` | Word to PDF |
| `/tools/compress` | Compress PDF |
| `/guides/compare-pdf-online` | SEO landing — compare PDFs free (EN) |
| `/tools/merge` | Merge & arrange |
| `/tools/split` | Split PDF |
| `/tools/extract` | Extract pages |
| `/tools/remove-pages` | Remove pages |
| `/tools/rotate` | Rotate PDF pages |
| `/tools/watermark` | Watermark PDF |
| `/tools/protect` | Lock & unlock |
| `/tools/sign` | Sign PDF |
| `/tools/compare` | Side-by-side PDF compare (setup + immersive review viewer) |

Legacy hash URLs (`#convert`, `#merge`, etc.) redirect to the matching path automatically.

### Adapter pattern

The frontend uses swappable adapters so mock and live providers can be connected later:

| Adapter | Now | Later |
|---------|-----|-------|
| `AuthAdapter` | Mock (localStorage) | Supabase Auth |
| `BillingAdapter` | Mock (Pro preview) | PayPal subscriptions |
| `StorageAdapter` | IndexedDB workspace tray | Supabase Storage (Pro cloud workspace) |

Environment variables:

| Variable | Values | Purpose |
|----------|--------|---------|
| `VITE_AUTH_PROVIDER` | `mock` \| `supabase` | Sign-in, sign-up, plan |
| `VITE_BILLING_PROVIDER` | `mock` (default) | Checkout and subscription |
| `VITE_SUPABASE_URL` | Supabase project URL | Required when `VITE_AUTH_PROVIDER=supabase` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key | Required when `VITE_AUTH_PROVIDER=supabase` |

Supabase auth uses the **PDF Twin** project with a `profiles` table for plan state (`free` / `pro`). Free users can upload up to **50 MB** without signing in; larger files require an account and **Pro** ($9/month). Free users get **3 PDF → Word/Excel exports per day** and can merge up to **5 PDFs** at once; Pro removes both caps.

## Tech Stack

- **Frontend:** Astro 5 + React 19 (islands) + TypeScript + PDF.js + pdf-lib + Tesseract.js + IndexedDB
- **Backend:** Python FastAPI (Vercel serverless)
- **Libraries:** pypdf, pdf2docx, pdfplumber, openpyxl, PyMuPDF, Pillow

## Visual Design

PDFTwin uses a **Neon Pastel** palette — bright fluorescent pastels (mint, violet, coral) on a luminous white base.

| Role | Token / value | Usage |
|------|---------------|--------|
| Page background | `--bg` (`#F5F8FF`) | Cool luminous white |
| Surfaces | `--surface`, `--surface-muted` | Cards, panels, hero |
| Primary brand | `--accent` (`#00C49A`) | Buttons, links, logo mark |
| Secondary accent | `--accent-secondary` (`#9D2EFF`) | Editorial highlights, organize category |
| Convert category | Fluorescent mint (`--sapphire-*`) | PDF → other formats |
| To-PDF category | Fluorescent amber (`--amber-*`) | Word/images → PDF |
| PDF ops category | Fluorescent violet (`--amethyst-*`) | Edit, merge, compare PDFs |
| Multi-PDF accent | Violet highlight (`--amethyst-*`) | Merge & compare tools and **2+ PDFs** badges |

**Category color reference**

| Category | Background | Accent | Text |
|----------|------------|--------|------|
| PDF from | `#DFFFF8` | `#00E5B4` | `#009973` |
| To PDF | `#FFFCE0` | `#FFD600` | `#CC9900` |
| PDF ops | `#F0E5FF` | `#9D2EFF` | `#7C00E5` |

### Client-side vs server-side

| Client-side (no upload) | Server-side (HTTPS upload, discarded after) |
|-------------------------|---------------------------------------------|
| Merge, split, rotate, compare, extract pages | PDF → Word, PDF → Excel |
| Remove pages, sign PDF | Word → PDF, compress |
| Images → PDF, PDF → JPG/PNG | Watermark, lock/unlock |
| PDF → text, OCR | Extract embedded images |
| | Image convert, image resize |

Client-side tools show a **“Processed on your device”** badge. See [implementation status](docs/product/implementation-status.md) for the full matrix.

**Typography:** [Fraunces](https://fonts.google.com/specimen/Fraunces) for headings, [IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans) for body text (loaded in `BaseLayout.astro`).

**Brand assets:** Fluorescent mint + cream twin-pages mark in `BrandLogo.tsx`, `public/favicon.svg`, `public/apple-touch-icon.svg`, and `public/og-image.svg`. Theme color is `#00c49a`.

Design tokens live in `frontend/src/index.css` under `:root`. Legacy token names (`--sapphire-*`, `--amethyst-*`, `--emerald-*`) are retained for compatibility but map to the fluorescent mint / violet / coral palette.

**Navigation:** The main header (`SiteHeader` + `SiteNav`) uses a flat white bar with category dropdowns (**From PDF**, **To PDF**, **Edit PDF**). The **Edit PDF** dropdown splits into **One PDF** and **Multiple PDFs** blocks with scope hints and **1 PDF** / **2+ PDFs** labels on each link. After **Formats** and **Pricing**, a primary **Compare** button links to `/#workspace`, followed by the **language switcher**. On mobile, a hamburger menu opens a full-height panel with accordion tool lists.

**Homepage (compare-first):** The home route leads with a **compare hero** (primary CTA → `/tools/compare`), a **4-step review workflow** section, six **featured complementary tools**, and a crawlable **All PDFTwin tools** index at `#tools`. The former full tool grid, trust bar, and formats section are no longer on `/` — formats live at `/formats`; full taxonomy remains in header nav. See [compare-first homepage](docs/product/compare-first-homepage.md).

**Tool workspace:** Each `/tools/*` page uses a two-column layout — the active tool panel on the left, upload and file tray (with thumbnails) on the right. **Compare** adds a second **review mode** that hides workspace chrome for a full-width dual-pane viewer. Tool discovery uses the header **All tools** mega menu and [`/tools/` catalog](docs/product/tool-workspace-ui.md#all-tools-catalog-page-tools); the vertical **tool rail** switches between related single-PDF edit tools without a full reload. On mobile, the action column appears first and the file list collapses when files are present. Full spec: [docs/product/tool-workspace-ui.md](docs/product/tool-workspace-ui.md).

## Prerequisites

- Python 3.10+
- Node.js 18+

## Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321). API requests proxy to `http://localhost:8000` during development.

Optional frontend env (see `frontend/.env.example`):

```bash
VITE_AUTH_PROVIDER=supabase
VITE_SUPABASE_URL=https://tcwvrdykeojriwsxglbn.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_BILLING_PROVIDER=mock
VITE_CHECKOUT_LIVE=false
```

For production Supabase setup, the Astro 5 build fix, Vercel env vars, and verification steps, see **[Supabase auth guide](docs/product/supabase-auth.md)**.

## Build & Deploy

```bash
cd frontend
npm run build
```

Output is written to `frontend/dist/`. Vercel runs the Astro build and serves static pages; `/api/*` routes to the FastAPI serverless function.

**Important:** `VITE_*` variables are read at build time. On Vercel, set them under Project → Settings → Environment Variables, then redeploy. The app injects them into each page as `window.__PDFTWIN_ENV__` so client-side auth islands receive Supabase config in production (see [Supabase auth guide](docs/product/supabase-auth.md#astro-5-production-build-fix)).

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/config` | Public config |
| GET | `/api/me` | Current user plan from request headers (preview) |
| POST | `/api/arrange-merge` | Merge PDFs with optional page arrangement |
| POST | `/api/reorder` | Reorder pages in one PDF |
| POST | `/api/split` | Split PDF by page ranges |
| POST | `/api/convert/pdf-to-word` | PDF → Word |
| POST | `/api/convert/pdf-to-excel` | PDF → Excel |
| POST | `/api/convert/image` | Convert image formats |
| POST | `/api/convert/word-to-pdf` | DOCX → PDF |
| POST | `/api/convert/image-resize` | Resize/compress an image |
| POST | `/api/pdf-info` | Page count for a PDF |
| POST | `/api/extract-pages` | Extract pages into one PDF *(legacy — frontend uses client-side pdf-lib)* |
| POST | `/api/extract-images` | Extract embedded images (optional output format) |
| POST | `/api/compress` | Compress PDF (quality preset) |
| POST | `/api/rotate` | Rotate pages in a PDF |
| POST | `/api/watermark` | Add text watermark to a PDF |
| POST | `/api/lock` | Password-protect a PDF |
| POST | `/api/unlock` | Remove PDF restrictions/password when possible |
| POST | `/api/payments/*` | PayPal subscription (Pro) |
| POST | `/api/webhooks/paypal` | PayPal webhook stub (future) |

**Compare PDFs** runs entirely in the browser — no upload to the server for viewing.

Plan-aware endpoints read `X-PDFTwin-Plan` (`free` or `pro`) to apply per-file size limits.

## Split Page Range Format

Use comma-separated ranges in the split form:

- `1-5` — pages 1 through 5
- `3, 7-10` — page 3 and pages 7 through 10
- Multiple ranges return a ZIP file with separate PDFs

## Environment Variables

See `.env.example`:

- `FREE_FILE_LIMIT_MB` — Free plan per-file limit (default 50)
- `PRO_FILE_LIMIT_MB` — Pro plan per-file limit (default 200)
- `FREE_DAILY_DOC_CONVERT_LIMIT` — Free PDF → Word/Excel exports per day (default 3)
- `FREE_MERGE_FILE_LIMIT` — Free merge batch size (default 5; 6+ requires Pro)
- `VITE_AUTH_PROVIDER` / `VITE_BILLING_PROVIDER` — Frontend provider selection (default `mock`)
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — Required when auth provider is `supabase`
- `VITE_CHECKOUT_LIVE` — PayPal live checkout (`true` when backend billing is wired)
- PayPal credentials — Live Pro checkout (backend)

Set frontend env in `frontend/.env` locally and in **Vercel → Environment Variables** for production. After changing `VITE_*` vars, redeploy — they are baked in at build time. See [Supabase auth guide](docs/product/supabase-auth.md) for the full checklist.

## Notes

- PDF-to-Excel extracts structured table data; product images are placed in cells where detected.
- PDF-to-Word uses layout-preserving conversion; complex PDFs may need manual cleanup.
- Word-to-PDF uses PyMuPDF; complex DOCX layouts may need review after conversion.
- Server-side tools process files in memory and do not store them permanently.
- **Compare** renders locally with PDF.js — files never leave the device for viewing. Review mode supports fit-width zoom, single-page navigation, linked scroll, and fullscreen — see [compare-first homepage](docs/product/compare-first-homepage.md).

**Client-side tools** (merge, split, rotate, compare, extract/remove pages, sign, images↔PDF, PDF→text, OCR) run in the browser via pdf-lib, PDF.js, or Tesseract.js — no server upload.

**Merge batch limit:** Free accounts merge up to 5 PDFs at once; 6+ requires Pro (`MergeBatchGate`).

**OCR** uses Tesseract.js (WASM). First run downloads language models; large scans may take a minute in-browser.

**PDF to text** extracts the text layer only — for scanned PDFs, use the OCR tool instead.
- **Unlock** works for restriction-only PDFs and empty passwords; encrypted files need the correct password.
- **Workspace tray** stores files in the browser only (IndexedDB); clearing site data removes them. Thumbnails use in-memory object URLs and a PDF.js page cache — not persisted separately.
- **In-workspace navigation** swaps tools client-side via the History API; the file tray and uploaded files persist across tool switches without re-upload.
- **Mock auth** is for development and UX preview — not suitable for production security.
- **Supabase auth** is live on pdftwin.com when `VITE_AUTH_PROVIDER=supabase` is set at build time. See [Supabase auth guide](docs/product/supabase-auth.md).

## Documentation

Internal docs live in [`docs/`](docs/README.md):

| Topic | Doc |
|-------|-----|
| Compare-first homepage & compare viewer | [Compare-first homepage](docs/product/compare-first-homepage.md) |
| Tool inventory, limits, client vs server | [Implementation status](docs/product/implementation-status.md) |
| Workspace UI (layout, result cards, client nav) | [Tool workspace UI](docs/product/tool-workspace-ui.md) |
| i18n & SEO landings (90 pages) | [i18n](docs/product/i18n.md) |
| Supabase auth & production deploy | [Supabase auth guide](docs/product/supabase-auth.md) |
| Roadmap & deferred items | [Roadmap](docs/strategy/roadmap.md) |
| Monetization & pricing rationale | [Monetization plan](docs/strategy/monetization-plan.md) |

## Multilingual Support

The app supports international filenames and document text (Hindi, Arabic, Greek, Japanese, Russian, Chinese, and more). Downloaded files keep original names via UTF-8 `Content-Disposition` headers.
