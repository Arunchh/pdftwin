# Learnings & positioning

> Inspired by [ihatepdf.cv](./competitive/ihatepdf.md) · Informs [monetization plan](./monetization-plan.md) · Tracked in [implementation status](../product/implementation-status.md)

---

## Core insight from ihatepdf

**Architecture is positioning.** ihatepdf’s “no upload, no watermark, no limits” is not marketing fluff — it follows from WebAssembly client-side processing. Users can verify in DevTools (zero upload bytes).

PDFTwin takes a **hybrid** path: generous free tier + sustainable monetization on expensive server work.

---

## What we adopted

| Learning | PDFTwin response |
|----------|------------------|
| Never watermark free output | Policy: no watermarks ever |
| No daily task limits on organize tools | Merge, split, rotate unlimited (client-side) |
| Privacy as trust signal | Badge: “Processed on your device” on client tools |
| Generous free file size | Raised 24 MB → **50 MB** (see [limits](../../frontend/src/config/limits.ts)) |
| Frictionless entry | No account for free tier |
| SEO per tool | Existing `/tools/*` routes — expand content later |

---

## Where we deliberately differ

| ihatepdf | PDFTwin |
|----------|---------|
| 100% client-side | Hybrid: client organize + server convert |
| No monetization | Pro at **$9/mo** for heavy use |
| 46 tools, broad | 12 tools, business-focused |
| No accounts | Supabase auth + PayPal Pro (optional) |
| Compare not emphasized | **Compare PDFs** as differentiator |

**Why hybrid:** PDF → Word/Excel needs quality server libraries. Pure browser conversion is weaker for complex business PDFs. That server cost is what Pro pays for.

---

## Positioning statement

> **Generous free PDF tools for individuals. Pro for large files and unlimited document conversion.**

Not competing on “100% client-side.” Competing on:

1. Better **PDF → Word/Excel** for business documents  
2. **Compare** workflow for contract review  
3. Honest free tier (no watermarks, no trick downloads)  
4. Clear upgrade path when users hit real limits (file size, daily exports)

---

## Anti-patterns to avoid (from iLovePDF / Smallpdf)

- Watermark on “free” output after processing  
- Hidden task limits mid-workflow  
- Requiring account before first use  
- Vague privacy (“we delete in 2 hours”) without explaining upload  

---

## Growth inspiration (not yet fully executed)

From ihatepdf’s public playbook:

- One SEO landing page per tool + comparison posts  
- Product Hunt / Peerlist launches  
- Build in public (stats, feature shipping)  
- AI tool directory listings  
- Long-tail keywords: “merge PDF no watermark”, “compare two PDFs free”

See [roadmap](./roadmap.md) for phased rollout.

---

## Decision log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-07 | Free limit 50 MB, Pro $9/mo | More generous than old 24 MB; price reflects conversion value |
| 2026-07 | 3/day Word/Excel cap on free | Protect server COGS; clear Pro reason |
| 2026-07 | Client-side merge/split/rotate | Lower cost, privacy story, unlimited use |
| 2026-07 | Defer cloud workspace & Business tier | Needs traffic (50–100 clicks/day) before investment |
