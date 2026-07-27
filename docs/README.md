# PDFTwin internal documentation

Living docs for product strategy, competitive research, and implementation status. Update these as we ship.

**Latest (2026-07-27):** **Compare-first homepage** and **dedicated PDF compare review viewer** — immersive dual-pane mode with working zoom, fit-width, single-page navigation, and fullscreen. Home restructured: compare hero → workflow → featured tools + SEO tool index (`#tools`). See [compare-first homepage](./product/compare-first-homepage.md).

**Previous (2026-07-27):** Tool taxonomy reorganized by conversion direction and input scope (**One PDF** vs **Multiple PDFs**). Nav and workspace switcher updated; see [tool workspace UI — tool taxonomy](./product/tool-workspace-ui.md#tool-taxonomy-home-grid--navigation).

## Competitive research

- [ihatepdf.cv — profile & model](./competitive/ihatepdf.md)

## Strategy

- [Learnings & positioning](./strategy/learnings-and-positioning.md)
- [Monetization plan](./strategy/monetization-plan.md)
- [Roadmap (deferred items)](./strategy/roadmap.md)

## Product

- [Compare-first homepage & PDF compare viewer](./product/compare-first-homepage.md) — hero, workflow, review mode, SEO
- [Implementation status](./product/implementation-status.md) — **18 tools**, client vs server split, limits
- [Tool workspace UI](./product/tool-workspace-ui.md) — two-column layout, client navigation, thumbnails, mobile
- [Internationalization (i18n)](./product/i18n.md)
- [Supabase auth — setup & production deploy](./product/supabase-auth.md)

## Quick links

| Topic | Doc |
|-------|-----|
| Compare-first home + review viewer | [Compare-first homepage](./product/compare-first-homepage.md) |
| Full tool list (18) + input scope | [Implementation status — tool inventory](./product/implementation-status.md#tool-inventory-18-tools) |
| Tool taxonomy (categories + 1 PDF vs 2+ PDFs) | [Tool workspace UI — tool taxonomy](./product/tool-workspace-ui.md#tool-taxonomy-home-grid--navigation) |
| Why we raised free limit to 50 MB | [Monetization plan](./strategy/monetization-plan.md#free-tier-volume-engine) |
| Daily Word/Excel cap (3/day) | [Implementation status](./product/implementation-status.md#daily-document-export-cap) |
| Merge batch gate (5 free, 6+ Pro) | [Implementation status](./product/implementation-status.md#merge-batch-gate-5--pro) |
| Client-side tools (10) | [Implementation status](./product/implementation-status.md#client-side-tools) |
| New tools: OCR, sign, images→PDF | [Roadmap — Phase 1.5 shipped](./strategy/roadmap.md#shipped-2026-07-23) |
| SEO landing pages (90 total, all 18 tools × 5 locales) | [i18n — SEO landings](./product/i18n.md#seo-landing-pages-90-total--complete) |
| Comparison vs iLovePDF & others | [Implementation status — growth content](./product/implementation-status.md#growth--help-content-english--shipped-2026-07-23) |
| FAQ hub (28 questions) | `/faq` · [faq.ts](../frontend/src/config/faq.ts) |
| Blog & how-to guides | `/blog` · [blogPosts.ts](../frontend/src/content/blogPosts.ts) |
| How PDFTwin works (architecture) | `/resources` |
| Cloud workspace (deferred) | [Roadmap](./strategy/roadmap.md#phase-2--after-50-100-clicksday) |
| Supabase auth (live) | [Supabase auth guide](./product/supabase-auth.md) |
| Tool workspace layout (Phase 1) | [Tool workspace UI](./product/tool-workspace-ui.md) |
| Result cards & next steps (Phase 2) | [Tool workspace UI — Phase 2](./product/tool-workspace-ui.md#phase-2-scope-shipped-2026-07-27) |
| Client nav, thumbnails, mobile (Phase 3) | [Tool workspace UI — Phase 3](./product/tool-workspace-ui.md#phase-3-scope-shipped-2026-07-27) |
| Workspace UI — full spec & checklist | [Tool workspace UI](./product/tool-workspace-ui.md) |
| Terms & Privacy (Helios Impex) | `/terms` · `/privacy` · [Implementation status — legal](./product/implementation-status.md#legal-pages--shipped-2026-07-27) |
| Business tier (deferred) | [Roadmap](./strategy/roadmap.md#phase-2--after-50-100-clicksday) |
| Revenue target ($3–5K/mo) | [Monetization plan](./strategy/monetization-plan.md#revenue-target) |

## Related repo docs

- [README](../README.md) — setup, API, deploy
- [Pricing config](../frontend/src/config/pricing.ts) — live plan copy
- [Limits config](../frontend/src/config/limits.ts) — file, daily, and merge caps
- [Tools config](../frontend/src/config/tools.ts) — canonical 18-tool registry
