# Compare-first homepage & PDF compare viewer

> **Shipped:** 2026-07-27 · [Docs hub](../README.md) · [Implementation status](./implementation-status.md) · [Tool workspace UI](./tool-workspace-ui.md)

PDFTwin is positioned around **side-by-side PDF compare** as the hero differentiator, with complementary tools (extract, merge, sign, convert) supporting a document review workflow. This doc covers the homepage restructure and the dedicated compare viewer shipped in the same release.

---

## Product rationale

| Before | After |
|--------|-------|
| Generic “one workspace for every format” home | Compare-led hero with workflow story |
| Full 18-tool grid + trust bar + formats section on `/` | Slim home: hero → workflow → featured tools + SEO tool index |
| Compare embedded in generic workspace only | **Setup phase** + **immersive review mode** with working zoom |
| Zoom visually broken (`max-width: 100%` on canvas) | Canvas renders at PDF.js scale; fit-width, single-page mode |

Compare remains **client-side** (PDF.js) — files never upload for viewing. SEO landings (`/guides/compare-pdf-online`, localized slugs), blog posts, and `/compare/ilovepdf` are unchanged; the homepage now aligns with that positioning.

---

## Homepage structure (`/` and `/{locale}/`)

**Astro pages:** [`frontend/src/pages/index.astro`](../../frontend/src/pages/index.astro), [`frontend/src/pages/[locale]/index.astro`](../../frontend/src/pages/[locale]/index.astro)

| Section | Component | Purpose |
|---------|-----------|---------|
| Hero | [`HeroSection.tsx`](../../frontend/src/components/layout/HeroSection.tsx) | Compare value prop, primary CTA → `/tools/compare`, trust chips, visual demo |
| Workflow | [`HomeWorkflowSection.tsx`](../../frontend/src/components/layout/HomeWorkflowSection.tsx) | 4-step review path with links into tools |
| Tools + SEO | [`HomeToolsSection.tsx`](../../frontend/src/components/layout/HomeToolsSection.tsx) | 6 featured complementary tools + crawlable list of all 18 tools (`#tools`) |

### Removed from home (still available elsewhere)

| Former home section | Still available at |
|---------------------|-------------------|
| `TrustBar` | Trust chips inline in hero; full trust copy on `/pricing`, `/resources` |
| `ToolGrid` (full catalog) | Header nav dropdowns; `#tools` SEO index on home; each `/tools/*` route |
| `FormatSupportSection` | `/formats` and nav **Formats** link |

### Hero CTAs

| Button | Target | Role |
|--------|--------|------|
| **Compare PDFs now** | `/tools/compare` (locale-aware) | Primary conversion |
| **Browse all tools** | `/#tools` | Secondary — scroll to SEO tool index |
| **Compare PDF guide** | `/guides/compare-pdf-online` | SEO content bridge |

### Workflow steps (`messages.home.workflow.steps`)

| Step | Tool ID | Route |
|------|---------|-------|
| Compare revisions | `pdf-compare` | `/tools/compare` |
| Extract what changed | `extract-pages` | `/tools/extract` |
| Merge the final pack | `arrange-merge` | `/tools/merge` |
| Sign and protect | `sign-pdf` | `/tools/sign` |

### Featured complementary tools (`messages.home.complementary.toolIds`)

`convert-extract`, `split`, `compress-pdf`, `lock-unlock`, `word-to-pdf`, `pdf-to-jpg` — shown as tool cards below the workflow.

### SEO tool index (`messages.home.seoTools`)

All 18 tools listed by category (PDF from · To PDF · Work with PDFs) with links to each `/tools/{path}`. Preserves crawlable internal links after removing the full home grid. Anchor: `#tools` (nav **All tools** and footer **Tools** still work).

---

## SEO & meta (home)

| Field | EN example | Source |
|-------|------------|--------|
| `<title>` | PDFTwin — Compare PDFs Side by Side Free \| PDF Tools for Business | `messages.meta.homeTitle` |
| `<meta description>` | Compare two PDFs online with linked scroll, zoom, single-page review… | `messages.meta.homeDescription` |
| Structured data | Compare first in `WebApplication.featureList` | [`SeoStructuredData.tsx`](../../frontend/src/components/SeoStructuredData.tsx) |
| Business tagline | Compare PDFs side by side… | [`config/formats.ts`](../../frontend/src/config/formats.ts) `BUSINESS_TAGLINE` |

All five locales (EN, ES, FR, NL, PT) have updated `meta`, `hero`, `home`, `compare`, and footer `tagline` keys in [`frontend/src/i18n/locales/`](../../frontend/src/i18n/locales/).

**Unchanged SEO assets:** 90 locale SEO landings, `/guides/*`, `/blog/*`, `/faq`, `/compare/ilovepdf`, sitemap, hreflang on `BaseLayout`.

---

## PDF compare viewer (`ComparePanel`)

**Route:** `/tools/compare` · **Panel:** [`ComparePanel.tsx`](../../frontend/src/components/ComparePanel.tsx)

### Two phases

```
Setup                          Review (immersive)
─────                          ──────────────────
Upload PDFs via file tray      Full-width dual panes
Pick left / right documents    Toolbar: zoom, fit, page nav, fullscreen
Click "Open compare viewer"    Workspace chrome hidden (see below)
```

