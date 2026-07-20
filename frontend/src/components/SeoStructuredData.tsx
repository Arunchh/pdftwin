import { useEffect } from "react";
import { SUBSCRIPTION_FAQ } from "../config/faq";

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
      description:
        "Free online PDF tools to merge, split, convert, extract, and protect documents in your browser.",
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
          description: "All core PDF tools with a 30 MB per-file limit.",
        },
        {
          "@type": "Offer",
          name: "PDFTwin Pro",
          price: "9",
          priceCurrency: "USD",
          description: "Larger files, priority processing, and Pro support — billed monthly via PayPal.",
        },
      ],
      featureList: [
        "Merge and arrange PDFs",
        "Split PDF by page ranges",
        "Convert PDF to Word or Excel",
        "Extract pages and embedded images",
        "Lock and unlock PDF passwords",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: SUBSCRIPTION_FAQ.map((item) => ({
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
