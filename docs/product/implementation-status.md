# Implementation status

> Last updated: 2026-07-23 · [Docs hub](../README.md) · [Monetization plan](../strategy/monetization-plan.md)

---

## Tool inventory (18 tools)

Canonical registry: [`frontend/src/config/tools.ts`](../../frontend/src/config/tools.ts)

### Convert & Export (9)

| Tool ID | Route | Processing |
|---------|-------|------------|
| `convert-extract` | `/tools/convert` | Server — PDF → Word/Excel; extract embedded images |
| `image-convert` | `/tools/images` | Server |
| `images-to-pdf` | `/tools/images-to-pdf` | **Client** (pdf-lib) |
| `pdf-to-jpg` | `/tools/pdf-to-jpg` | **Client** (PDF.js) |
| `pdf-to-text` | `/tools/pdf-to-text` | **Client** (PDF.js text layer) |
| `ocr-pdf` | `/tools/ocr` | **Client** (Tesseract.js) |
| `compress-pdf` | `/tools/compress` | Server |
| `word-to-pdf` | `/tools/word-to-pdf` | Server |
| `image-resize` | `/tools/resize` | Server |

### Organize Documents (6)

| Tool ID | Route | Processing |
|---------|-------|------------|
| `pdf-compare` | `/tools/compare` | **Client** (PDF.js) |
| `arrange-merge` | `/tools/merge` | **Client** (pdf-lib) — batch gate on free |
| `split` | `/tools/split` | **Client** (pdf-lib + JSZip) |
| `extract-pages` | `/tools/extract` | Server |
| `remove-pages` | `/tools/remove-pages` | **Client** (pdf-lib) |
| `rotate-pdf` | `/tools/rotate` | **Client** (pdf-lib) |

### Protect Files (3)

| Tool ID | Route | Processing |
|---------|-------|------------|
| `watermark-pdf` | `/tools/watermark` | Server |
| `lock-unlock` | `/tools/protect` | Server |
| `sign-pdf` | `/tools/sign` | **Client** (pdf-lib) |

**Summary:** 10 client-side · 8 server-side

---

## Plans & limits (live)

| Setting | Free | Pro |
|---------|------|-----|
| Price | $0 | **$9/mo** |
| File size limit | **50 MB** | 200 MB |
| PDF → Word/Excel | **3/day** | Unlimited |
| Merge batch size | **5 PDFs** | Unlimited |
| Watermarks | Never | Never |
| Account required | No | For Pro checkout |

**Config files:**

- Frontend: [`frontend/src/config/limits.ts`](../../frontend/src/config/limits.ts), [`pricing.ts`](../../frontend/src/config/pricing.ts)  
- Backend: [`backend/services/entitlements.py`](../../backend/services/entitlements.py)  
- Env: [`.env.example`](../../.env.example)  

---

## Merge batch gate (5+ → Pro)

**Scope:** Merge & Arrange tool only. Free users can merge up to **5 PDFs** in one batch; **6+** requires Pro.

| Layer | Implementation |
|-------|----------------|
| Limit constant | [`limits.ts`](../../frontend/src/config/limits.ts) — `FREE_MERGE_FILE_LIMIT = 5` |
| Counter UI | [`ArrangeMergePanel.tsx`](../../frontend/src/components/ArrangeMergePanel.tsx) — shows `N / 5 PDFs` |
| Gate UI | [`MergeBatchGate.tsx`](../../frontend/src/components/MergeBatchGate.tsx) |
| Enforcement | Client-side only (merge runs in browser; no server merge call) |

Pro bypass via `useAuth()` plan check (`entitlements.isPro`). Split, rotate, compare, and other organize tools are **not** gated.

---

## Daily document export cap

**Scope:** Only `/api/convert/pdf-to-word` and `/api/convert/pdf-to-excel`.

| Layer | Implementation |
|-------|----------------|
| Backend | [`backend/services/daily_usage.py`](../../backend/services/daily_usage.py) — HttpOnly cookie `pdftwin_doc_convert` |
| Frontend UX | [`frontend/src/services/dailyUsage.ts`](../../frontend/src/services/dailyUsage.ts) — localStorage mirror |
| Gate UI | [`frontend/src/components/ConvertLimitGate.tsx`](../../frontend/src/components/ConvertLimitGate.tsx) |
| Panel | [`frontend/src/components/ConvertExtractPanel.tsx`](../../frontend/src/components/ConvertExtractPanel.tsx) — remaining count + upgrade prompt |

Pro users bypass via `X-PDFTwin-Plan: pro` header.

Image extraction, OCR, PDF-to-text, and other tools are **not** capped.

---

## Client-side tools

### pdf-lib + JSZip

**Service:** [`frontend/src/services/pdfClient.ts`](../../frontend/src/services/pdfClient.ts)

