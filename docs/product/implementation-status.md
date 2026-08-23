# Implementation status

> Last updated: 2026-07-28 · [Docs hub](../README.md) · [Monetization plan](../strategy/monetization-plan.md)

### Shipped (2026-08-23 — UI/UX Overhaul & Attention Diet)

- **Calmed global chrome**: Removed the `AnnouncementBanner` to clear up the header. Simplified `SiteHeader` CTAs, demoting the "Upgrade" button and the secondary marketing hero. Moved `FormatSupportSection` exclusively to `/formats`.
- **File-led home**: Rebuilt the empty state on the home page around the core purpose + dropzone. When files are uploaded, context-aware suggestions (Compare PDFs, Merge PDFs, Compress, etc.) are shown. The tool rail is hidden until a specific tool is chosen.
- **Result as next chapter**: The `ToolResultCard` now makes "Download" the sole primary visual action. Next steps (like "Convert to Word" or "Merge") are presented as secondary actions below it, reducing cognitive load. Added post-review next steps to the `ComparePanel`.
- **Workspace quieted**: Softened the UI of paywall components (`UploadProGate`, `ConvertLimitGate`, `MergeBatchGate`) with a `panel-soft` styling instead of aggressive, attention-grabbing colors. The tool rail `.workspace-tool-rail` now acts as a quiet switcher.
- **Visual hierarchy**: Enforced a single accent color for primary actions. Violet is used exclusively for the Compare tool, and coral for error/destructive actions. Cleaned up unused components (`ToolGrid.tsx`, `HeroSection.tsx`) and CSS.

### Shipped (2026-07-28 — remove workspace tool switcher)

