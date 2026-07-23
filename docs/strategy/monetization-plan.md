# Monetization plan

> Status: [Implementation](../product/implementation-status.md) · Competitor: [ihatepdf](./competitive/ihatepdf.md) · Strategy: [Learnings](./learnings-and-positioning.md)

---

## Revenue target

**$3,000–5,000 USD/month** from PDFTwin Pro subscriptions.

| Price | Subscribers needed |
|-------|-------------------|
| $9/mo | 334–556 |
| $12/mo (future) | 250–417 |

Assumption: **0.5–1.5% conversion** of monthly actives once SEO compounds.

Example: 40K monthly actives × 1% × $9 ≈ **$3,600/mo**.

ihatepdf reached ~65K users in 6 months with **$0 revenue**. We trade some pure-generosity for sustainable Pro value.

---

## Philosophy: generous free, pay for power

### Free tier (volume engine)

Designed to beat iLovePDF/Smallpdf on trust:

- **No watermarks** on any output  
- **No daily limits** on client-side tools (merge, split, rotate, compare, sign, OCR, etc.)  
- **No account** required for basic use  
- **50 MB** per file ([limits.ts](../../frontend/src/config/limits.ts))  
- **3 PDF → Word/Excel exports per day** (server-enforced)  
- **Merge up to 5 PDFs** at once ([`FREE_MERGE_FILE_LIMIT`](../../frontend/src/config/limits.ts))  
- All **18 tools** accessible  

### Pro tier ($9/month)

Pay for **time, volume, and server-heavy work**:

| Benefit | Status |
|---------|--------|
| **200 MB** per file | ✅ Live |
| **Unlimited** PDF → Word & Excel | ✅ Live |
| **Unlimited merge batch size** (6+ PDFs) | ✅ Live |
| Priority processing queue | 🔜 Marketing copy; queue not differentiated yet |
| Batch conversions & presets | 🔜 Planned |
| Cloud workspace sync | ⏸ Deferred — see [roadmap](./roadmap.md) |

### Deferred (post-traction)

| Tier | Price | Trigger |
|------|-------|---------|
| Business (5 seats, shared workspace) | $19–24/mo | After 50–100 clicks/day |
| Annual Pro (~30% off) | ~$79/yr | After PayPal plan stable |
| API access | $49–99/mo | When demand appears |

---

## Conversion triggers (non-scammy)

Upgrade moments — never block mid-download or watermark:

1. File **> 50 MB** → Pro supports up to 200 MB (`UploadProGate`)  
2. **4th Word/Excel export** of the day → `ConvertLimitGate`  
3. **6th PDF in merge queue** → `MergeBatchGate` (free allows 5)  
4. *(Future)* Cloud sync across devices → Pro  

---

## Unit economics

| Tool type | Processing | Free cost to us |
|-----------|------------|-----------------|
| Merge, split, rotate, compare, sign, remove pages | Browser (pdf-lib / PDF.js) | ~$0 |
| Images→PDF, PDF→JPG, PDF→text | Browser (pdf-lib / PDF.js) | ~$0 |
| OCR | Browser (Tesseract.js WASM) | ~$0 (user’s CPU) |
| PDF → Word/Excel | Python serverless | High — **daily cap** |
| Compress, watermark, lock | Python serverless | Medium — file size gate |
| Image convert/resize, extract pages | Python serverless | Medium |

New client-side tools (2026-07-23) expand the zero-COGS surface without watermarks. Server tools remain the Pro value anchor for layout-heavy conversion.

---

## PayPal billing

- Live price: **$9.00 USD/month** ([paypal_service.py](../../backend/services/paypal_service.py))  
- Checkout: PayPal subscriptions (`VITE_CHECKOUT_LIVE=true` when wired)  
- **Note:** Existing PayPal plan IDs created at $7 must be updated or recreated at $9  

---

## Metrics to watch

| Metric | Target (pre-monetization) | Target (growth) |
|--------|---------------------------|-----------------|
| Organic clicks/day | 50–100 | 500+ |
| Free → Pro conversion | — | 0.5–1.5% |
| Word/Excel exports/day (free) | — | Monitor cap hit rate |
| Merge batch gate hits (6+ PDFs) | — | Monitor Pro upgrade rate |
| Client vs server tool usage | — | Client should dominate sessions |

---

## Related

- [Roadmap — what ships next](./roadmap.md)  
- [Implementation status](../product/implementation-status.md)
