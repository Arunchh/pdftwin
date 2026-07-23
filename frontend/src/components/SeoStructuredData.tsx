import { useEffect } from "react";
import { ALL_FAQ } from "../config/faq";
import { BUSINESS_TAGLINE } from "../config/formats";
import { formatFileLimit, FREE_FILE_LIMIT_MB } from "../config/limits";
import { TOOL_COUNT } from "../config/tools";

const SITE_URL = "https://pdftwin.com";
const SITE_NAME = "PDFTwin";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: BUSINESS_TAGLINE,
      inLanguage: "en",
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#app`,
      name: SITE_NAME,
      url: SITE_URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires a modern web browser with JavaScript enabled.",
      offers: [
        {
          "@type": "Offer",
          name: "PDFTwin Free",
          price: "0",
          priceCurrency: "USD",
          description: `All ${TOOL_COUNT} business conversion tools with a ${formatFileLimit(FREE_FILE_LIMIT_MB)} per-file limit — no account required.`,
        },
        {
          "@type": "Offer",
          name: "PDFTwin Pro",
          price: "9",
          priceCurrency: "USD",
          description: "Larger files, priority processing, and team support — billed monthly via PayPal.",
        },
      ],
      featureList: [
        "Convert PDF to Word or Excel",
        "Compare two PDFs side by side",
        "Convert images to WebP, PNG, or JPEG",
        "Merge and arrange PDFs",
        "Split PDF by page ranges",
        "Extract pages and embedded images",
        "Lock and unlock PDF passwords",
        "Compress PDF file size",
        "Rotate PDF pages",
        "Convert Word to PDF",
        "Resize and compress images",
        "Add PDF watermarks",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/faq#faq`,
      url: `${SITE_URL}/faq`,
      mainEntity: ALL_FAQ.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

export default function SeoStructuredData() {
  useEffect(() => {
    const scriptId = "pdftwin-structured-data";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(structuredData);

    return () => {
      script?.remove();
    };
  }, []);

  return null;
}
