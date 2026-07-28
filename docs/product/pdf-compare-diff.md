# PDF compare & diff — architecture and decisions

> **Status:** Shipped 2026-07-27 · [Implementation status](./implementation-status.md) · [Tool workspace UI](./tool-workspace-ui.md)

PDFTwin’s compare tool (`pdf-compare`) delivers **two complementary experiences in one panel**:

1. **Viewer mode (default)** — manual side-by-side review with linked scroll/zoom.
2. **Diff mode (opt-in)** — automatic change detection: text redline, visual pixel highlights, or 50% overlay blend.

All processing is **client-side**. Viewing never uploads files. Diff analysis runs locally after the user explicitly enables it.

---

## Product decisions

### Why viewer and diff are separate modes

| Decision | Rationale |
|----------|-----------|
| **Default = viewer only** | Most users only need aligned panes; auto-diff is CPU-heavy and surprises users if always on. |
| **Diff is opt-in via toolbar** | Matches user intent (“show me changes”) and keeps compare-first positioning honest: we lead with review UX, not diff marketing. |
| **Single tool, not two routes** | Compare + merge/sign/OCR share one workspace tray; splitting into `/compare` and `/compare-diff` would fragment workflow. |
| **Diff control beside scroll/zoom lock** | All three controls answer “how do the two panes relate?” — grouping reduces toolbar hunting. |

### Diff mode matrix

| Mode | ID | Best for | Limitations |
|------|-----|----------|-------------|
| Viewer only | `off` | Eyeball review, design proofs, scanned docs | No automatic highlights |
| Text changes | `text` | Contracts, policies, prose revisions | Ignores layout, fonts, images, signatures |
| Visual changes | `visual` | Formatting, figures, “something moved” | Scanned PDFs compare as pixels (no OCR) |
| Overlay | `overlay` | Quick ghosting check | Right pane shows 50% blend, not readable prose |

### Swap left/right

- **Where:** Setup actions (before review) and review toolbar (during review).
- **Behavior:** Swaps files, loaded `PDFDocumentProxy` handles, and independent zoom levels instantly.
- **Why skip PDF re-parse:** `skipPdfReloadRef` counter prevents redundant `openPdfFile()` after swap — docs are already in memory.
- **Diff invalidation:** Clears analysis + visual overlays; effects re-run if diff mode is active.

### Privacy & trust messaging

- Viewer: “no upload for viewing” (existing copy).
- Diff: same — rasterization and worker math never leave the browser.
- Terms disclaimer remains: compare/diff is **not forensic** tamper detection.

---

## Technical architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ ComparePanel.tsx (React UI)                                      │
│  • Setup + review toolbar                                        │
│  • Viewer / diff mode state                                      │
│  • PageCanvas + text diff panes                                  │
└───────────────┬─────────────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────────┐
│ compareDiff.ts (main thread orchestration)                       │
│  • PDF.js: open, render pages, extract text                      │
│  • analyzeCompareDocuments() — page loop + progress              │
│  • renderVisualDiffForPage() — display-scale overlays            │
│  • blendOverlayPages() — canvas 50% blend (overlay mode)         │
└───────────────┬─────────────────────────────────────────────────┘
                │ RPC (postMessage)
                ▼
┌─────────────────────────────────────────────────────────────────┐
│ compareDiff.worker.ts (Web Worker)                               │
│  • Line diff (`diff` package)                                    │
│  • Pixel loops (compareDiffCore)                                 │
└─────────────────────────────────────────────────────────────────┘
                ▲
                │ pure functions