| Tool | Panel | Notes |
|------|-------|-------|
| Merge & arrange | [`ArrangeMergePanel.tsx`](../../frontend/src/components/ArrangeMergePanel.tsx) | Free: max 5 PDFs per merge |
| Split | [`SplitPanel.tsx`](../../frontend/src/components/SplitPanel.tsx) | Multi-range → ZIP |
| Rotate | [`RotatePanel.tsx`](../../frontend/src/components/RotatePanel.tsx) | |
| Remove pages | [`RemovePagesPanel.tsx`](../../frontend/src/components/RemovePagesPanel.tsx) | Inverse of extract |
| Images → PDF | [`ImagesToPdfPanel.tsx`](../../frontend/src/components/ImagesToPdfPanel.tsx) | Drag to reorder pages |
| Sign PDF | [`SignPdfPanel.tsx`](../../frontend/src/components/SignPdfPanel.tsx) | Draw or upload PNG signature |

Legacy server endpoints (`/api/merge`, `/api/arrange-merge`, `/api/split`, `/api/rotate`) still exist but the frontend no longer calls them.

### PDF.js

**Service:** [`frontend/src/services/pdfJsClient.ts`](../../frontend/src/services/pdfJsClient.ts)

| Tool | Panel | Notes |
|------|-------|-------|
| Compare | [`ComparePanel.tsx`](../../frontend/src/components/ComparePanel.tsx) | Side-by-side render |
| PDF → JPG/PNG | [`PdfToJpgPanel.tsx`](../../frontend/src/components/PdfToJpgPanel.tsx) | Multi-page → ZIP |
| PDF → Text | [`PdfToTextPanel.tsx`](../../frontend/src/components/PdfToTextPanel.tsx) | Text layer only; scans → use OCR |

### Tesseract.js

**Service:** [`frontend/src/services/ocrClient.ts`](../../frontend/src/services/ocrClient.ts)

| Tool | Panel | Notes |
|------|-------|-------|
| OCR | [`OcrPanel.tsx`](../../frontend/src/components/OcrPanel.tsx) | PDF pages + images → `.txt`; languages: eng, spa, fra, deu, nld, por, ita |

**Dependency:** `tesseract.js` (WASM loaded on first OCR run).

**UI badge:** [`ClientProcessedBadge.tsx`](../../frontend/src/components/ClientProcessedBadge.tsx) — “Processed on your device”.

---

## Server-side tools

Still upload to FastAPI (in-memory, discarded):

- PDF → Word, PDF → Excel *(daily cap on free)*  
- Word → PDF  
- Compress PDF  
- Watermark, lock/unlock  
- Extract pages  
- Extract embedded images  
- Image convert / resize  

---

## Billing & auth

| Feature | Status |
|---------|--------|
| PayPal subscription stub | Backend wired; `VITE_CHECKOUT_LIVE` for production |
| Pro price in code | **$9.00** |
| Supabase auth | Optional via `VITE_AUTH_PROVIDER=supabase` |
| Mock auth / Pro preview | Default for local dev |
| Cloud workspace | **Not started** — deferred |

---

## Deferred (see [roadmap](../strategy/roadmap.md))

- Cloud workspace sync (Supabase Storage)  
- Business tier  
- Annual Pro plan  
- Move extract pages, watermark, lock/unlock client-side  
- SEO landings for new tools (rotate, extract, sign, OCR, etc.)  
- “PDFTwin vs iLovePDF” comparison page  
- Tool panel UI translation (Phase 1.5 i18n)  
- Priority queue differentiation  
- Client-side compress (Ghostscript WASM or light preset)

---

## Architecture summary

```
Browser (client-side)                    Server (FastAPI / Vercel)
─────────────────────                    ─────────────────────────
Merge, split, rotate, compare            PDF → Word/Excel (capped)
Remove pages, sign PDF                   Compress, watermark, lock
Images → PDF, PDF → JPG/PNG              Word → PDF, image convert/resize
PDF → text, OCR (Tesseract.js)           Extract pages, extract images
                                         In-memory only, no storage
```

---

## Internationalization

English is the default at `/`. Spanish, French, and Dutch use prefixed routes (`/es/`, `/fr/`, `/nl/`).

- **Translated:** home, nav, footer, pricing, tool names/descriptions in grid, 24 SEO landings (6 tools × 4 locales)  
- **Not yet translated:** in-tool panel UI, login/account/privacy/terms  

See [docs/product/i18n.md](../product/i18n.md).

---

## Related

- [ihatepdf profile](../competitive/ihatepdf.md) — what 100% client-side looks like  
- [Learnings](../strategy/learnings-and-positioning.md) — why hybrid  
- [Monetization plan](../strategy/monetization-plan.md) — Pro triggers
