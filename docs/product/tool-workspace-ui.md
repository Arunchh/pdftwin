# Tool workspace UI

> **Status:** Phases 1–3 complete (2026-07-27) · [Docs hub](../README.md) · [Implementation status](./implementation-status.md)

This document is the canonical spec for the **tool workspace** — the shared shell on every `/tools/*` page. Individual tool panels (`CompressPanel`, `ArrangeMergePanel`, etc.) are documented in [implementation status](./implementation-status.md).

### Rollout summary

| Phase | Date | Delivered |
|-------|------|-----------|
| **1** | 2026-07-27 | Two-column layout, category-filtered tabs, merged files column |
| **2** | 2026-07-27 | Result cards, workflow shell, next-step chips (17 panels) |
| **3** | 2026-07-27 | Client-side tool switching, file thumbnails, mobile refinements |

Commits: `c1ea547` (Phase 1) · `021da07` (Phase 2) · `e34a223` (Phase 3)

---

## Overview

PDFTwin’s workspace is a **two-column desktop layout**:

| Column | Width | Purpose |
|--------|-------|---------|
| **Files (left)** | ~320px, sticky | Upload dropzone + persisted file list |
| **Action (right)** | Flexible | Active tool panel (options, run, messages) |

Above the columns:

1. **Tool heading** — name and one-line description (from `tools.ts` / i18n)
2. **Category tabs** — Convert & Export · Organize Documents · Protect Files
3. **Tool tabs** — only tools in the active category (not all 18 at once)

Design tokens and category colors follow the existing **Neon Pastel / PDFTwin** palette (`index.css` `:root`).

---

## User flow

```
Land on /tools/{tool} (direct link, SEO landing, or header nav)
  → Full page load with correct tool panel (Astro static route)
  → See tool name + category-colored workspace border
  → Category tab matches tool (e.g. Convert for /tools/compress)
  → Tool tabs show siblings in that category
  → Left: upload or pick from tray (IndexedDB, cross-tool) with thumbnails
  → Right: configure and run the tool
  → Switch tool tab → client-side swap (History API, no reload)
  → Browser back/forward → popstate restores previous tool + URL
  → Run tool → result card with explicit Download + next-step chips
  → Next-step chip → client-side nav when already in workspace
```

Files uploaded in one tool remain available when switching to another (e.g. merge → convert) without re-uploading. Static Astro routes still exist for SEO, direct links, and first paint; in-workspace tab clicks use client navigation.

---

## Component map

| Component | Path | Role |
|-----------|------|------|
| `ToolWorkspace` | [`frontend/src/components/ToolWorkspace.tsx`](../../frontend/src/components/ToolWorkspace.tsx) | Shell: heading, nav, 2-column grid, dispatches to tool panels |
| `WorkspaceToolSwitcher` | [`frontend/src/components/layout/WorkspaceToolSwitcher.tsx`](../../frontend/src/components/layout/WorkspaceToolSwitcher.tsx) | Category tabs + filtered tool tabs (i18n labels) |
| `WorkspaceFileTray` | [`frontend/src/components/WorkspaceFileTray.tsx`](../../frontend/src/components/WorkspaceFileTray.tsx) | Left column: dropzone, file list, single “Clear all” |
| `FileDropzone` | [`frontend/src/components/FileDropzone.tsx`](../../frontend/src/components/FileDropzone.tsx) | Drag/drop + browse; Pro gate on oversized files |
| `ToolResultCard` | [`frontend/src/components/ToolResultCard.tsx`](../../frontend/src/components/ToolResultCard.tsx) | Success state: filename, Download, next steps |
| `ToolPanelFeedback` | [`frontend/src/components/ToolPanelFeedback.tsx`](../../frontend/src/components/ToolPanelFeedback.tsx) | Error + notice + result card wrapper for panels |
| `ToolWorkflowShell` | [`frontend/src/components/ToolWorkflowShell.tsx`](../../frontend/src/components/ToolWorkflowShell.tsx) | Step rail for multi-step tools |
| `WorkspaceFileThumbnail` | [`frontend/src/components/WorkspaceFileThumbnail.tsx`](../../frontend/src/components/WorkspaceFileThumbnail.tsx) | Tray row preview (image, PDF, or type icon) |
| Tool panels | [`frontend/src/components/*Panel.tsx`](../../frontend/src/components/) | Per-tool logic; use `useToolResult` for panels |

### Data & state

