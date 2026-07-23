import { formatFileLimit, FREE_DAILY_DOC_CONVERT_LIMIT, FREE_FILE_LIMIT_MB, FREE_MERGE_FILE_LIMIT } from "../config/limits";
import { TOOL_COUNT } from "../config/tools";

export interface ComparisonRow {
  label: string;
  pdftwin: string;
  ilovepdf: string;
  smallpdf: string;
  sejda: string;
  pdf24: string;
  ihatepdf: string;
}

export interface ComparisonHighlight {
  title: string;
  body: string;
}

export const COMPARISON_META = {
  title: "PDFTwin vs iLovePDF, Smallpdf, Sejda, PDF24 & ihatepdf (2026) | PDFTwin",
  description:
    "Honest comparison of PDFTwin vs iLovePDF, Smallpdf, Sejda, PDF24, and ihatepdf — watermarks, privacy, limits, compare tool, and PDF → Word quality.",
  h1: "PDFTwin vs iLovePDF and other PDF tools",
  intro:
    "Choosing a PDF workspace comes down to privacy, limits, and what you actually need to do with documents. This page compares PDFTwin honestly against five popular alternatives — no sponsored rankings, just how each product works in 2026.",
  updated: "July 2026",
};

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    label: "Free watermarks on output",
    pdftwin: "Never",
    ilovepdf: "No on most tools; check Pro-only features",
    smallpdf: "No watermark on many exports; task limits apply",
    sejda: "No watermark on free tier",
    pdf24: "No watermark; ad-supported web UI",
    ihatepdf: "Never",
  },
  {
    label: "Account required (free)",
    pdftwin: "No",
    ilovepdf: "No for basic tools",
    smallpdf: "Often pushed; some flows need login",
    sejda: "No",
    pdf24: "No",
    ihatepdf: "No",
  },
  {
    label: "Where files are processed",
    pdftwin: "Hybrid — browser for organize/OCR; server for heavy convert",
    ilovepdf: "Mostly server upload",
    smallpdf: "Server upload",
    sejda: "Server (web) or local (desktop app)",
    pdf24: "Server (web) or offline desktop Creator",
    ihatepdf: "100% browser (WebAssembly)",
  },
  {
    label: "Free file size limit",
    pdftwin: formatFileLimit(FREE_FILE_LIMIT_MB),
    ilovepdf: "Up to ~200 MB (varies by tool)",
    smallpdf: "Varies; Pro for large files",
    sejda: "50 MB per file (free web)",
    pdf24: "Generous; infrastructure-backed",
    ihatepdf: "Up to ~150 MB desktop",
  },
  {
    label: "Daily / task limits (free)",
    pdftwin: `${FREE_DAILY_DOC_CONVERT_LIMIT}/day Word/Excel; merge ≤${FREE_MERGE_FILE_LIMIT} PDFs; organize tools unlimited`,
    ilovepdf: "Some tools capped; queue at peak",
    smallpdf: "~2 tasks/day on free (varies)",
    sejda: "3 tasks/hour on free web",
    pdf24: "No artificial web limits",
    ihatepdf: "Unlimited",
  },
  {
    label: "Side-by-side PDF compare",
    pdftwin: "Yes — client-side, linked scroll",
    ilovepdf: "Yes",
    smallpdf: "Limited / not core focus",
    sejda: "No dedicated compare viewer",
    pdf24: "No",
    ihatepdf: "No",
  },
  {
    label: "PDF → Word / Excel quality",
    pdftwin: "Strong — server-side layout preservation",
    ilovepdf: "Strong — industry standard",
    smallpdf: "Good for simple docs",
    sejda: "Good; OCR on paid tiers",
    pdf24: "Basic convert tools",
    ihatepdf: "Browser-based; weaker on complex layouts",
  },
  {
    label: "Tool count (approx.)",
    pdftwin: String(TOOL_COUNT),
    ilovepdf: "30+",
    smallpdf: "30+",
    sejda: "30+",
    pdf24: "25+",
    ihatepdf: "46+",
  },
  {
    label: "Pro pricing (USD)",
    pdftwin: "$9/mo",
    ilovepdf: "~$7–10/mo",
    smallpdf: "~$12/mo",
    sejda: "~$7.50/week or monthly plans",
    pdf24: "Free web; Creator is free",
    ihatepdf: "Free (no paid tier yet)",
  },
  {
    label: "Mobile / desktop apps",
    pdftwin: "Web only",
    ilovepdf: "Web + iOS + Android + desktop",
    smallpdf: "Web + mobile + desktop",
    sejda: "Web + desktop (Mac/Win/Linux)",
    pdf24: "Web + free Windows Creator",
    ihatepdf: "Web (offline after load)",
  },
  {
    label: "Blog / SEO guides",
    pdftwin: "Growing — guides + blog",
    ilovepdf: "Large active blog",
    smallpdf: "Large blog + research posts",
    sejda: "Product blog + release notes",
    pdf24: "Help center + forums",
    ihatepdf: "Extensive SEO guides + technical blog",
  },
];