### Review-mode features

| Feature | Details |
|---------|---------|
| **Zoom** | Linked or independent; ± buttons; keyboard `+` / `-` |
| **Fit width** | Calculates scale from pane width and page dimensions |
| **View modes** | **Single page** (default) or **continuous scroll** |
| **Page navigation** | Prev/next, page number input (single-page mode) |
| **Scroll sync** | Linked scroll in continuous mode only |
| **Fullscreen** | Native Fullscreen API on viewer container |
| **Privacy** | Renders locally; copy states no upload for viewing |

### Workspace integration

[`ToolWorkspace.tsx`](../../frontend/src/components/ToolWorkspace.tsx) listens to `onReviewModeChange` from `ComparePanel`:

- When `reviewMode === true`: hides tool heading, `WorkspaceToolSwitcher`, and `WorkspaceFileTray`
- Adds classes `workspace--compare-review`, `workspace-layout--compare-review`
- User exits via **Change documents** in compare toolbar

### CSS fixes

| Issue | Fix |
|-------|-----|
| Zoom appeared broken | Removed `max-width: 100%` from `.compare-page-canvas` |
| Cramped viewer | Taller panes: `min(70vh, 42rem)`; review viewer `min-height: calc(100vh - 12rem)` |
| Immersive layout | Full-width grid when `workspace-layout--compare-review` |

Styles: [`frontend/src/index.css`](../../frontend/src/index.css) — `.compare-panel--review`, `.compare-viewer--review`, `.hero--compare`, `.home-workflow-*`, `.home-seo-tools-*`.

---

## i18n keys (new / changed)

| Namespace | Keys | Used by |
|-----------|------|---------|
| `hero` | `compareNow`, `seeAllTools`, `seeCompareGuide`, `trustChips[]`, `visualCaption` | `HeroSection` |
| `home.workflow` | `heading`, `subheading`, `steps[]` | `HomeWorkflowSection` |
| `home.complementary` | `heading`, `subheading`, `toolIds[]` | `HomeToolsSection` |
| `home.seoTools` | `heading`, `subheading` | `HomeToolsSection` SEO nav |
| `compare` | Full panel copy (setup, toolbar, zoom, pages, fullscreen) | `ComparePanel` |

Types: [`frontend/src/i18n/types.ts`](../../frontend/src/i18n/types.ts).

**Removed hero keys:** `openWorkspace`, `seeFormats`, `statTools`, `statFreeLimit`, `statInstall` (replaced by compare-first copy).

---

## Component map (homepage)

| Component | Path |
|-----------|------|
| `HeroSection` | `frontend/src/components/layout/HeroSection.tsx` |
| `HomeWorkflowSection` | `frontend/src/components/layout/HomeWorkflowSection.tsx` |
| `HomeToolsSection` | `frontend/src/components/layout/HomeToolsSection.tsx` |
| `ToolCardLink` | `frontend/src/components/layout/ToolCardLink.tsx` (reused for featured tools) |

**Legacy (still used on other routes, not home):**

| Component | Still used on |
|-----------|---------------|
| `ToolGrid` | Not mounted on home; taxonomy reference for nav/workspace |
| `TrustBar` | Not mounted on home |
| `FormatSupportSection` | `/formats`, `/{locale}/formats` |

---

## Verification checklist

### Homepage

1. `/` — hero shows compare headline; primary CTA → `/tools/compare`
2. Workflow section — 4 steps with working tool links
3. `#tools` — all 18 tools linked by category; nav **All tools** scrolls here
4. `/es/`, `/fr/`, `/nl/`, `/pt/` — same structure, translated copy
5. View source — `<title>` and meta description include compare keywords

### Compare tool

1. `/tools/compare` — upload 2 PDFs, assign left/right, **Open compare viewer**
2. Review mode — file tray and tool switcher hidden; dual panes full width
3. Zoom in/out — visible size changes (not just resolution)
4. **Fit width** — both panes scale to pane width
5. Single-page mode — prev/next and page input work; arrow keys work
6. Continuous mode — linked scroll syncs both panes
7. Fullscreen — viewer fills screen; exit restores layout
8. **Change documents** — returns to setup with tray visible

---

## Deferred (compare product)

| Item | Notes |
|------|-------|
| Visual diff / overlay highlighting | Long-term moat vs iLovePDF |
| Sample PDFs on compare page | Instant demo without upload |
| Localized `/guides/compare-pdf-online` under `/{locale}/` | EN guide linked from hero today |
| Home = workspace redirect (Option C) | Only after compare UX is proven |

See [roadmap](../strategy/roadmap.md#compare-first--shipped-2026-07-27).

---

## Related

- [Tool workspace UI — compare in workspace](./tool-workspace-ui.md#pdf-compare--review-mode)
- [Implementation status — compare](./implementation-status.md#pdf-compare--review-mode-shipped-2026-07-27)
- [Learnings — compare as differentiator](../strategy/learnings-and-positioning.md)
- [i18n — home & compare keys](./i18n.md#what-is-translated-phase-1--shipped)
