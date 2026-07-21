# PDFTwin

**PDFTwin** is a multi-page business file conversion workspace. Convert PDFs and images, compare documents side by side, merge and split files, compress and rotate PDFs, and protect confidential documents — all in the browser with no install.

Live site: [pdftwin.com](https://pdftwin.com)

## Features

### Convert & Export
- **Document conversion** — PDF to Word (.docx) or Excel (.xlsx); extract embedded images as WebP, PNG, or JPEG
- **Word to PDF** — Convert DOCX proposals and contracts into share-ready PDFs
- **Image conversion** — PNG, JPG, WebP, GIF, BMP, TIFF → WebP, PNG, or JPEG
- **Resize images** — Shrink photos and brand assets with quality and dimension controls
- **Compress PDF** — Reduce file size with quality presets

### Organize Documents
- **Compare PDFs** — Side-by-side viewer with linked scroll and linked/independent zoom (client-side, powered by PDF.js)
- **Merge & arrange** — Combine multiple PDFs and reorder pages before export
- **Split PDF** — Split by page ranges (e.g. `1-3, 5-7`)
- **Extract pages** — Pull selected pages into a new PDF
- **Rotate PDF** — Rotate all pages or selected pages by 90°, 180°, or 270°

### Protect Files
- **Watermark PDF** — Add confidential or draft watermarks across every page
- **Lock & unlock** — Add password protection or remove restrictions when permitted

### Account & Workspace (preview)
- **Mock sign-in** — Create an account stored in the browser (localStorage) for preview; ready to swap to Supabase later
- **Pro preview** — Toggle Pro plan from Account or checkout flow to unlock 200 MB uploads
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
| `/tools/resize` | Resize & compress images |
| `/tools/word-to-pdf` | Word to PDF |
| `/tools/compress` | Compress PDF |
| `/tools/compare` | Side-by-side PDF compare |
| `/tools/merge` | Merge & arrange |
| `/tools/split` | Split PDF |
| `/tools/extract` | Extract pages |
| `/tools/rotate` | Rotate PDF pages |
| `/tools/watermark` | Watermark PDF |
| `/tools/protect` | Lock & unlock |

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
| `VITE_AUTH_PROVIDER` | `mock` (default) | Sign-in, sign-up, plan |
| `VITE_BILLING_PROVIDER` | `mock` (default) | Checkout and subscription |

Mock auth persists session in `localStorage` and syncs across React islands via a custom event. API requests include `X-PDFTwin-Plan` and `X-PDFTwin-User-Id` headers so the backend can enforce file-size limits per plan.

## Tech Stack

- **Frontend:** Astro 5 + React 19 (islands) + TypeScript + PDF.js + IndexedDB
- **Backend:** Python FastAPI (Vercel serverless)
- **Libraries:** pypdf, pdf2docx, pdfplumber, openpyxl, PyMuPDF, Pillow

## Visual Design

PDFTwin uses a **Paper & Ink** palette — warm editorial surfaces with forest-green brand accents and a trio of pastel category colors.

| Role | Token / value | Usage |
|------|---------------|--------|
| Page background | `--bg` (`#F7F5F0`) | Warm paper tone |
| Surfaces | `--surface`, `--surface-muted` | Cards, panels, hero |
| Primary brand | `--accent` (`#1B4332`) | Buttons, links, logo mark |
| Secondary accent | `--amethyst-600` (`#C2410C`) | Editorial highlights, organize category |
| Convert category | Sage (`--sapphire-*`) | Convert & export tools |
| Organize category | Peach (`--amethyst-*`) | Merge, split, compare, rotate |
| Protect category | Wheat (`--emerald-*`) | Watermark, lock/unlock |

**Typography:** [Fraunces](https://fonts.google.com/specimen/Fraunces) for headings, [IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans) for body text (loaded in `BaseLayout.astro`).

**Brand assets:** Forest + cream twin-pages mark in `BrandLogo.tsx`, `public/favicon.svg`, `public/apple-touch-icon.svg`, and `public/og-image.svg`. Theme color is `#1b4332`.

Design tokens live in `frontend/src/index.css` under `:root`. Legacy token names (`--sapphire-*`, `--amethyst-*`, `--emerald-*`) are retained for compatibility but map to the sage / peach / wheat palette.

**Navigation:** The main header (`SiteHeader` + `SiteNav`) uses a flat white bar with category dropdowns (Convert, Organize, Protect), inspired by tool-directory sites but styled with PDFTwin’s forest palette and pastel category headers. On mobile, a hamburger menu opens a full-height panel with accordion tool lists.

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

Optional frontend env (see `.env.example`):

```bash
VITE_AUTH_PROVIDER=mock
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

- `FREE_FILE_LIMIT_MB` — Free plan per-file limit (default 30)
- `PRO_FILE_LIMIT_MB` — Pro plan per-file limit (default 200)
- `VITE_AUTH_PROVIDER` / `VITE_BILLING_PROVIDER` — Frontend provider selection (default `mock`)
- PayPal credentials for live Pro checkout

Set `VITE_CHECKOUT_LIVE=true` in the frontend environment when PayPal billing is wired for production.

## Notes

- PDF-to-Excel extracts structured table data; product images are placed in cells where detected.
- PDF-to-Word uses layout-preserving conversion; complex PDFs may need manual cleanup.
- Word-to-PDF uses PyMuPDF; complex DOCX layouts may need review after conversion.
- Server-side tools process files in memory and do not store them permanently.
- **Compare** renders locally with PDF.js — files never leave the device for viewing.
- **Unlock** works for restriction-only PDFs and empty passwords; encrypted files need the correct password.
- **Workspace tray** stores files in the browser only; clearing site data removes them.
- **Mock auth** is for development and UX preview — not suitable for production security.

## Multilingual Support

The app supports international filenames and document text (Hindi, Arabic, Greek, Japanese, Russian, Chinese, and more). Downloaded files keep original names via UTF-8 `Content-Disposition` headers.