┌───────────────┴─────────────────────────────────────────────────┐
│ compareDiffCore.ts — no DOM, no PDF.js                           │
│ compareDiffTypes.ts — serializable DTOs                          │
│ compareDiffWorkerClient.ts — promise RPC by request id           │
└─────────────────────────────────────────────────────────────────┘
```

### Why PDF.js stays on the main thread

`PDFDocumentProxy` and canvas rendering require the main thread (and the existing pdf.js worker for parsing). Transferring PDF handles to a custom worker is not supported.

**Split:**

| Step | Thread |
|------|--------|
| Open PDF, `getPage`, `render`, `getTextContent` | Main |
| `diffLines`, pixel `for` loops | Worker |
| Build overlay canvas from worker `ImageData` | Main |

### Web Worker protocol

Request/response pairs use a monotonic string `id`. Types live in `compareDiffTypes.ts`.

| Request type | Purpose |
|--------------|---------|
| `text-page` | Line-level redline for one page |
| `visual-page` | Low-res change detection (`VISUAL_ANALYSIS_SCALE = 1.25`) |
| `visual-overlay` | Display-scale magenta overlay for visible pages |

**Cancellation:** `analyzeCompareDocuments(..., shouldCancel)` throws `"Analysis cancelled"` when `analysisToken` changes (mode swap, sensitivity change, unmount). UI ignores that error.

**Lifecycle:** `terminateCompareDiffWorker()` on `ComparePanel` unmount.

### Visual diff algorithm

1. Render both pages to white-filled canvases at the target scale.
2. Compare RGB channels per pixel; alpha ignored.
3. Threshold from sensitivity slider: `255 - (sensitivity/100)*200` (higher sensitivity → stricter → fewer false positives).
4. Changed pixels → `#db2777` @ ~66% alpha overlay.

**Page alignment:** Canvases sized to each page’s viewport at the same scale; comparison bitmap is `max(width) × max(height)`. Extra region treated as changed.

**Display overlays:** Computed at **current zoom** for visible pages only (single-page or continuous scroll batch). Analysis for changed-page list uses **1.25×** scale for speed.

### Text diff algorithm

1. Extract text per page via PDF.js `getTextContent()`, normalize whitespace.
2. Worker runs `diffLines` with `newlineIsToken: true`.
3. Segments: `equal` · `delete` (left/red) · `insert` (right/green).

Empty text on one side still diffs correctly (whole page = insert or delete).

### Keyboard shortcuts (review mode)

| Key | Action |
|-----|--------|
| `+` / `-` | Zoom (respects link zoom) |
| `←` / `→` | Prev/next page (single-page mode) |
| `Shift+←` / `Shift+→` | Prev/next **changed** page (when diff active) |

---

## UI components

| File | Role |
|------|------|
| [`ComparePanel.tsx`](../../frontend/src/components/ComparePanel.tsx) | Setup, review viewer, toolbar, swap, diff state |
| [`CompareDiffModeMenu.tsx`](../../frontend/src/components/compare/CompareDiffModeMenu.tsx) | Viewer/Diff dropdown beside sync controls |
| [`CompareTextDiffView.tsx`](../../frontend/src/components/compare/CompareTextDiffView.tsx) | Side-by-side redline panes |
| [`ToolWorkspace.tsx`](../../frontend/src/components/ToolWorkspace.tsx) | Hides tray/chrome in compare review mode |

### Review mode chrome

When `reviewMode === true`, workspace hides file tray and tool rail (`workspace--compare-review`). Fullscreen targets the dual-pane viewer element.

### CSS hooks

- `.compare-panel--diff` — diff-active styling
- `.compare-viewer--text-diff` — stacked text diff rows
- `.compare-page-overlay` — absolute magenta layer on PDF canvas
- `.compare-diff-*` — toolbar popover, sensitivity, status bar

---

## Dependencies

| Package | Use |
|---------|-----|
| `pdfjs-dist` | Render + text extraction |
| `diff` | Line-level text comparison (worker bundle) |

---

## Known limits & follow-ups

| Limit | Notes |
|-------|-------|
| Continuous + visual diff on 50+ pages | Overlays computed for all visible pages in scroll mode; may stutter — consider virtualizing or worker batch queue. |
| No diff export yet | PNG/PDF report export not implemented. |
| Scanned PDFs | Text mode empty; use visual or OCR tool first. |
| Forensic use | Not designed for legal tamper proof; visual threshold can miss subtle changes. |

---

## File index

```
frontend/src/services/
  compareDiff.ts              # Main-thread orchestration (entry for UI)
  compareDiffCore.ts          # Pure diff math (shared with worker)
  compareDiffTypes.ts         # Serializable types + worker messages
  compareDiff.worker.ts       # Web Worker entry (Vite `?worker` / `new URL`)
  compareDiffWorkerClient.ts  # Promise RPC to worker

frontend/src/components/
  ComparePanel.tsx
  compare/CompareDiffModeMenu.tsx
  compare/CompareTextDiffView.tsx
```

---

## Related docs

- [Compare-first homepage](./compare-first-homepage.md)
- [Implementation status — pdf-compare row](./implementation-status.md)
- [Competitive notes — ihatepdf](../competitive/ihatepdf.md)
