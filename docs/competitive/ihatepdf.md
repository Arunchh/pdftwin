# ihatepdf.cv — competitive profile

> **Site:** [ihatepdf.cv](https://www.ihatepdf.cv/)  
> **Positioning:** Anti–iLovePDF — “free PDF tools you won’t hate using”  
> **Founder:** Pranav Mailarpawar (public build-in-public on LinkedIn)

See also: [Learnings & positioning](../strategy/learnings-and-positioning.md) · [Monetization plan](../strategy/monetization-plan.md)

---

## What they are

ihatepdf is a browser-based PDF toolkit launched as a direct response to [iLovePDF](https://www.ilovepdf.com/) and similar freemium tools. The name, `.cv` domain (resume editing is a core use case), and marketing all target frustration with watermarks, upload requirements, and daily limits.

**Reported traction (founder posts, ~6 months in):**

- 65K+ unique users, 87K+ sessions
- 120+ countries
- 500K search impressions, 22K+ organic clicks
- No paid ads; organic SEO + launch channels (Product Hunt #27, Peerlist #1)

**Monetization today:** Entirely free — no paid tier as of early 2026.

---

## How they build (architecture)

| Layer | Choice |
|-------|--------|
| Processing | **100% client-side** — WebAssembly in the browser |
| File upload | **Never** — files stay on device |
| Offline | Service worker caches WASM after first load |
| Compression | Ghostscript compiled to WASM (claimed unique among web tools) |
| Manipulation | pdf-lib, PDF.js |
| OCR | Tesseract.js (100+ languages) |
| Conversions | SheetJS, Mammoth.js, jsPDF |
| P2P sharing | WebRTC browser-to-browser (no server storage) |

**Structural consequence:** No server processing cost per user → no need for watermarks, task limits, or subscriptions to subsidize compute.

---

## Their business model (or lack of one)

ihatepdf inverts the standard PDF SaaS funnel:

| Typical (iLovePDF / Smallpdf) | ihatepdf |
|-------------------------------|----------|
| Upload to cloud | Process locally |
| Freemium → watermark / 2 tasks/day | Unlimited free forever |
| Server cost → limits | Browser cost → user’s CPU |
| Account for usage tracking | No account required |
| $7–12/mo Pro | No Pro (yet) |

Growth is the product strategy: SEO landing pages per tool, comparison blogs, AI tool directories, build-in-public.

---

## Tool breadth

~46 tools including merge, split, compress, edit, OCR, AI summarizer, P2P share, niche business generators (GST bills, etc.). PDFTwin ships **18 focused business tools** — narrower scope, hybrid monetization path.

---

## What they do better than us (today)

- Full client-side stack — verifiable zero-upload privacy
- No daily limits on any tool
- Larger free file ceiling (150 MB desktop)
- SEO volume and brand (“ihatepdf” is memorable)
- Offline-first after first visit

---

## What we can do better

- **PDF → Word / Excel quality** — server-side Python (pdf2docx, pdfplumber) for layout-heavy business docs
- **Side-by-side PDF compare** — already client-side; few competitors do this well
- **Monetization without watermarks** — Pro for heavy conversion + large files, not bait-and-switch
- **Multilingual filenames** — UTF-8 downloads preserved
- **Hybrid architecture** — client-side for organize tools, server for heavy conversion (see [implementation status](../product/implementation-status.md))

---

## References

- [Homepage](https://www.ihatepdf.cv/)
- [How it works (resources)](https://www.ihatepdf.cv/resources)
- [Technical blog (Ghostscript WASM)](https://www.ihatepdf.cv/technical-blog)
- [vs iLovePDF comparison](https://www.ihatepdf.cv/blog/ihatepdf-vs-ilovepdf-vs-smallpdf-vs-adobe)