| Layer | Path | Notes |
|-------|------|-------|
| `useWorkspaceFiles` | [`frontend/src/hooks/useWorkspaceFiles.ts`](../../frontend/src/hooks/useWorkspaceFiles.ts) | IndexedDB via `StorageAdapter`; shared across tools |
| `useWorkspaceNavigation` | [`frontend/src/hooks/useWorkspaceNavigation.ts`](../../frontend/src/hooks/useWorkspaceNavigation.ts) | Client tool switching via `history.pushState` / `popstate` |
| `useFileThumbnail` | [`frontend/src/hooks/useFileThumbnail.ts`](../../frontend/src/hooks/useFileThumbnail.ts) | Object URLs for images; PDF.js first-page cache for PDFs |
| `useMediaQuery` | [`frontend/src/hooks/useMediaQuery.ts`](../../frontend/src/hooks/useMediaQuery.ts) | Breakpoint helpers for mobile tray behavior |
| `WorkspaceNavProvider` | [`frontend/src/context/WorkspaceNavContext.tsx`](../../frontend/src/context/WorkspaceNavContext.tsx) | Exposes `navigateToTool` to result-card next steps |
| `workspaceNavStore` | [`frontend/src/stores/workspaceNavStore.ts`](../../frontend/src/stores/workspaceNavStore.ts) | Pub/sub for header tool pill label on client nav |
| `useToolResult` | [`frontend/src/hooks/useToolResult.ts`](../../frontend/src/hooks/useToolResult.ts) | Pending download blob + error state for panels |
| Upload config | [`frontend/src/config/upload.ts`](../../frontend/src/config/upload.ts) | Per-tool `accept`, titles, labels |
| Next-step links | [`frontend/src/config/toolNextSteps.ts`](../../frontend/src/config/toolNextSteps.ts) | Suggested tools on result card |
| Tool registry | [`frontend/src/config/tools.ts`](../../frontend/src/config/tools.ts) | 18 tools, categories, routes, `toolIdFromPath()` |

---

## Layout structure (DOM)

```html
<section class="workspace workspace--{category}">
  <div class="workspace-heading">…</div>

  <nav class="workspace-nav">
    <div class="workspace-category-tabs">…</div>   <!-- 3 categories + All tools -->
    <div class="workspace-tool-switcher">…</div>   <!-- tools in active category -->
  </nav>

  <div class="workspace-layout">
    <aside class="workspace-files-column panel">…</aside>
    <div class="workspace-action-column">
      <div class="panel tool-panel">…</div>        <!-- e.g. CompressPanel -->
    </div>
  </div>
</section>
```

### CSS classes (workspace-specific)

| Class | Purpose |
|-------|---------|
| `.workspace-layout` | CSS grid: 320px + 1fr on desktop; single column ≤640px |
| `.workspace-files-column` | Sticky left column; dashed border |
| `.workspace-action-column` | Right column; hosts existing tool panels |
| `.workspace-category-tabs` | Top row: Convert / Organize / Protect |
| `.workspace-category-tab--{category}.active` | Category accent colors |
| `.workspace-tool-switcher` | Second row: tool tabs for active category only |
| `.workspace-tray-thumb` | 40×40 file preview in tray rows |
| `.workspace-files-collapsible` | Mobile `<details>` wrapper for file list |
| `.workspace-tab-btn` / `.workspace-chip-btn` | Button-based tabs and next-step chips (no full reload) |

Styles live in [`frontend/src/index.css`](../../frontend/src/index.css) under the “Workspace” section.

---

## Architecture

PDFTwin is **not a single-page app**. Astro pre-renders each tool URL; the workspace React island hydrates on that page. Phase 3 adds **partial client routing** inside the island only — static routes remain the source of truth for SEO and first paint.

```
┌─────────────────────────────────────────────────────────────────┐
│  Astro static page (/tools/compress, /es/tools/compress, …)     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ToolWorkspace (React island)                             │  │
│  │  ├─ useWorkspaceNavigation — activeToolId state           │  │
│  │  ├─ useWorkspaceFiles — IndexedDB tray (cross-tool)       │  │
│  │  ├─ WorkspaceToolSwitcher — button tabs → navigateToTool  │  │
│  │  ├─ WorkspaceFileTray — dropzone + thumbnails             │  │
│  │  └─ *Panel — active tool (swapped on client nav)          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
         │ pushState / popstate              │
         ▼                                     ▼
   URL bar updates                    Browser back/forward
   document.title                     restores tool + panel
   SiteHeader pill (workspaceNavStore)
```

**First visit:** full Astro page load → correct tool panel in HTML.  
**In-workspace tab click:** `history.pushState` + React panel swap — no reload, tray persists in memory/IndexedDB.  
**External link / refresh:** full load again from static route.

### i18n in the workspace

| Translated (EN/ES/FR/NL) | English-only |
|--------------------------|--------------|
| Tool heading name + description | Panel form labels, buttons, help text |
| Category tab labels (`toolGrid.categories`) | “Your files”, “Clear all files”, empty-state copy |
| Tool tab short labels (`tools[id].shortLabel`) | Upload dropzone strings (`upload.ts`) |
| Page title on client nav | Merge batch gate, convert limit gate copy |

