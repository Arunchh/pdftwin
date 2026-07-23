# PDFTwin

**PDFTwin** is a multi-page business file conversion workspace — **18 tools** for converting PDFs and images, comparing documents, merging and splitting files, signing and protecting documents, and extracting text — all in the browser with no install.

Live site: [pdftwin.com](https://pdftwin.com)

**Internal docs:** [docs/README.md](docs/README.md) — competitive research (ihatepdf), monetization plan, roadmap, implementation status, [i18n](docs/product/i18n.md).

## Languages

PDFTwin supports **English** (default), **Spanish** (`/es/`), **French** (`/fr/`), and **Dutch** (`/nl/`). On Vercel, first-time visitors from matching regions are redirected based on country and browser language. Use the globe menu in the header to switch manually.

## Features

### Convert & Export
- **Document conversion** — PDF to Word (.docx) or Excel (.xlsx); extract embedded images as WebP, PNG, or JPEG *(server)*
- **Word to PDF** — Convert DOCX proposals and contracts into share-ready PDFs *(server)*
- **Image conversion** — PNG, JPG, WebP, GIF, BMP, TIFF → WebP, PNG, or JPEG *(server)*
- **Images to PDF** — Combine JPG, PNG, and other images into one PDF *(client-side)*
- **PDF to JPG/PNG** — Export PDF pages as image files; multi-page downloads as ZIP *(client-side)*
- **PDF to Text** — Extract selectable text to a `.txt` file *(client-side)*
- **OCR text extract** — Turn scanned PDFs and photos into editable text with Tesseract.js *(client-side)*
- **Resize images** — Shrink photos and brand assets with quality and dimension controls *(server)*
- **Compress PDF** — Reduce file size with quality presets *(server)*

### Organize Documents
- **Compare PDFs** — Side-by-side viewer with linked scroll and linked/independent zoom *(client-side, PDF.js)*
- **Merge & arrange** — Combine multiple PDFs and reorder pages; free tier merges up to **5 PDFs** at once *(client-side)*
- **Split PDF** — Split by page ranges (e.g. `1-3, 5-7`) *(client-side)*
- **Extract pages** — Pull selected pages into a new PDF *(server)*
- **Remove pages** — Delete unwanted pages from a PDF *(client-side)*
- **Rotate PDF** — Rotate all pages or selected pages by 90°, 180°, or 270° *(client-side)*

### Protect Files
- **Watermark PDF** — Add confidential or draft watermarks across every page *(server)*
- **Lock & unlock** — Add password protection or remove restrictions when permitted *(server)*
- **Sign PDF** — Draw a signature or upload a PNG and place it on selected pages *(client-side)*

### Account & Workspace (preview)
- **Mock sign-in** — Create an account stored in the browser (localStorage) for preview; ready to swap to Supabase later
- **Pro preview** — Toggle Pro plan from Account or checkout flow to unlock 200 MB uploads and unlimited PDF → Word/Excel exports
- **Workspace file tray** — Files stay in IndexedDB while you switch between tools — no re-upload needed
- **Compare + tray** — Pick left/right PDFs directly from the workspace tray

## Architecture

PDFTwin is **not a single-page app**. It uses **Astro** to pre-render real URLs; interactive tools hydrate as **React islands** only where needed.

| Route | Page |
|-------|------|
| `/` | Home — hero, tools, supported formats |
| `/formats` | Format reference |
| `/pricing` | Plans, FAQ, Pro checkout |
| `/login` | Sign in |
| `/signup` | Create account |
| `/account` | Plan, profile, workspace usage |
| `/privacy` | Privacy policy |
| `/terms` | Terms of use |
| `/tools/convert` | Document conversion |
| `/tools/images` | Image conversion |
| `/tools/images-to-pdf` | Images to PDF |
| `/tools/pdf-to-jpg` | PDF to JPG/PNG |
| `/tools/pdf-to-text` | PDF to text |
| `/tools/ocr` | OCR text extract |
| `/tools/resize` | Resize & compress images |
| `/tools/word-to-pdf` | Word to PDF |
| `/tools/compress` | Compress PDF |
| `/tools/compare` | Side-by-side PDF compare |
| `/tools/merge` | Merge & arrange |
| `/tools/split` | Split PDF |
| `/tools/extract` | Extract pages |
| `/tools/remove-pages` | Remove pages |
| `/tools/rotate` | Rotate PDF pages |
| `/tools/watermark` | Watermark PDF |
| `/tools/protect` | Lock & unlock |
| `/tools/sign` | Sign PDF |

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
| Convert category | Fluorescent mint (`--sapphire-*`) | Convert & export tools |
| Organize category | Fluorescent violet (`--amethyst-*`) | Merge, split, compare, rotate |
| Protect category | Fluorescent coral (`--emerald-*`) | Watermark, lock/unlock, compress |

**Category color reference**

| Category | Background | Accent | Text |
|----------|------------|--------|------|
| Convert | `#DFFFF8` | `#00E5B4` | `#009973` |
| Organize | `#F0E5FF` | `#9D2EFF` | `#7C00E5` |
| Protect | `#FFE8DC` | `#FF5722` | `#E04412` |

### Client-side vs server-side

| Client-side (no upload) | Server-side (HTTPS upload, discarded after) |
|-------------------------|---------------------------------------------|
| Merge, split, rotate, compare | PDF → Word, PDF → Excel |
| Remove pages, sign PDF | Word → PDF, compress |
| Images → PDF, PDF → JPG/PNG | Watermark, lock/unlock |
| PDF → text, OCR | Extract pages, extract images |
| | Image convert, image resize |

Client-side tools show a **“Processed on your device”** badge. See [implementation status](docs/product/implementation-status.md) for the full matrix.

**Typography:** [Fraunces](https://fonts.google.com/specimen/Fraunces) for headings, [IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans) for body text (loaded in `BaseLayout.astro`).

**Brand assets:** Fluorescent mint + cream twin-pages mark in `BrandLogo.tsx`, `public/favicon.svg`, `public/apple-touch-icon.svg`, and `public/og-image.svg`. Theme color is `#00c49a`.

Design tokens live in `frontend/src/index.css` under `:root`. Legacy token names (`--sapphire-*`, `--amethyst-*`, `--emerald-*`) are retained for compatibility but map to the fluorescent mint / violet / coral palette.

**Navigation:** The main header (`SiteHeader` + `SiteNav`) uses a flat white bar with category dropdowns (Convert, Organize, Protect), inspired by tool-directory sites but styled with PDFTwin’s fluorescent mint palette and bright pastel category headers. On mobile, a hamburger menu opens a full-height panel with accordion tool lists.

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
```

## Build & Deploy

```bash
cd frontend
npm run build
```

Output is written to `frontend/dist/`. Vercel runs the Astro build and serves static pages; `/api/*` routes to the FastAPI serverless function.

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
| POST | `/api/extract-pages` | Extract pages into one PDF |
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
- PayPal credentials for live Pro checkout

Set `VITE_CHECKOUT_LIVE=true` in the frontend environment when PayPal billing is wired for production.

## Notes

- PDF-to-Excel extracts structured table data; product images are placed in cells where detected.
- PDF-to-Word uses layout-preserving conversion; complex PDFs may need manual cleanup.
- Word-to-PDF uses PyMuPDF; complex DOCX layouts may need review after conversion.
- Server-side tools process files in memory and do not store them permanently.
- **Compare** renders locally with PDF.js — files never leave the device for viewing.

**Client-side tools** (merge, split, rotate, compare, sign, remove pages, images↔PDF, PDF→text, OCR) run in the browser via pdf-lib, PDF.js, or Tesseract.js — no server upload.

**Merge batch limit:** Free accounts merge up to 5 PDFs at once; 6+ requires Pro (`MergeBatchGate`).

**OCR** uses Tesseract.js (WASM). First run downloads language models; large scans may take a minute in-browser.

**PDF to text** extracts the text layer only — for scanned PDFs, use the OCR tool instead.
- **Unlock** works for restriction-only PDFs and empty passwords; encrypted files need the correct password.
- **Workspace tray** stores files in the browser only; clearing site data removes them.
- **Mock auth** is for development and UX preview — not suitable for production security.

## Multilingual Support

The app supports international filenames and document text (Hindi, Arabic, Greek, Japanese, Russian, Chinese, and more). Downloaded files keep original names via UTF-8 `Content-Disposition` headers.
