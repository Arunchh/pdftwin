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
| Compare hero | [`HomeCompareHeroSection.tsx`](../../frontend/src/components/layout/HomeCompareHeroSection.tsx) | H1 headline → **upload dropzone** → suggested next steps (Compare, Merge, etc.) based on files dropped |
| Workflow | [`HomeWorkflowSection.tsx`](../../frontend/src/components/layout/HomeWorkflowSection.tsx) | 3-step post-compare workflow with links into tools |
| Tools + SEO | [`HomeToolsSection.tsx`](../../frontend/src/components/layout/HomeToolsSection.tsx) | 6 featured complementary tools + quiet crawlable list of all 18 tools (`#tools`) |

### File-led hero layout (UI/UX overhaul 2026-08-23)

The home compare hero follows a **file-led** flow: upload on the home hero, then contextual tool suggestions appear depending on what you uploaded. Tool selection can also happen via the header **All tools** mega menu.

```
┌─────────────────────────────────────────────────────┐
│  Eyebrow + H1 — "Compare two PDFs side by side…"    │
├─────────────────────────────────────────────────────┤
│  Hero upload dropzone (full width, prominent)       │
│  · drag-and-drop or click to browse                 │
│  · compact file list when files are present           │
├─────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────┐  │
│  │  Suggested actions appear when files drop     │  │
│  │  e.g. Compare PDFs, Merge PDFs (if 2+ files)  │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

Implementation:

| Piece | Path | Notes |
|-------|------|-------|
| Hero shell | [`HomeCompareHeroSection.tsx`](../../frontend/src/components/layout/HomeCompareHeroSection.tsx) | Renders H1 + `<ToolWorkspace toolId={null} variant="homeHero" />` |
| Upload zone | [`WorkspaceFileTray.tsx`](../../frontend/src/components/WorkspaceFileTray.tsx) `variant="hero"` | Large dropzone; no sidebar panel wrapper |
| Tool suggestions | [`ToolWorkspace.tsx`](../../frontend/src/components/ToolWorkspace.tsx) | When no tool is selected but files are uploaded, displays a grid of primary actions (Compare/Merge or Compress/Convert/Split/Sign) |

On **`/tools/*` routes**, layout is **rail | tool panel | file tray** on desktop.

CSS: `.workspace-hero-upload`, `.workspace-files-upload--hero`, `.workspace-layout--home-hero`, `.workspace-suggestions` in [`index.css`](../../frontend/src/index.css).

### Removed from home (simplified UI)

| Former home section | Status |
|---------------------|--------|
| `AnnouncementBanner` | Waitlist banner deleted to calm the global chrome |
| `HeroSection` | Second marketing hero block removed to focus entirely on the tool |
| `TrustBar` | Deleted to reduce noise; trust signals moved to copy/footer |
| `FormatSupportSection` | Removed from homepage/workspace routes; now only lives on `/formats` |
| `ToolGrid` | Deleted; replaced with a cleaner `featured-tool-card` grid |

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

All 18 tools listed by category (PDF from · To PDF · Work with PDFs) with links to each `/tools/{path}`. Preserves crawlable internal links after removing the full home grid. Anchor: `#tools` on home; full catalog at [`/tools/`](../../frontend/src/pages/tools/index.astro).

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

- When `reviewMode === true`: hides tool heading, `WorkspaceToolRail`, and `WorkspaceFileTray`
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

1. `/` — hero shows compare headline; **upload dropzone directly under H1**; no initial tool panel
2. Upload 2 PDFs on home — suggestions for Compare PDFs and Merge PDFs appear
3. Upload 1 PDF on home — suggestions for Compress, Convert, Split, and Sign appear
4. Workflow section — 3 steps with working tool links
5. `#tools` — featured tools list and quiet `#tools` SEO index
6. `/es/`, `/fr/`, `/nl/`, `/pt/` — same structure, translated copy
7. View source — `<title>` and meta description include compare keywords
8. Vertical tool rail — hidden on home until a tool is chosen, shows on `/tools/*`

### Compare tool

1. `/tools/compare` — upload 2 PDFs, assign left/right, **Open compare viewer**
2. Review mode — file tray and tool rail hidden; dual panes full width
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
