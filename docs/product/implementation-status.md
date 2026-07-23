# Implementation status

> Last updated: 2026-07 · [Docs hub](../README.md) · [Monetization plan](../strategy/monetization-plan.md)

---

## Plans & limits (live)

| Setting | Free | Pro |
|---------|------|-----|
| Price | $0 | **$9/mo** |
| File size limit | **50 MB** | 200 MB |
| PDF → Word/Excel | **3/day** | Unlimited |
| Watermarks | Never | Never |
| Account required | No | For Pro checkout |

**Config files:**

- Frontend: [`frontend/src/config/limits.ts`](../../frontend/src/config/limits.ts), [`pricing.ts`](../../frontend/src/config/pricing.ts)  
- Backend: [`backend/services/entitlements.py`](../../backend/services/entitlements.py)  
- Env: [`.env.example`](../../.env.example)  

---

## Daily document export cap

**Scope:** Only `/api/convert/pdf-to-word` and `/api/convert/pdf-to-excel`.

| Layer | Implementation |
|-------|----------------|
| Backend | [`backend/services/daily_usage.py`](../../backend/services/daily_usage.py) — HttpOnly cookie `pdftwin_doc_convert` |
| Frontend UX | [`frontend/src/services/dailyUsage.ts`](../../frontend/src/services/dailyUsage.ts) — localStorage mirror |
| Gate UI | [`frontend/src/components/ConvertLimitGate.tsx`](../../frontend/src/components/ConvertLimitGate.tsx) |
| Panel | [`frontend/src/components/ConvertExtractPanel.tsx`](../../frontend/src/components/ConvertExtractPanel.tsx) — remaining count + upgrade prompt |

Pro users bypass via `X-PDFTwin-Plan: pro` header.

Image extraction and other tools are **not** capped.

---

## Client-side PDF tools

**Library:** [pdf-lib](https://pdf-lib.js.org/) + [jszip](https://stjs.dev/) for multi-file split ZIP.

**Service:** [`frontend/src/services/pdfClient.ts`](../../frontend/src/services/pdfClient.ts)

| Tool | Panel | Server API (legacy) |
|------|-------|---------------------|
| Merge & arrange | [`ArrangeMergePanel.tsx`](../../frontend/src/components/ArrangeMergePanel.tsx) | `/api/arrange-merge` still exists |
| Split | [`SplitPanel.tsx`](../../frontend/src/components/SplitPanel.tsx) | `/api/split` still exists |
| Rotate | [`RotatePanel.tsx`](../../frontend/src/components/RotatePanel.tsx) | `/api/rotate` still exists |
| Compare | [`ComparePanel.tsx`](../../frontend/src/components/ComparePanel.tsx) | Never used server |

**UI badge:** [`ClientProcessedBadge.tsx`](../../frontend/src/components/ClientProcessedBadge.tsx) — “Processed on your device”.

Backend endpoints remain for API compatibility / fallback but frontend no longer calls them for these three tools.

---

## Server-side tools (unchanged)

Still upload to FastAPI (in-memory, discarded):

- PDF → Word, PDF → Excel *(daily cap on free)*  
- Word → PDF  
- Compress PDF  
- Watermark, lock/unlock  
- Extract pages  
- Extract embedded images  
- Image convert / resize  

---

## Billing & auth

| Feature | Status |
|---------|--------|
| PayPal subscription stub | Backend wired; `VITE_CHECKOUT_LIVE` for production |
| Pro price in code | **$9.00** |
| Supabase auth | Optional via `VITE_AUTH_PROVIDER=supabase` |
| Mock auth / Pro preview | Default for local dev |
| Cloud workspace | **Not started** — deferred |

---

## Deferred (see [roadmap](../strategy/roadmap.md))

- Cloud workspace sync (Supabase Storage)  
- Business tier  
- Annual Pro plan  
- Batch processing gates  
- SEO comparison landing pages  
- Priority queue differentiation  

---

## Architecture summary

```
Browser (client-side)          Server (FastAPI / Vercel)
─────────────────────          ─────────────────────────
Merge, split, rotate    →      PDF → Word/Excel (capped)
Compare                 →      Compress, watermark, lock
                               Word → PDF, images
                               In-memory only, no storage
```

---

## Related

- [ihatepdf profile](../competitive/ihatepdf.md) — what 100% client-side looks like  
- [Learnings](../strategy/learnings-and-positioning.md) — why hybrid
