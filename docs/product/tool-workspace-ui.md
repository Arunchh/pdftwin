# Tool workspace UI

> Last updated: 2026-07-27 · [Docs hub](../README.md) · [Implementation status](./implementation-status.md)

This document describes the **tool workspace** layout and navigation — the shell every `/tools/*` page shares. Individual tool panels (`CompressPanel`, `ArrangeMergePanel`, etc.) are documented in [implementation status](./implementation-status.md).

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
Land on /tools/{tool}
  → See tool name + category-colored workspace border
  → Category tab matches tool (e.g. Convert for /tools/compress)
  → Tool tabs show siblings in that category
  → Left: upload or pick from tray (IndexedDB, cross-tool)
  → Right: configure and run the tool (panel unchanged in Phase 1)
  → Switch tool tab → full page navigation, files stay in tray
```

Files uploaded in one tool remain available when switching to another (e.g. merge → convert) without re-uploading.

---

## Component map

| Component | Path | Role |
|-----------|------|------|
| `ToolWorkspace` | [`frontend/src/components/ToolWorkspace.tsx`](../../frontend/src/components/ToolWorkspace.tsx) | Shell: heading, nav, 2-column grid, dispatches to tool panels |
| `WorkspaceToolSwitcher` | [`frontend/src/components/layout/WorkspaceToolSwitcher.tsx`](../../frontend/src/components/layout/WorkspaceToolSwitcher.tsx) | Category tabs + filtered tool tabs (i18n labels) |
| `WorkspaceFileTray` | [`frontend/src/components/WorkspaceFileTray.tsx`](../../frontend/src/components/WorkspaceFileTray.tsx) | Left column: dropzone, file list, single “Clear all” |
| `FileDropzone` | [`frontend/src/components/FileDropzone.tsx`](../../frontend/src/components/FileDropzone.tsx) | Drag/drop + browse; Pro gate on oversized files |
| Tool panels | [`frontend/src/components/*Panel.tsx`](../../frontend/src/components/) | Per-tool logic (Phase 1: unchanged) |

### Data & state

| Layer | Path | Notes |
|-------|------|-------|
| `useWorkspaceFiles` | [`frontend/src/hooks/useWorkspaceFiles.ts`](../../frontend/src/hooks/useWorkspaceFiles.ts) | IndexedDB via `StorageAdapter`; shared across tools |
| Upload config | [`frontend/src/config/upload.ts`](../../frontend/src/config/upload.ts) | Per-tool `accept`, titles, labels |
| Tool registry | [`frontend/src/config/tools.ts`](../../frontend/src/config/tools.ts) | 18 tools, categories, routes |

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

Styles live in [`frontend/src/index.css`](../../frontend/src/index.css) under the “Workspace” section.

---

## Navigation behavior

### Category tabs

- **Convert & Export** → first convert tool (`/tools/convert`) when clicked from another category
- **Organize Documents** → `/tools/compare` (first organize tool in registry order)
- **Protect Files** → `/tools/watermark`

Clicking a category tab navigates to the **first tool in that category** (full page load). The active category is always derived from the current tool.

### Tool tabs

- Only tools where `tool.category === activeTool.category` are shown.
- Labels use i18n `messages.tools[toolId].shortLabel` (locale-aware via `toolPath(id, locale)`).
- “All tools” links to `/#tools` (or `/{locale}/#tools`).

### Comparison with site header nav

`SiteNav` uses category **dropdowns** on desktop and accordion on mobile. The workspace uses **horizontal tabs** scoped to the active category — fewer choices on screen, same category grouping.

---

## Files column (left)

Merged **upload + tray** into one surface (Phase 1):

1. Header: “Your files” + plan limit badge (`Free` / `Pro` · file size cap)
2. Tool-specific dropzone (`TOOL_UPLOAD_CONFIG[toolId]`)
3. File list from IndexedDB (name, size, remove per file)
4. Single **Clear all files** action (replaces separate “Clear tray” and “Clear workspace”)

Empty state: *“No files yet — upload above to get started.”*

---

## Responsive behavior

| Breakpoint | Behavior |
|------------|----------|
| **Desktop (default)** | 2-column grid; files column `position: sticky; top: 5.5rem` |
| **≤640px** | Single column (files above action); sticky disabled; tool tab labels hidden (icons only) |

Mobile is **secondary** for this redesign; desktop layout is the primary target.

---

## Phase 1 scope (shipped 2026-07-27)

**Included:**

- Two-column workspace layout
- Category-filtered horizontal tool navigation
- Combined files column (upload + tray + one clear action)
- Existing PDFTwin visual design (Option A)
- i18n for category and tool tab labels

**Not included (future phases):**

| Item | Phase | Notes |
|------|-------|-------|
| Result card with explicit Download | 2 | Replace auto-download in panels |
| Unified step shell for all tools | 2 | `ToolWorkflowShell`; simple tools stay one screen |
| Post-action tool chaining (“Merge → Convert”) | 2 | Contextual chips after success |
| Client-side tool switching (no full reload) | 3 | Astro + React router |
| File thumbnails in tray | 3 | Optional polish |
| Tool panel UI translation | 1.5 i18n | Panels still English-only |

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

- **Adding a new tool:** register in `tools.ts`, add panel + route in `ToolWorkspace`, upload config in `upload.ts`. Category tab and switcher update automatically from `TOOLS`.
- **Changing category order:** `CATEGORY_ORDER` in `WorkspaceToolSwitcher.tsx` and `ToolGrid.tsx` should stay in sync.
- **Do not** re-split upload and tray without updating this doc — the single files column is intentional for scan path and one clear action.
