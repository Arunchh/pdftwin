# Compare-first homepage & PDF compare viewer

> **Shipped:** 2026-07-27 · **Updated:** 2026-07-28 (upload-first hero layout) · [Docs hub](../README.md) · [Implementation status](./implementation-status.md) · [Tool workspace UI](./tool-workspace-ui.md)

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
| Compare hero | [`HomeCompareHeroSection.tsx`](../../frontend/src/components/layout/HomeCompareHeroSection.tsx) | H1 headline → **upload dropzone** → tool switcher → embedded compare workspace |
| Marketing hero | [`HeroSection.tsx`](../../frontend/src/components/layout/HeroSection.tsx) | Secondary trust copy, browse-all-tools CTA, compare guide link |
| Workflow | [`HomeWorkflowSection.tsx`](../../frontend/src/components/layout/HomeWorkflowSection.tsx) | 3-step post-compare workflow with links into tools |
| Tools + SEO | [`HomeToolsSection.tsx`](../../frontend/src/components/layout/HomeToolsSection.tsx) | 6 featured complementary tools + crawlable list of all 18 tools (`#tools`) |

### Upload-first hero layout (2026-07-28)

The home compare hero follows an **iLovePDF-style** flow: upload first, then pick a tool. Vertical order inside [`HomeCompareHeroSection`](../../frontend/src/components/layout/HomeCompareHeroSection.tsx):

```
┌─────────────────────────────────────────────────────┐
│  Eyebrow + H1 — "Compare two PDFs side by side…"    │
├─────────────────────────────────────────────────────┤
│  Hero upload dropzone (full width, prominent)       │
│  · drag-and-drop or click to browse                 │
│  · compact file list when files are present           │
├─────────────────────────────────────────────────────┤
│  WorkspaceToolSwitcher — category + tool tabs         │
├─────────────────────────────────────────────────────┤
│  ┌────┬──────────────────────────────────────────┐  │
│  │Rail│  Active tool panel (Compare by default)  │  │
│  └────┴──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

Implementation:

| Piece | Path | Notes |
|-------|------|-------|
| Hero shell | [`HomeCompareHeroSection.tsx`](../../frontend/src/components/layout/HomeCompareHeroSection.tsx) | Renders H1 + `<ToolWorkspace variant="homeHero" />` |
| Upload zone | [`WorkspaceFileTray.tsx`](../../frontend/src/components/WorkspaceFileTray.tsx) `variant="hero"` | Large dropzone; no sidebar panel wrapper |
| Tool rail | [`WorkspaceToolRail.tsx`](../../frontend/src/components/layout/WorkspaceToolRail.tsx) | Vertical icon bar for single-PDF edit tools (split, watermark, sign, etc.) |
| Tool switcher | [`WorkspaceToolSwitcher.tsx`](../../frontend/src/components/layout/WorkspaceToolSwitcher.tsx) | Rendered **below** upload; **Work with PDFs** tab first; Merge + Compare in horizontal row |
| Workspace shell | [`ToolWorkspace.tsx`](../../frontend/src/components/ToolWorkspace.tsx) | `variant="homeHero"` reorders chrome; rail + single-column panel (no right file tray) |

On **`/tools/*` routes**, layout is **rail | tool panel | file tray** on desktop.

CSS: `.workspace-hero-upload`, `.workspace-files-upload--hero`, `.workspace-layout--home-hero`, `.workspace-tool-rail` in [`index.css`](../../frontend/src/index.css).

### Removed from home (still available elsewhere)

| Former home section | Still available at |
|---------------------|-------------------|
| `TrustBar` | Trust chips inline in hero; full trust copy on `/pricing`, `/resources` |
| `ToolGrid` (full catalog) | Header **All tools** mega menu; `#tools` SEO index on home; each `/tools/*` route |
| `FormatSupportSection` | `/formats` and nav **Formats** link |

### Hero CTAs (secondary marketing block)

The primary conversion path is **upload on the home hero** — no separate “Compare now” button required. [`HeroSection`](../../frontend/src/components/layout/HeroSection.tsx) provides secondary navigation:

| Button | Target | Role |
|--------|--------|------|
| **Browse all tools** | `/#tools` | Scroll to SEO tool index |
| **Compare PDF guide** | `/guides/compare-pdf-online` | SEO content bridge |

### Workflow steps (`messages.home.workflow.steps`)

| Step | Tool ID | Route |
|------|---------|-------|
| Extract what changed | `extract-pages` | `/tools/extract` |
| Merge the final pack | `arrange-merge` | `/tools/merge` |
| Sign and protect | `sign-pdf` | `/tools/sign` |

Compare is the **default home hero tool** — users upload and compare without leaving `/`.

### Featured complementary tools (`messages.home.complementary.toolIds`)

`convert-extract`, `split`, `compress-pdf`, `lock-unlock`, `word-to-pdf`, `pdf-to-jpg` — shown as tool cards below the workflow.

### SEO tool index (`messages.home.seoTools`)

All 18 tools listed by category (PDF from · To PDF · Work with PDFs) with links to each `/tools/{path}`. Preserves crawlable internal links after removing the full home grid. Anchor: `#tools` (nav **All tools** and footer **Tools** still work).

### Header nav (Compare + language)

[`SiteNav.tsx`](../../frontend/src/components/layout/SiteNav.tsx) uses a compact bar: **All tools** (mega menu with **Edit PDF · From PDF · To PDF** grouped inside) · **Pricing** · **Compare** (`/#workspace`) · **language switcher**. The three category dropdowns no longer occupy top-level nav slots. See [tool workspace UI — header nav](./tool-workspace-ui.md#comparison-with-site-header-nav).

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
| `HomeCompareHeroSection` | `frontend/src/components/layout/HomeCompareHeroSection.tsx` |
| `HeroSection` | `frontend/src/components/layout/HeroSection.tsx` |
| `HomeWorkflowSection` | `frontend/src/components/layout/HomeWorkflowSection.tsx` |
| `HomeToolsSection` | `frontend/src/components/layout/HomeToolsSection.tsx` |
| `ToolCardLink` | `frontend/src/components/layout/ToolCardLink.tsx` (reused for featured tools) |
| `AnnouncementBanner` | `frontend/src/components/layout/AnnouncementBanner.tsx` (global waitlist bar) |
| `WorkspaceToolRail` | `frontend/src/components/layout/WorkspaceToolRail.tsx` (single-PDF vertical icon rail) |

**Legacy (still used on other routes, not home):**

| Component | Still used on |
|-----------|---------------|
| `ToolGrid` | Not mounted on home; taxonomy reference for nav/workspace |
| `TrustBar` | Not mounted on home |
| `FormatSupportSection` | `/formats`, `/{locale}/formats` |

---

## Verification checklist

### Homepage

1. `/` — hero shows compare headline; **upload dropzone directly under H1**; tool switcher below upload
2. Upload a PDF on home — file appears in hero file list; switch tools without re-uploading
3. Workflow section — 3 steps with working tool links
4. `#tools` — all 18 tools linked by category; nav **All tools** scrolls here
5. `/es/`, `/fr/`, `/nl/`, `/pt/` — same structure, translated copy
6. View source — `<title>` and meta description include compare keywords
7. Mobile — announcement bar stays compact (email-only form); hero upload remains usable
8. Vertical tool rail — single-PDF icons on left; Merge/Compare in horizontal tabs; rail hidden in compare review mode

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
