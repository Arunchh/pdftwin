# Compare-first homepage & PDF compare viewer

> **Shipped:** 2026-07-27 · **Updated:** 2026-08-23 (unified compare workspace + dual-slot file tray) · [Docs hub](../README.md) · [Implementation status](./implementation-status.md) · [Tool workspace UI](./tool-workspace-ui.md)

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
| Compare hero | [`HomeCompareHeroSection.tsx`](../../frontend/src/components/layout/HomeCompareHeroSection.tsx) | H1 headline → **same compare workspace** as `/tools/compare` (panel left, dual upload slots right) |
| Workflow | [`HomeWorkflowSection.tsx`](../../frontend/src/components/layout/HomeWorkflowSection.tsx) | 3-step post-compare workflow with links into tools |
| Tools + SEO | [`HomeToolsSection.tsx`](../../frontend/src/components/layout/HomeToolsSection.tsx) | 6 featured complementary tools + quiet crawlable list of all 18 tools (`#tools`) |

### Unified compare workspace (UI/UX overhaul 2026-08-23)

The home page and `/tools/compare` now share **one layout**. Landing on `/` is equivalent to opening Compare from the **All tools** menu — the only difference is the marketing H1 above the workspace on home.

```
┌──────────────────────────────────────────────────────────────────┐
│  Eyebrow + H1 — "Compare two PDFs side by side…"  (home only)   │
├──────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────┬──────────────────────────────┐  │
│  │  ComparePanel (setup)       │  CompareFileTray (right)     │  │
│  │  · setup title + description│  ┌ Original ──────────────┐ │  │
│  │  · "Open compare viewer"    │  │ drop / browse / preview │ │  │
│  │    when both PDFs ready     │  └─────────────────────────┘ │  │
│  │                             │           vs                 │  │
│  │                             │  ┌ Revised ────────────────┐ │  │
│  │                             │  │ drop / browse / preview │ │  │
│  │                             │  └─────────────────────────┘ │  │
│  └─────────────────────────────┴──────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

**Key UX changes:**

| Before (2026-07-28) | After (2026-08-23) |
|---------------------|---------------------|
| Home: single generic dropzone → tool suggestions → compare | Home: compare tool active immediately |
| Compare: generic file tray + left/right pickers in panel | Compare: **two dedicated upload slots** on the right |
| Home and `/tools/compare` looked different | **Identical** two-column compare workspace |
| No live preview in upload UI | Each slot shows **page-1 thumbnail** + filename when filled |

Implementation:

| Piece | Path | Notes |
|-------|------|-------|
| Hero shell | [`HomeCompareHeroSection.tsx`](../../frontend/src/components/layout/HomeCompareHeroSection.tsx) | Renders H1 + `<ToolWorkspace toolId="pdf-compare" variant="homeCompare" />` |
| Compare file tray | [`CompareFileTray.tsx`](../../frontend/src/components/compare/CompareFileTray.tsx) | Right column: Original + Revised slots, swap button, privacy copy |
| Upload slot | [`CompareFileSlot.tsx`](../../frontend/src/components/compare/CompareFileSlot.tsx) | Per-slot drag/drop, browse, PDF thumbnail preview, remove |
| Compare panel | [`ComparePanel.tsx`](../../frontend/src/components/ComparePanel.tsx) | Setup + review viewer; file assignment moved to tray |
| Workspace shell | [`ToolWorkspace.tsx`](../../frontend/src/components/ToolWorkspace.tsx) | Lifts `compareLeftFile` / `compareRightFile` state; renders `CompareFileTray` instead of `WorkspaceFileTray` when compare tool active |

On **`/tools/compare`** and **home (`/`)**, layout is **compare panel | dual-slot file tray** on desktop. Other tools keep **rail | tool panel | standard file tray**.

CSS: `.compare-file-tray`, `.compare-file-slot-*`, `.compare-setup-empty`, `.workspace--home-compare` in [`index.css`](../../frontend/src/index.css).

**Removed:** `variant="homeHero"` (single-column upload-first flow), tool suggestion grid on home, inline left/right pickers inside `ComparePanel`.

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

Compare is the **default home hero tool** — users land directly in compare without an extra tool-selection step.

### Compare file tray (dual upload slots)

Each slot in the right column is a self-contained upload surface:

| State | UI |
|-------|-----|
| **Empty** | Dashed border, upload icon, placeholder copy ("Drop your original PDF here"), **Browse PDF** button |
| **Filled** | Live **page-1 thumbnail** (PDF.js via `useFileThumbnail`), filename, file size, remove button |
| **Both filled** | **Swap documents** button between slots |

Slots are labeled **Original** and **Revised** (i18n: `compare.leftSlotLabel`, `compare.rightSlotLabel`). Visual polish: gradient tray background, inset highlights, hover/drag states, shimmer loading skeleton for thumbnails.

Files are held in React state in `ToolWorkspace` (`compareLeftFile`, `compareRightFile`) — not the generic IndexedDB workspace tray. This keeps compare's two-file requirement explicit and avoids the old tray → assign-left/right indirection.

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

**Route:** `/tools/compare` and home (`/`) · **Panel:** [`ComparePanel.tsx`](../../frontend/src/components/ComparePanel.tsx) · **File tray:** [`CompareFileTray.tsx`](../../frontend/src/components/compare/CompareFileTray.tsx)

### Two phases

```
Setup                          Review (immersive)
─────                          ──────────────────
Add Original + Revised PDFs    Full-width dual panes
in CompareFileTray (right)     Toolbar: zoom, fit, page nav, fullscreen
Click "Open compare viewer"    Workspace chrome hidden (see below)
```

### Workspace integration

[`ToolWorkspace.tsx`](../../frontend/src/components/ToolWorkspace.tsx) manages compare file state and listens to `onReviewModeChange` from `ComparePanel`:

- When `reviewMode === true`: hides tool heading, `WorkspaceToolRail`, and `CompareFileTray`
- Adds classes `workspace--compare-review`, `workspace-layout--compare-review`
- User exits via **Change documents** in compare toolbar

| Prop / callback | Direction | Purpose |
|-----------------|-----------|---------|
| `leftFile`, `rightFile` | Workspace → Panel + Tray | Controlled compare documents |
| `onLeftFileChange`, `onRightFileChange` | Panel/Tray → Workspace | Update slot assignment |
| `onReviewModeChange(active)` | Panel → Workspace | Toggle chrome visibility |

| Feature | Details |
|---------|---------|
| **Zoom** | Linked or independent; ± buttons; keyboard `+` / `-` |
| **Fit width** | Calculates scale from pane width and page dimensions |
| **View modes** | **Single page** (default) or **continuous scroll** |
| **Page navigation** | Prev/next, page number input (single-page mode) |
| **Scroll sync** | Linked scroll in continuous mode only |
| **Fullscreen** | Native Fullscreen API on viewer container |
### Review-mode features

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
| `compare` | Full panel + file tray copy (`fileTrayTitle`, `leftSlotPlaceholder`, `browsePdf`, `setupAwaitingFiles`, toolbar, zoom, pages, fullscreen) | `ComparePanel`, `CompareFileTray`, `CompareFileSlot` |

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
| `CompareFileTray` | `frontend/src/components/compare/CompareFileTray.tsx` |
| `CompareFileSlot` | `frontend/src/components/compare/CompareFileSlot.tsx` |

**Legacy (still used on other routes, not home):**

| Component | Still used on |
|-----------|---------------|
| `ToolGrid` | Not mounted on home; taxonomy reference for nav/workspace |
| `TrustBar` | Not mounted on home |
| `FormatSupportSection` | `/formats`, `/{locale}/formats` |

---

## Verification checklist

### Homepage

1. `/` — hero shows compare H1; **same compare workspace as `/tools/compare`** (panel left, dual upload slots right)
2. Empty slots show placeholder + browse button; filled slots show page-1 thumbnail + filename
3. Both PDFs added — **Open compare viewer** enabled in setup panel
4. Workflow section — 3 steps with working tool links
5. `#tools` — featured tools list and quiet `#tools` SEO index
6. `/es/`, `/fr/`, `/nl/`, `/pt/` — same structure, translated copy
7. View source — `<title>` and meta description include compare keywords

### Compare tool (home and `/tools/compare`)

1. Add Original + Revised PDFs in right-column slots; live thumbnails appear
2. **Swap documents** — swaps slot assignment
3. **Open compare viewer** — enters review mode
4. Review mode — file tray and tool rail hidden; dual panes full width
5. Zoom in/out — visible size changes (not just resolution)
6. **Fit width** — both panes scale to pane width
7. Single-page mode — prev/next and page input work; arrow keys work
8. Continuous mode — linked scroll syncs both panes
9. Fullscreen — viewer fills screen; exit restores layout
10. **Change documents** — returns to setup with dual-slot tray visible

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