See [i18n doc](./i18n.md#next-phases) — tool panel translation is the next open i18n item.

---

## Navigation behavior

### Client-side switching (Phase 3)

In-workspace category and tool tabs are **`<button>` elements**, not `<a href>` links. Clicking a tab calls `navigateToTool(toolId)` from [`useWorkspaceNavigation`](../../frontend/src/hooks/useWorkspaceNavigation.ts):

1. `history.pushState({ toolId }, "", toolPath(toolId, locale))` — URL updates for sharing and back button
2. React state swaps the active panel without a full page reload
3. `document.title` and the header tool pill update via i18n copy + [`workspaceNavStore`](../../frontend/src/stores/workspaceNavStore.ts)
4. Workspace scrolls into view smoothly

**Back/forward:** `popstate` listener resolves the tool from `window.location.pathname` via `toolIdFromPath()` and restores panel + meta.

**Direct loads:** Landing on `/tools/compress` from Google or a bookmark still uses Astro’s static HTML (full page load). Client navigation only applies after the React island hydrates.

**Next-step chips:** [`ToolResultCard`](../../frontend/src/components/ToolResultCard.tsx) uses `useWorkspaceNav()` when inside the workspace; chips call `navigateToTool` instead of following `<a href>`.

**Header pill:** [`SiteHeader`](../../frontend/src/components/layout/SiteHeader.tsx) subscribes to `workspaceNavStore` with `useSyncExternalStore` so the active-tool badge updates on client nav without reload.

### Category tabs

- **Convert & Export** → first convert tool (`convert-extract` / `/tools/convert`) when clicked from another category
- **Organize Documents** → `pdf-compare` (`/tools/compare`)
- **Protect Files** → `watermark-pdf` (`/tools/watermark`)

Clicking a category tab navigates to the **first tool in that category** (client-side). The active category is always derived from the current tool.

### Tool tabs

- Only tools where `tool.category === activeTool.category` are shown.
- Labels use i18n `messages.tools[toolId].shortLabel` (locale-aware via `toolPath(id, locale)`).
- “All tools” links to `/#tools` (or `/{locale}/#tools`) — full navigation to home anchor.

### Comparison with site header nav

`SiteNav` uses category **dropdowns** on desktop and accordion on mobile (full page links). The workspace uses **horizontal button tabs** scoped to the active category — fewer choices on screen, same category grouping, instant panel swap.

---

## Files column (left)

Merged **upload + tray** into one surface (Phase 1), with thumbnails (Phase 3):

1. Header: “Your files” + plan limit badge (`Free` / `Pro` · file size cap)
2. Tool-specific dropzone (`TOOL_UPLOAD_CONFIG[toolId]`) — always visible, including on mobile
3. File list from IndexedDB — each row shows a **thumbnail**, name, size, and remove control
4. Single **Clear all files** action (replaces separate “Clear tray” and “Clear workspace”)

### Thumbnails

[`WorkspaceFileThumbnail`](../../frontend/src/components/WorkspaceFileThumbnail.tsx) + [`useFileThumbnail`](../../frontend/src/hooks/useFileThumbnail.ts):

| File type | Preview |
|-----------|---------|
| Images | `URL.createObjectURL` |
| PDF | PDF.js first-page render via [`pdfThumbnailDataUrl`](../../frontend/src/services/pdfJsClient.ts) (in-memory cache per file) |
| DOCX / other | Lucide type icon fallback |

Empty state: *“No files yet — upload above to get started.”*

---

## Responsive behavior

| Breakpoint | Behavior |
|------------|----------|
| **Desktop (default)** | 2-column grid; files column `position: sticky; top: 5.5rem` |
| **≤640px** | Single column; **action column first** (`order: 1`), files second (`order: 2`); sticky disabled; tool tab labels hidden (icons only) |
| **≤640px + files present** | File list collapses into `<details>` (“Your files (N)”) — dropzone stays visible above the collapsible list |

Mobile refinements prioritize reaching the tool panel quickly while keeping upload accessible without scrolling past a long file list.

---

## Phase 1 scope (shipped 2026-07-27)

**Included:**

- Two-column workspace layout
- Category-filtered horizontal tool navigation
- Combined files column (upload + tray + one clear action)
- Existing PDFTwin visual design (Option A)
- i18n for category and tool tab labels

---

## Phase 2 scope (shipped 2026-07-27)

**Included:**

| Feature | Implementation |
|---------|----------------|
| Result card + explicit Download | [`ToolResultCard.tsx`](../../frontend/src/components/ToolResultCard.tsx) — no auto-download after processing |
| Result state hook | [`useToolResult.ts`](../../frontend/src/hooks/useToolResult.ts) |
| Panel feedback wrapper | [`ToolPanelFeedback.tsx`](../../frontend/src/components/ToolPanelFeedback.tsx) |
| Workflow shell (multi-step tools) | [`ToolWorkflowShell.tsx`](../../frontend/src/components/ToolWorkflowShell.tsx) |
| Post-action tool links | [`toolNextSteps.ts`](../../frontend/src/config/toolNextSteps.ts) — chips on result card |

**All 17 download-capable panels** now show a result card with filename, size, Download button, and contextual next-step links. Compare (`ComparePanel`) is unchanged — no file download.

**Workflow shell** used by: Convert, Extract, Merge, Split, Lock/Unlock, Image Convert.

**Simple one-screen tools** (Compress, Rotate, Watermark, etc.) use result card only — no forced step rail.

### Result flow

```
User runs tool → processing → ToolResultCard appears
  → User clicks Download (explicit)
  → Optional: Next steps chips (e.g. Merge → Convert, Compress → Protect)
```

---

## Phase 3 scope (shipped 2026-07-27)

**Included:**

| Feature | Implementation |
|---------|----------------|
| Client-side tool switching | [`useWorkspaceNavigation.ts`](../../frontend/src/hooks/useWorkspaceNavigation.ts) — `pushState` / `popstate`, panel swap in `ToolWorkspace` |
| Nav context for chips | [`WorkspaceNavContext.tsx`](../../frontend/src/context/WorkspaceNavContext.tsx) + [`ToolResultCard`](../../frontend/src/components/ToolResultCard.tsx) |
| Header pill sync | [`workspaceNavStore.ts`](../../frontend/src/stores/workspaceNavStore.ts) + [`SiteHeader.tsx`](../../frontend/src/components/layout/SiteHeader.tsx) |
| Button-based tabs | [`WorkspaceToolSwitcher.tsx`](../../frontend/src/components/layout/WorkspaceToolSwitcher.tsx) — replaces `<a href>` for in-category switches |
| Path → tool resolver | [`toolIdFromPath()`](../../frontend/src/config/tools.ts) for back/forward and popstate |
| File thumbnails | [`WorkspaceFileThumbnail.tsx`](../../frontend/src/components/WorkspaceFileThumbnail.tsx), [`useFileThumbnail.ts`](../../frontend/src/hooks/useFileThumbnail.ts) |
| Mobile layout | Action-first column order; collapsible file list via `<details>`; dropzone always visible |
| File type helpers | [`utils/files.ts`](../../frontend/src/utils/files.ts) — `isPdfFile`, `isImageFile`, `isDocxFile`, `fileForRecord()` |

**Not included (future):**

| Item | Notes |
|------|-------|
| Tool panel UI translation | Phase 1.5 i18n — panels still English-only |
| Prefetch adjacent tool panels | Optional performance win |
| Full SPA router | Static Astro routes remain source of truth for SEO |

See [roadmap — workspace UI](../strategy/roadmap.md#workspace-ui-redesign).

---

## Related pages

| Route | Workspace |
|-------|-----------|
| `/tools/{path}` | English default |
| `/{locale}/tools/{path}` | ES, FR, NL |
| `/guides/{slug}` | SEO landing → CTA links into tool workspace |

Legacy hash URLs (`#merge`, `#convert`, …) redirect via inline script in `BaseLayout.astro`.

---

## Maintenance notes

- **Adding a new tool:** register in `tools.ts`, add panel + route in `ToolWorkspace`, upload config in `upload.ts`, optional entries in `toolNextSteps.ts`. Category tab and switcher update automatically from `TOOLS`.
- **Download UX:** panels must use `useToolResult` + `ToolPanelFeedback` — do not call `downloadBlob` / `downloadResponse` directly after processing.
- **Client navigation:** in-workspace tabs must call `navigateToTool` — do not use `<a href>` for sibling tool switches (breaks instant swap and preserves tray state awkwardly via full reload).
- **Changing category order:** `CATEGORY_ORDER` in `WorkspaceToolSwitcher.tsx` and `ToolGrid.tsx` should stay in sync.
- **Do not** re-split upload and tray without updating this doc — the single files column is intentional for scan path and one clear action.

### Verification checklist

After workspace changes, manually verify:

1. Land on `/tools/merge` — correct panel, category tab, tool tabs for Organize
2. Click **Compress** tab — panel swaps without reload; URL becomes `/tools/compress`; files remain in tray
3. Browser **Back** — returns to merge panel and URL
4. Upload a PDF and an image — thumbnails appear in tray rows
5. Run a tool — result card shows; **Download** works; next-step chip navigates client-side
6. Header tool pill updates when switching tools
7. At ≤640px width — action column first; file list collapses; dropzone still visible
8. Localized route `/es/tools/comprimir-pdf` or `/es/tools/compress` — client nav preserves locale in URL