export const PDFTWIN_WINS: ComparisonHighlight[] = [
  {
    title: "Compare PDFs built in",
    body: "Review contract revisions with side-by-side rendering, linked scroll, and zoom — in your browser, with no upload for viewing.",
  },
  {
    title: "Honest free tier",
    body: "No watermarks on free output. Client-side merge, split, rotate, sign, OCR, and compare run without daily task caps.",
  },
  {
    title: "Business PDF → Word/Excel",
    body: "Server-side conversion tuned for proposals, reports, and tables — where pure browser engines often struggle on complex layouts.",
  },
  {
    title: "Multilingual SEO",
    body: "Tool guides and workspace copy in English, Spanish, French, and Dutch — useful for EU and LATAM teams.",
  },
];

export const WHEN_OTHERS_WIN: ComparisonHighlight[] = [
  {
    title: "100% client-side privacy (ihatepdf, Sejda desktop)",
    body: "If every byte must stay on-device and you never want server upload, ihatepdf or Sejda Desktop are structurally stronger. PDFTwin uses servers only for tools that need them.",
  },
  {
    title: "Unlimited free everything (PDF24, ihatepdf)",
    body: "PDF24 and ihatepdf offer broad free access without merge batch gates or daily Word export caps. PDFTwin trades some limits for sustainable server conversion quality.",
  },
  {
    title: "Brand scale & apps (iLovePDF, Smallpdf)",
    body: "Mature mobile apps, Chrome extensions, and enterprise sales motion. PDFTwin is web-first and focused on 18 business tools.",
  },
];

export const COMPARISON_FAQ = [
  {
    question: "Is PDFTwin an iLovePDF alternative?",
    answer:
      "Yes — especially if you want no watermarks, a strong Compare PDF workflow, and clear limits instead of mid-flow upsells. iLovePDF still wins on app ecosystem and raw tool breadth.",
  },
  {
    question: "Is PDFTwin better than ihatepdf?",
    answer:
      "For privacy-purists who want zero server upload on every tool, ihatepdf is stronger. PDFTwin is better when you need reliable PDF → Word/Excel, compare workflows, and a sustainable Pro tier without watermarks.",
  },
  {
    question: "Which tool is best for PDF → Word?",
    answer:
      "For complex business PDFs, server-based tools (PDFTwin, iLovePDF, Smallpdf) usually beat pure browser conversion. For simple text PDFs, client-side tools can be enough.",
  },
  {
    question: "Do any of these tools store my files?",
    answer:
      "Server-based tools (iLovePDF, Smallpdf, Sejda web, PDF24 web) hold files briefly during processing — typically minutes to hours per their privacy policies. PDFTwin discards server files after each request. Client-side tools (PDFTwin organize tools, ihatepdf) never upload file contents.",
  },
];
