# PDF Tools Web App

A full-stack web application for working with PDF, Excel, and Word documents.

## Features

- **Upload** — PDF, Excel (.xlsx, .xls), and Word (.docx, .doc) files (shared upload for all tools)
- **Convert** — PDF to Word (.docx) or Excel (.xlsx)
- **Merge** — Combine multiple PDFs into one file
- **Split** — Split a PDF by page ranges (e.g. `1-3, 5-7, 10`)
- **Reorder** — Rearrange PDF pages into a custom order
- **Extract pages** — Pull selected pages into one new PDF
- **Extract images** — Save embedded images from a PDF (ZIP if multiple)
- **Unlock** — Remove restrictions or password protection when possible

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Backend:** Python FastAPI
- **Libraries:** pypdf, pdf2docx, pdfplumber, openpyxl, PyMuPDF

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

Open [http://localhost:5173](http://localhost:5173) in your browser.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/upload` | Upload files |
| POST | `/api/merge` | Merge PDFs |
| POST | `/api/split` | Split PDF by page ranges |
| POST | `/api/convert/pdf-to-word` | Convert PDF to Word |
| POST | `/api/convert/pdf-to-excel` | Convert PDF to Excel |
| POST | `/api/reorder` | Reorder PDF pages |
| POST | `/api/extract-pages` | Extract pages into one PDF |
| POST | `/api/extract-images` | Extract embedded images |
| POST | `/api/unlock` | Remove PDF restrictions/password when possible |

## Split Page Range Format

Use comma-separated ranges in the split form:

- `1-5` — pages 1 through 5
- `3, 7-10` — page 3 and pages 7 through 10
- Multiple ranges return a ZIP file with separate PDFs

## Notes

- PDF-to-Excel extracts structured table data (like iLovePDF): rows/columns in one sheet, product images placed in their cells — not full-page snapshots.
- PDF-to-Word uses layout-preserving conversion; complex PDFs may need manual cleanup.
- Files are processed in memory and are not stored permanently on the server.
- **Unlock** works automatically for restriction-only PDFs and empty passwords. Strongly encrypted files require the correct password.

## Multilingual support

The app supports international filenames and document text across scripts including:

- Hindi (Devanagari)
- Arabic
- Greek
- Japanese
- Russian
- Chinese and other Unicode characters

Downloaded files keep their original non-English names via UTF-8 `Content-Disposition` headers.
Converted Excel cells preserve Unicode text from the source PDF.
