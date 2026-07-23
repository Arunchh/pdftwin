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
- [x] **i18n:** English + Spanish, French, Dutch with auto-detection — see [i18n doc](../product/i18n.md)

---

## Phase 1.5 — shipped & near term (no cloud workspace)

### Shipped (2026-07-23)

- [x] **Six new client-side tools** — images→PDF, PDF→JPG, sign PDF, remove pages, PDF→text, OCR  
- [x] Tool count **12 → 18**  
- [x] **Merge batch gate** — free: up to 5 PDFs; 6+ requires Pro (`MergeBatchGate`)  
- [x] i18n tool names for new tools (EN/ES/FR/NL)  
- [x] Pricing/FAQ copy updated for merge limit and tool count  
- [x] **SEO landings for new 6 tools** — rotate, extract, sign, OCR, images→PDF, remove pages (24 pages; **48 total** with first batch) — see [i18n doc](../product/i18n.md#seo-landing-pages-48-total)

### Still open

| Item | Priority | Notes |
|------|----------|-------|
| ~~SEO landing content (first 6 tools)~~ | ~~High~~ | **Done** — see [i18n doc](../product/i18n.md) |
| ~~SEO landings for new 6 tools~~ | ~~High~~ | **Done** — rotate, extract, sign, OCR, images→PDF, remove pages |
| SEO landings for **remaining 6 tools** | Medium | PDF→JPG, PDF→text, image convert/resize, watermark, protect |
| Translate **tool panel UI** | High | Panels still English-only — see [i18n doc](../product/i18n.md#next-phases) |
| “PDFTwin vs iLovePDF” comparison page | High | Capture frustrated searchers |
| Product Hunt / Peerlist launch | Medium | One spike + backlinks |
| Differentiate priority queue | Low | Only if free users see wait times |
| Annual billing ($79/yr) | Medium | Needs PayPal plan |
| Move **extract pages** client-side | Low | Same pattern as split/remove |
| Move watermark / lock client-side | Low | pdf-lib supports both |
| Update PayPal plan to $9 in dashboard | **Required** if old $7 plan exists |

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

## Phase 3 — toward $3–5K/mo

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