- **Workspace tool switcher removed** — [`WorkspaceToolSwitcher.tsx`](../../frontend/src/components/layout/WorkspaceToolSwitcher.tsx) deleted; category and tool tabs no longer render under the home upload zone or on `/tools/*` routes. Users pick tools from the header **All tools** mega menu or [`/tools/` catalog](./tool-workspace-ui.md#all-tools-catalog-page-tools). The vertical **tool rail** remains for switching between related single-PDF edit tools within a session.

### Shipped (2026-07-28 — tools catalog page + SEO)

- **`/tools/` catalog page** — [`ToolsIndexPage.tsx`](../../frontend/src/components/content/ToolsIndexPage.tsx) + [`pages/tools/index.astro`](../../frontend/src/pages/tools/index.astro): full-page mega-menu-style index of all 18 tools (5 locales). **Browse full tool index** in nav, footer, workspace, and hero now link here instead of `/#tools`.
- **SEO** — Per-locale `meta.toolsIndexTitle` / `toolsIndexDescription`; `ItemList` + `BreadcrumbList` JSON-LD on catalog pages; [`sitemap.xml`](../../frontend/public/sitemap.xml) entries for `/tools/`; `WebSite.hasPart` in [`SeoStructuredData.tsx`](../../frontend/src/components/SeoStructuredData.tsx); legacy `#tools` hash redirects to `/tools/` via [`BaseLayout.astro`](../../frontend/src/layouts/BaseLayout.astro).
- **Nav mega menu** — Smoother scroll (`scroll-behavior: smooth`, styled scrollbar).

### Shipped (2026-07-28 — vertical tool rail)

- **Workspace tool rail** — [`WorkspaceToolRail.tsx`](../../frontend/src/components/layout/WorkspaceToolRail.tsx): sticky vertical icon toolbar for all eight **single-PDF** pdf-ops tools (pages, markup, protect groups). Layout: rail | panel | file tray. Mobile: horizontal scroll strip. See [tool workspace UI — vertical tool rail](./tool-workspace-ui.md#vertical-tool-rail-single-pdf-edit-tools).

### Shipped (2026-07-28 — home UX + chrome)

- **Unified compare workspace (2026-08-23)** — Home (`/`) and `/tools/compare` share the same layout with dual upload slots and live PDF thumbnails. Removed `variant="homeHero"`.
- **Document canvas layout (2026-08-23)** — Center workspace capped at A4 width (`51rem`); upload sidebar on the right. Compare review uses 2× A4. See [compare-first homepage](./compare-first-homepage.md#document-canvas-layout-2026-08-23).
- **Upload-first home hero** *(superseded 2026-08-23)* — Former `variant="homeHero"` single-column dropzone + tool suggestions.
- **Workspace category order** — [`WORKSPACE_CATEGORY_ORDER`](../../frontend/src/config/tools.ts) puts **Work with PDFs** first in the header mega menu and `/tools/` catalog.
- **Header All tools mega menu** — [`SiteNav`](../../frontend/src/components/layout/SiteNav.tsx): **From PDF**, **To PDF**, and **Edit PDF** moved under one **All tools** dropdown (3-column mega menu on desktop; accordion on mobile). Top-level nav freed to **All tools · Pricing · Compare · language**.
- **Announcement banner — mobile compact** — [`AnnouncementBanner.tsx`](../../frontend/src/components/layout/AnnouncementBanner.tsx): tighter padding; email and **Join waitlist** stay on one row with minimal gap (≤640px no longer stacks full-width).
- **Header nav — neutral background** — [`SiteHeader`](../../frontend/src/components/layout/SiteHeader.tsx): sticky bar uses neutral `#f6f7f9` with backdrop blur instead of pure white.

### Shipped (2026-07-28 — nav + workspace layout)

- **Header nav — Compare CTA + language order** — [`SiteNav.tsx`](../../frontend/src/components/layout/SiteNav.tsx): primary **Compare** button (`/#workspace`) followed by the **language switcher** at the end of the main nav bar (Formats · Pricing · Compare · language).
- **Workspace column swap** — [`ToolWorkspace.tsx`](../../frontend/src/components/ToolWorkspace.tsx): **tool panel left**, **file upload tray right** on desktop (`grid-template-columns: 1fr + 320px`). Mobile unchanged (tool panel first, collapsible file list). See [tool workspace UI — overview](./tool-workspace-ui.md#overview).

### Shipped (2026-07-27 — compare diff + worker)

- **PDF compare — diff modes** — Opt-in analysis from review toolbar: text redline, visual pixel overlay, 50% overlay blend. Default remains viewer-only. See [pdf-compare-diff](./pdf-compare-diff.md).
- **Compare diff Web Worker** — Pixel loops and line diffs run in `compareDiff.worker.ts`; PDF.js render/text extraction stays on main thread.
- **Swap left/right** — Instant pane swap in setup and review toolbar without re-parsing PDFs.

### Shipped (2026-07-27 — compare-first)

- **Compare-first homepage** — [`HomeCompareHeroSection`](../../frontend/src/components/layout/HomeCompareHeroSection.tsx) embeds compare workspace on `/`; [`HeroSection`](../../frontend/src/components/layout/HeroSection.tsx), [`HomeWorkflowSection`](../../frontend/src/components/layout/HomeWorkflowSection.tsx), [`HomeToolsSection`](../../frontend/src/components/layout/HomeToolsSection.tsx) replace full `ToolGrid`, `TrustBar`, and `FormatSupportSection`. Crawlable `#tools` index preserves internal SEO links. See [compare-first homepage](./compare-first-homepage.md).
- **PDF compare — review mode** — [`ComparePanel.tsx`](../../frontend/src/components/ComparePanel.tsx): setup phase + immersive viewer (zoom, fit-width, single-page / continuous modes, page nav, fullscreen, keyboard shortcuts). **2026-08-23:** dual-slot [`CompareFileTray`](../../frontend/src/components/compare/CompareFileTray.tsx) with **Left** / **Right** labels, primary **Compare** CTA (enabled when both PDFs load), no vs divider; home and `/tools/compare` unified. [`ToolWorkspace.tsx`](../../frontend/src/components/ToolWorkspace.tsx) wires `compareTrigger` and `onReviewReadinessChange`; hides file tray and tool rail in review mode. **2026-08-23 (fix):** ResizeObserver on pane scroll areas re-runs fit-to-width after review layout expands; debounced fit avoids render races; centered toolbar **Preparing viewer…** buffer while pages paint.
- **Home & compare i18n** — New `hero`, `home`, and `compare` message namespaces in all 5 locales. Updated `meta.homeTitle` / `meta.homeDescription` with compare keywords. `BUSINESS_TAGLINE` and structured data feature list prioritize compare.

### Shipped (2026-07-27 — taxonomy)

- **Tool taxonomy — conversion direction + input scope** — Nav and workspace switcher group tools by **PDF → other formats**, **convert → PDF**, and **work with PDFs**. The PDF-ops group splits visually into **One PDF** (single-file tools) and **Multiple PDFs** (merge, compare). Each tool declares `inputScope: "single" | "multi"` in [`tools.ts`](../../frontend/src/config/tools.ts); cards and nav links show **1 PDF** / **2+ PDFs** badges. See [tool workspace UI — tool taxonomy](./tool-workspace-ui.md#tool-taxonomy-home-grid--navigation).
- **Extract pages → client-side** — [`ExtractPagesPanel.tsx`](../../frontend/src/components/ExtractPagesPanel.tsx) uses `extractPdfPages()` in [`pdfClient.ts`](../../frontend/src/services/pdfClient.ts). Organize category is now fully client-side. Split: **11 client / 7 server**.

## Tool inventory (18 tools)

Canonical registry: [`frontend/src/config/tools.ts`](../../frontend/src/config/tools.ts)

Each tool has:

| Field | Purpose |
|-------|---------|
| `category` | Top-level group: `pdf-from` · `to-pdf` · `pdf-ops` |
| `inputScope` | `single` (one source PDF/file) or `multi` (two or more files) — drives badges and PDF-ops column split |
| `subcategory` | Optional sub-heading within a group (e.g. `pages`, `markup`, `protect` under single-PDF ops) |

### PDF to Other Formats (4) — `inputScope: single`

| Tool ID | Route | Processing |
|---------|-------|------------|
| `convert-extract` | `/tools/convert` | Server — PDF → Word/Excel; extract embedded images |
| `pdf-to-jpg` | `/tools/pdf-to-jpg` | **Client** (PDF.js) |
| `pdf-to-text` | `/tools/pdf-to-text` | **Client** (PDF.js text layer) |
| `ocr-pdf` | `/tools/ocr` | **Client** (Tesseract.js) |

### Convert to PDF (4)

| Tool ID | Route | Scope | Processing |
|---------|-------|-------|------------|
| `word-to-pdf` | `/tools/word-to-pdf` | single | Server |
| `images-to-pdf` | `/tools/images-to-pdf` | multi | **Client** (pdf-lib) |
| `image-convert` | `/tools/images` | multi | Server |
| `image-resize` | `/tools/resize` | multi | Server |

### Work with PDFs — One PDF (8) — `inputScope: single`

| Tool ID | Route | Subcategory | Processing |
|---------|-------|-------------|------------|
| `split` | `/tools/split` | pages | **Client** (pdf-lib + JSZip) |
| `extract-pages` | `/tools/extract` | pages | **Client** (pdf-lib) |
| `remove-pages` | `/tools/remove-pages` | pages | **Client** (pdf-lib) |
| `rotate-pdf` | `/tools/rotate` | pages | **Client** (pdf-lib) |
| `watermark-pdf` | `/tools/watermark` | markup | Server |
| `sign-pdf` | `/tools/sign` | markup | **Client** (pdf-lib) |
| `compress-pdf` | `/tools/compress` | protect | Server |
| `lock-unlock` | `/tools/protect` | protect | Server |

### Work with PDFs — Multiple PDFs (2) — `inputScope: multi`

| Tool ID | Route | Processing |
|---------|-------|------------|
| `arrange-merge` | `/tools/merge` | **Client** (pdf-lib) — batch gate on free |
| `pdf-compare` | `/tools/compare` | **Client** (PDF.js viewer + optional diff worker) — see [pdf-compare-diff](./pdf-compare-diff.md) |

**Summary:** 11 client-side · 7 server-side · 14 single-input tools · 4 multi-input tools (merge, compare, images-to-pdf, image convert/resize)

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
| Extract pages | [`ExtractPagesPanel.tsx`](../../frontend/src/components/ExtractPagesPanel.tsx) | Selected pages → one PDF |
| Rotate | [`RotatePanel.tsx`](../../frontend/src/components/RotatePanel.tsx) | |
| Remove pages | [`RemovePagesPanel.tsx`](../../frontend/src/components/RemovePagesPanel.tsx) | Inverse of extract |
| Images → PDF | [`ImagesToPdfPanel.tsx`](../../frontend/src/components/ImagesToPdfPanel.tsx) | Drag to reorder pages |
| Sign PDF | [`SignPdfPanel.tsx`](../../frontend/src/components/SignPdfPanel.tsx) | Draw or upload PNG signature |

Legacy server endpoints (`/api/merge`, `/api/arrange-merge`, `/api/split`, `/api/rotate`, `/api/extract-pages`) still exist but the frontend no longer calls them.

### PDF.js

**Service:** [`frontend/src/services/pdfJsClient.ts`](../../frontend/src/services/pdfJsClient.ts)

| Tool | Panel | Notes |
|------|-------|-------|
| Compare | [`ComparePanel.tsx`](../../frontend/src/components/ComparePanel.tsx) + [`CompareFileTray.tsx`](../../frontend/src/components/compare/CompareFileTray.tsx) | Setup + **review mode**: dual panes, zoom, fit-width, single-page / continuous, fullscreen — see [compare-first homepage](./compare-first-homepage.md) |
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
- Extract embedded images *(convert tool)*  
- Image convert / resize  

---

## Billing & auth

| Feature | Status |
|---------|--------|
| PayPal subscription stub | Backend wired; `VITE_CHECKOUT_LIVE` for production |
| Pro price in code | **$9.00** |
| Supabase auth | **Live on pdftwin.com** — see [Supabase auth guide](./supabase-auth.md) |
| Mock auth / Pro preview | Fallback when `VITE_AUTH_PROVIDER=mock` or env missing at build |
| Cloud workspace | **Not started** — deferred |

### Supabase auth (shipped 2026-07-27)

- **Project:** PDF Twin (`tcwvrdykeojriwsxglbn`)
- **Table:** `public.profiles` (plan: `free` / `pro`)
- **Production fix:** Runtime env via `window.__PDFTWIN_ENV__` in `BaseLayout.astro` — Astro 5 was inlining env for SSR HTML but not client JS bundles; see [architecture notes](./supabase-auth.md#astro-5-production-build-fix)
- **Billing:** Still mock — Pro preview toggle on `/account` updates `profiles.plan` without PayPal

---

## SEO landing pages (72 total — complete)

Long-tail guides in [`frontend/src/i18n/seoLandings.ts`](../../frontend/src/i18n/seoLandings.ts). English at `/guides/{slug}`; ES/FR/NL at `/{locale}/{slug}`. All URLs in [`frontend/public/sitemap.xml`](../../frontend/public/sitemap.xml).

| Tool ID | EN slug | Tool route |
|---------|---------|------------|
| `arrange-merge` | `merge-pdf-free` | `/tools/merge` |
| `split` | `split-pdf-online` | `/tools/split` |
| `compress-pdf` | `compress-pdf-free` | `/tools/compress` |
| `convert-extract` | `pdf-to-word-free` | `/tools/convert` |
| `pdf-compare` | `compare-pdf-online` | `/tools/compare` |
| `word-to-pdf` | `word-to-pdf-free` | `/tools/word-to-pdf` |
| `rotate-pdf` | `rotate-pdf-online` | `/tools/rotate` |
| `extract-pages` | `extract-pdf-pages` | `/tools/extract` |
| `remove-pages` | `remove-pdf-pages` | `/tools/remove-pages` |
| `sign-pdf` | `sign-pdf-online` | `/tools/sign` |
| `images-to-pdf` | `images-to-pdf-free` | `/tools/images-to-pdf` |
| `ocr-pdf` | `ocr-pdf-online` | `/tools/ocr` |
| `pdf-to-jpg` | `pdf-to-jpg-free` | `/tools/pdf-to-jpg` |
| `pdf-to-text` | `pdf-to-text-free` | `/tools/pdf-to-text` |
| `image-convert` | `convert-images-online` | `/tools/images` |
| `image-resize` | `resize-images-online` | `/tools/resize` |
| `watermark-pdf` | `watermark-pdf-free` | `/tools/watermark` |
| `lock-unlock` | `protect-pdf-password` | `/tools/protect` |

**Coverage:** 18 tools × 5 locales = **90 pages**. Static build generates **210 total pages** (as of 2026-07-27 Portuguese locale).

Full slug inventory (all locales): [i18n doc — SEO landings](./i18n.md#seo-landing-pages-90-total--complete).

---

## Legal pages — shipped 2026-07-27

Terms and Privacy rewritten to match the live product. English only (not yet localized under `/es/`, etc.).

| Page | Route | Source |
|------|-------|--------|
| Terms of Use | `/terms` | [`frontend/src/pages/terms.astro`](../../frontend/src/pages/terms.astro) |
| Privacy Policy | `/privacy` | [`frontend/src/pages/privacy.astro`](../../frontend/src/pages/privacy.astro) |

**Operator:** Helios Impex (India) — named in both documents.

**Terms highlights:**

- All 18 tools, Free vs Pro limits (50 MB / 200 MB, merge batch, daily Word/Excel cap)
- PayPal Pro billing ($9/mo), cancellation via PayPal
- Output disclaimers (conversion, OCR, compare, sign PDF, lock/unlock)
- **No warranties or guarantees** — site copy and FAQs are intent only, not contractual SLAs
- **Limited liability** — cap at greater of 12-month Pro fees paid or USD $50
- Governing law: India; courts in India (subject to mandatory consumer laws elsewhere)
- Contact via pdftwin.com until dedicated support email is published

**Privacy highlights:**

- Client-side vs server-side tool breakdown (11 browser / 7 server)
- Supabase auth profiles, PayPal subscription metadata
- Cookies: `pdftwin_locale`, `pdftwin_doc_convert`, Supabase session, Vercel Analytics
- IndexedDB workspace tray, localStorage mirrors, OCR Tesseract CDN downloads
- No permanent server storage of uploaded documents; no AI training on user files

Footer links (all locales): Privacy, Terms — see [`SiteFooter.tsx`](../../frontend/src/components/layout/SiteFooter.tsx).

---

## Growth & help content (English — shipped 2026-07-23)

Competitive-inspired content for traffic and trust. English-only routes (not yet mirrored under `/es/` etc.).

| Page | Route | Content source |
|------|-------|----------------|
| Comparison | `/compare/ilovepdf` | [`frontend/src/content/comparison.ts`](../../frontend/src/content/comparison.ts) — PDFTwin vs iLovePDF, Smallpdf, Sejda, PDF24, ihatepdf |
| How it works | `/resources` | [`frontend/src/content/resources.ts`](../../frontend/src/content/resources.ts) — hybrid architecture, privacy, limits |
| FAQ hub | `/faq` | [`frontend/src/config/faq.ts`](../../frontend/src/config/faq.ts) — 28 questions in 5 categories + `FAQPage` schema |
| Blog index | `/blog` | [`frontend/src/content/blogPosts.ts`](../../frontend/src/content/blogPosts.ts) |
| Blog posts (6) | `/blog/{slug}` | 3 product guides + 3 long-form how-tos (compare, merge, Word, compress, sign, client vs server) |

Footer links (all locales): FAQ, How it works, Blog, Compare — see [`SiteFooter.tsx`](../../frontend/src/components/layout/SiteFooter.tsx).

---

## Tool workspace UI (Phases 1–3 — shipped 2026-07-27)

Redesigned shell for all `/tools/*` pages. **All three phases complete.** Full spec: [tool-workspace-ui.md](./tool-workspace-ui.md).

### Phase 1 — layout & navigation

| Change | Implementation |
|--------|----------------|
| Two-column layout | [`ToolWorkspace.tsx`](../../frontend/src/components/ToolWorkspace.tsx) — `.workspace-layout` grid |
| Files column | [`WorkspaceFileTray.tsx`](../../frontend/src/components/WorkspaceFileTray.tsx) — upload + tray + single clear |
| Styles | [`index.css`](../../frontend/src/index.css) — `.workspace-files-column` |

### Phase 2 — result cards & workflow

| Change | Implementation |
|--------|----------------|
| Explicit download result card | [`ToolResultCard.tsx`](../../frontend/src/components/ToolResultCard.tsx) |
| Result state | [`useToolResult.ts`](../../frontend/src/hooks/useToolResult.ts) |
| Multi-step workflow rail | [`ToolWorkflowShell.tsx`](../../frontend/src/components/ToolWorkflowShell.tsx) |
| Post-action suggestions | [`toolNextSteps.ts`](../../frontend/src/config/toolNextSteps.ts) |
| All tool panels | 17 panels migrated — auto-download removed |

### Phase 3 — client nav, thumbnails, mobile

| Change | Implementation |
|--------|----------------|
| Client-side tool switching | [`useWorkspaceNavigation.ts`](../../frontend/src/hooks/useWorkspaceNavigation.ts) — History API, no full reload |
| Nav context + result chips | [`WorkspaceNavContext.tsx`](../../frontend/src/context/WorkspaceNavContext.tsx) |
| Header tool pill sync | [`workspaceNavStore.ts`](../../frontend/src/stores/workspaceNavStore.ts) + [`SiteHeader.tsx`](../../frontend/src/components/layout/SiteHeader.tsx) |
| Vertical rail (single-PDF tools) | [`WorkspaceToolRail.tsx`](../../frontend/src/components/layout/WorkspaceToolRail.tsx) |
| File thumbnails in tray | [`WorkspaceFileThumbnail.tsx`](../../frontend/src/components/WorkspaceFileThumbnail.tsx), [`useFileThumbnail.ts`](../../frontend/src/hooks/useFileThumbnail.ts) |
| PDF thumb rendering | [`pdfJsClient.ts`](../../frontend/src/services/pdfJsClient.ts) — `pdfThumbnailDataUrl()` |
| Mobile: action-first + collapsible files | [`WorkspaceFileTray.tsx`](../../frontend/src/components/WorkspaceFileTray.tsx), [`index.css`](../../frontend/src/index.css) |
| Path resolver for back/forward | [`tools.ts`](../../frontend/src/config/tools.ts) — `toolIdFromPath()` |

**Remaining gap:** tool panel UI still English-only — see [i18n next phases](./i18n.md#next-phases). **Compare panel** uses i18n `compare.*` keys in all 5 locales.

---

## PDF compare — review mode (shipped 2026-07-27)

| Layer | Implementation |
|-------|----------------|
| Panel | [`ComparePanel.tsx`](../../frontend/src/components/ComparePanel.tsx) — `reviewMode` state; `onReviewModeChange` callback; **ResizeObserver** fit-to-width |
| Workspace chrome | [`ToolWorkspace.tsx`](../../frontend/src/components/ToolWorkspace.tsx) — hides heading, switcher, file tray when `compareReviewMode` |
| CSS | [`index.css`](../../frontend/src/index.css) — `.compare-panel--review`, `.workspace--compare-review`, `.compare-toolbar*`, canvas zoom fix |
| i18n | `messages.compare.*` in EN/ES/FR/NL/PT |
| Home positioning | [Compare-first homepage](./compare-first-homepage.md) |

**Deferred:** visual diff overlay, sample PDFs for instant demo.

---

## Deferred (see [roadmap](../strategy/roadmap.md))

- Cloud workspace sync (Supabase Storage)  
- Business tier  
- Annual Pro plan  
- Move watermark / lock-unlock client-side  
- Localize comparison, resources, blog, FAQ (EN only today)  
- Tool panel UI translation (Phase 1.5 i18n)  
- Product Hunt / Peerlist launch  
- Priority queue differentiation  
- Client-side compress (Ghostscript WASM or light preset)

---

## Architecture summary

```
Browser (client-side)                    Server (FastAPI / Vercel)
─────────────────────                    ─────────────────────────
Merge, split, rotate, compare            PDF → Word/Excel (capped)
Extract pages, remove pages, sign PDF    Word → PDF, compress
Images → PDF, PDF → JPG/PNG              Watermark, lock/unlock
PDF → text, OCR (Tesseract.js)           Extract embedded images
                                         Image convert/resize
                                         In-memory only, no storage
```

---

## Internationalization

English is the default at `/`. Spanish, French, Dutch, and Portuguese use prefixed routes (`/es/`, `/fr/`, `/nl/`, `/pt/`).

- **Translated:** home (compare hero, workflow, featured tools, SEO tool index), nav, footer (incl. growth links), pricing, tool names/descriptions, **compare panel UI**, **workspace shell** (headings + category/tool tabs), **90 SEO landings** (18 tools × 5 locales)  
- **English only:** `/compare/ilovepdf`, `/resources`, `/faq`, `/blog/*`, `/privacy`, `/terms` (legal content updated 2026-07-27)  
- **Not yet translated:** in-tool panel UI, workspace file-tray chrome, login/account pages

See [docs/product/i18n.md](../product/i18n.md).

---

## Related

- [ihatepdf profile](../competitive/ihatepdf.md) — what 100% client-side looks like  
- [Learnings](../strategy/learnings-and-positioning.md) — why hybrid  
- [Monetization plan](../strategy/monetization-plan.md) — Pro triggers
