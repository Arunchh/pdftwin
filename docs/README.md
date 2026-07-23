# PDFTwin internal documentation

Living docs for product strategy, competitive research, and implementation status. Update these as we ship.

## Competitive research

- [ihatepdf.cv — profile & model](./competitive/ihatepdf.md)

## Strategy

- [Learnings & positioning](./strategy/learnings-and-positioning.md)
- [Monetization plan](./strategy/monetization-plan.md)
- [Roadmap (deferred items)](./strategy/roadmap.md)

## Product

- [Implementation status](./product/implementation-status.md) — **18 tools**, client vs server split, limits
- [Internationalization (i18n)](./product/i18n.md)

## Quick links

| Topic | Doc |
|-------|-----|
| Full tool list (18) | [Implementation status — tool inventory](./product/implementation-status.md#tool-inventory-18-tools) |
| Why we raised free limit to 50 MB | [Monetization plan](./strategy/monetization-plan.md#free-tier-volume-engine) |
| Daily Word/Excel cap (3/day) | [Implementation status](./product/implementation-status.md#daily-document-export-cap) |
| Merge batch gate (5 free, 6+ Pro) | [Implementation status](./product/implementation-status.md#merge-batch-gate-5--pro) |
| Client-side tools (10) | [Implementation status](./product/implementation-status.md#client-side-tools) |
| New tools: OCR, sign, images→PDF | [Roadmap — Phase 1.5 shipped](./strategy/roadmap.md#shipped-2026-07-23) |
| Cloud workspace (deferred) | [Roadmap](./strategy/roadmap.md#phase-2--after-50-100-clicksday) |
| Business tier (deferred) | [Roadmap](./strategy/roadmap.md#phase-2--after-50-100-clicksday) |
| Revenue target ($3–5K/mo) | [Monetization plan](./strategy/monetization-plan.md#revenue-target) |

## Related repo docs

- [README](../README.md) — setup, API, deploy
- [Pricing config](../frontend/src/config/pricing.ts) — live plan copy
- [Limits config](../frontend/src/config/limits.ts) — file, daily, and merge caps
- [Tools config](../frontend/src/config/tools.ts) — canonical 18-tool registry
