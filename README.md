# PDFTwin

**PDFTwin** is a multi-page business file conversion workspace. Convert PDFs and images, compare documents side by side, merge and split files, and protect confidential documents — all in the browser with no install.

Live site: [pdftwin.com](https://pdftwin.com)

## Features

### Convert & Export
- **Document conversion** — PDF to Word (.docx) or Excel (.xlsx); extract embedded images as WebP, PNG, or JPEG
- **Image conversion** — PNG, JPG, WebP, GIF, BMP, TIFF → WebP, PNG, or JPEG

### Organize Documents
- **Compare PDFs** — Side-by-side viewer with linked scroll and linked/independent zoom (client-side, powered by PDF.js)
- **Merge & arrange** — Combine multiple PDFs and reorder pages before export
- **Split PDF** — Split by page ranges (e.g. `1-3, 5-7`)
- **Extract pages** — Pull selected pages into a new PDF

### Protect Files
- **Lock & unlock** — Add password protection or remove restrictions when permitted

## Architecture

PDFTwin is **not a single-page app**. It uses **Astro** to pre-render real URLs; interactive tools hydrate as **React islands** only where needed.

| Route | Page |
|-------|------|
| `/` | Home — hero, tools, supported formats |
| `/formats` | Format reference |
| `/pricing` | Plans, FAQ, Pro checkout |
| `/tools/convert` | Document conversion |
| `/tools/images` | Image conversion |
| `/tools/compare` | Side-by-side PDF compare |
| `/tools/merge` | Merge & arrange |
| `/tools/split` | Split PDF |
| `/tools/extract` | Extract pages |
| `/tools/protect` | Lock & unlock |

Legacy hash URLs (`#convert`, `#merge`, etc.) redirect to the matching path automatically.

## Tech Stack

- **Frontend:** Astro 5 + React 19 (islands) + TypeScript + PDF.js
- **Backend:** Python FastAPI (Vercel serverless)
- **Libraries:** pypdf, pdf2docx, pdfplumber, openpyxl, PyMuPDF, Pillow

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
| POST | `/api/arrange-merge` | Merge PDFs with optional page arrangement |
| POST | `/api/reorder` | Reorder pages in one PDF |
| POST | `/api/split` | Split PDF by page ranges |
| POST | `/api/convert/pdf-to-word` | PDF → Word |
| POST | `/api/convert/pdf-to-excel` | PDF → Excel |
| POST | `/api/convert/image` | Convert image formats |
| POST | `/api/pdf-info` | Page count for a PDF |
| POST | `/api/extract-pages` | Extract pages into one PDF |
| POST | `/api/extract-images` | Extract embedded images (optional output format) |
| POST | `/api/lock` | Password-protect a PDF |
| POST | `/api/unlock` | Remove PDF restrictions/password when possible |
| POST | `/api/payments/*` | PayPal subscription (Pro) |

**Compare PDFs** runs entirely in the browser — no upload to the server for viewing.

## Split Page Range Format

Use comma-separated ranges in the split form:

- `1-5` — pages 1 through 5
- `3, 7-10` — page 3 and pages 7 through 10
- Multiple ranges return a ZIP file with separate PDFs

## Environment Variables

See `.env.example`:

- `FREE_FILE_LIMIT_MB` — Free plan per-file limit (default 30)
- `PRO_FILE_LIMIT_MB` — Pro plan per-file limit (default 200)
- PayPal credentials for live Pro checkout

Set `VITE_CHECKOUT_LIVE=true` in the frontend environment when PayPal billing is wired for production.

## Notes

- PDF-to-Excel extracts structured table data; product images are placed in cells where detected.
- PDF-to-Word uses layout-preserving conversion; complex PDFs may need manual cleanup.
- Server-side tools process files in memory and do not store them permanently.
- **Compare** renders locally with PDF.js — files never leave the device for viewing.
- **Unlock** works for restriction-only PDFs and empty passwords; encrypted files need the correct password.

## Multilingual Support

The app supports international filenames and document text (Hindi, Arabic, Greek, Japanese, Russian, Chinese, and more). Downloaded files keep original names via UTF-8 `Content-Disposition` headers.
