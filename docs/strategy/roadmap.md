# Roadmap

> **Gate for Phase 2:** At least **50–100 organic clicks/day** before cloud workspace or Business tier.  
> See [monetization plan](./monetization-plan.md) · [implementation status](../product/implementation-status.md)

---

## Phase 1 — shipped (2026-07)

Priority changes from competitive review:

- [x] Free file limit **50 MB** (was 24 MB)  
- [x] Pro price **$9/mo** (was $7)  
- [x] Daily cap: **3 PDF → Word/Excel** exports on free  
- [x] Client-side **merge, split, rotate** (pdf-lib)  
- [x] Internal documentation hub  
- [x] **i18n:** English + Spanish, French, Dutch, Portuguese with auto-detection — see [i18n doc](../product/i18n.md)

---

## Phase 1.5 — shipped & near term (no cloud workspace)

### Shipped (2026-07-23)

- [x] **Six new client-side tools** — images→PDF, PDF→JPG, sign PDF, remove pages, PDF→text, OCR  
- [x] Tool count **12 → 18**  
- [x] **Merge batch gate** — free: up to 5 PDFs; 6+ requires Pro (`MergeBatchGate`)  
- [x] i18n tool names for new tools (EN/ES/FR/NL)  
- [x] Pricing/FAQ copy updated for merge limit and tool count  
- [x] **SEO landings batch 1** — first 6 tools (24 pages)  
- [x] **SEO landings batch 2** — rotate, extract, remove, sign, images→PDF, OCR (24 pages)  
- [x] **SEO landings batch 3** — PDF→JPG, PDF→text, image convert/resize, watermark, protect (24 pages) → **72 total** (EN/ES/FR/NL)  
- [x] **Comparison page** — `/compare/ilovepdf` vs iLovePDF, Smallpdf, Sejda, PDF24, ihatepdf  
- [x] **Resources page** — `/resources` hybrid architecture & privacy  
- [x] **FAQ hub** — `/faq` with 28 categorized questions + schema  
- [x] **Blog** — `/blog` with 6 starter posts (product + long-form how-tos)  

### Shipped (2026-07-27)

- [x] **Tool workspace UI — Phase 1** — two-column layout, category-filtered tool tabs, merged files column — see [tool workspace UI](../product/tool-workspace-ui.md)
- [x] **Tool workspace UI — Phase 2** — result cards, workflow shell, next-step chips — see [Phase 2](../product/tool-workspace-ui.md#phase-2-scope-shipped-2026-07-27)
- [x] **Tool workspace UI — Phase 3** — client-side tool switching, file thumbnails, mobile refinements — see [Phase 3](../product/tool-workspace-ui.md#phase-3-scope-shipped-2026-07-27)
- [x] **Portuguese locale (`pt`)** — UI strings, 18 SEO landings, geo detection (BR, PT, etc.), sitemap — see [i18n doc](../product/i18n.md)

### Still open

| Item | Priority | Notes |
|------|----------|-------|
| ~~Tool workspace UI — Phase 2~~ | ~~High~~ | **Done** |
| ~~Tool workspace UI — Phase 3~~ | ~~High~~ | **Done** — client nav, thumbnails, mobile |
| ~~SEO landing content (all 18 tools)~~ | ~~High~~ | **Done** — 90 pages (5 locales) — see [i18n doc](../product/i18n.md) |
| ~~Comparison page~~ | ~~High~~ | **Done** — `/compare/ilovepdf` |
| ~~FAQ hub + blog starter content~~ | ~~High~~ | **Done** — `/faq`, `/blog` |
| Translate **tool panel UI** | High | Panels still English-only — see [i18n doc](../product/i18n.md#next-phases) |
| Localize growth pages (compare, resources, FAQ, blog) | Medium | English only today |
| Product Hunt / Peerlist launch | Medium | One spike + backlinks |
| Differentiate priority queue | Low | Only if free users see wait times |
| Annual billing ($79/yr) | Medium | Needs PayPal plan |
| Move **extract pages** client-side | Low | Same pattern as split/remove |
| Move watermark / lock client-side | Low | pdf-lib supports both |
| Update PayPal plan to $9 in dashboard | **Required** if old $7 plan exists |

---

## Workspace UI redesign

### Phase 1 — shipped (2026-07-27)

- [x] Two-column desktop layout (files left, tool panel right)
- [x] Category tabs (Convert / Organize / Protect) + filtered horizontal tool tabs
- [x] Merged upload + file tray; single “Clear all” action
- [x] Keep existing PDFTwin Neon Pastel visual design

See [tool workspace UI](../product/tool-workspace-ui.md).

### Phase 2 — shipped (2026-07-27)

- [x] Result card with explicit Download button (all 17 download tools)
- [x] Shared workflow shell for multi-step tools
- [x] Post-action tool suggestion chips on result card
- [x] Pilot + full panel migration (Compress, Extract, Merge, and all others)

See [tool workspace UI](../product/tool-workspace-ui.md#phase-2-scope-shipped-2026-07-27).

### Phase 3 — shipped (2026-07-27)

- [x] Client-side tool switching without full page reload (History API)
- [x] File thumbnails in tray (images, PDF first-page, type icons)
- [x] Mobile refinements — action column first, collapsible file list, dropzone always visible
- [x] Header tool pill updates on client nav
- [x] Result-card next-step chips use client nav in workspace

See [tool workspace UI — Phase 3](../product/tool-workspace-ui.md#phase-3-scope-shipped-2026-07-27).

**Workspace UI redesign is complete** (Phases 1–3).

---

## Phase 2 — after 50–100 clicks/day

**Explicitly deferred per product decision:**

### Cloud workspace sync

- Supabase Storage for Pro users  
- Files follow account across devices  
- Significant ongoing maintenance — only after traffic justifies it  

### Business tier

- 3–5 seats, shared workspace  
- Usage dashboard / audit log  
- $19–24/mo — targets agencies, small legal/accounting teams  

### Other

- API tier for developers ($49–99/mo)  
- Referral program (1 month Pro for referrer + referee)  

---

## Growth phase — toward $3–5K/mo

> Not to be confused with [workspace UI Phase 3](../product/tool-workspace-ui.md#phase-3-scope-shipped-2026-07-27) (client navigation — shipped 2026-07-27).

- Expand tool count based on search demand (avoid 46-tool scatter)  
- Build in public (weekly stats)  
- AI tool directory listings  
- Client-side compress (lighter preset or Ghostscript WASM)  
- Hybrid PDF→Word (simple text PDFs client-side, complex server-side)  

---

## Out of scope (for now)

- Watermarks on free tier — **never**  
- Daily limits on client-side organize/convert tools (except merge batch on free)  
- Business tier before traction gate  
- Full ihatepdf-style 46-tool breadth — focus beats scatter  

---

## Related

- [Learnings & positioning](./learnings-and-positioning.md)  
- [ihatepdf competitive profile](../competitive/ihatepdf.md)  
- [Implementation status](../product/implementation-status.md)
