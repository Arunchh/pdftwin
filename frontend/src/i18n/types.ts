import type { ToolId } from "../config/tools";

export type Locale = "en" | "es" | "fr" | "nl" | "pt";

export interface ToolMessages {
  name: string;
  shortLabel: string;
  description: string;
}

export interface Messages {
  meta: {
    siteName: string;
    homeTitle: string;
    homeDescription: string;
    pricingTitle: string;
    pricingDescription: string;
    formatsTitle: string;
    formatsDescription: string;
    toolTitleSuffix: string;
  };
  language: {
    label: string;
    en: string;
    es: string;
    fr: string;
    nl: string;
    pt: string;
  };
  nav: {
    allTools: string;
    pdfFrom: string;
    toPdf: string;
    pdfOps: string;
    formats: string;
    pricing: string;
    signIn: string;
    account: string;
    upgradePro: string;
    openMenu: string;
    closeMenu: string;
    main: string;
  };
  hero: {
    titleLead: string;
    titleHighlight: string;
    description: string;
    openWorkspace: string;
    seeFormats: string;
    footnote: string;
    statTools: string;
    statFreeLimit: string;
    statInstall: string;
  };
  toolGrid: {
    heading: string;
    subheading: string;
    categoryHints: {
      "pdf-from": string;
      "to-pdf": string;
      "pdf-ops": string;
    };
    categories: {
      "pdf-from": string;
      "to-pdf": string;
      "pdf-ops": string;
    };
    subcategories: {
      documents: string;
      images: string;
      pages: string;
      markup: string;
      protect: string;
    };
  };
  trust: Array<{ title: string; description: string }>;
  formats: {
    heading: string;
    subheading: string;
    highlights: string[];
    inputs: Array<{ ext: string; use: string }>;
  };
  pricing: {
    heading: string;
    subheading: string;
    bestForTeams: string;
    trustFooter: string;
    faqHeading: string;
    checkoutSuccess: string;
    checkoutCancelled: string;
    freePeriod: string;
    proPeriod: string;
    plans: {
      free: { name: string; description: string; cta: string; features: string[] };
      pro: { name: string; description: string; cta: string; features: string[] };
    };
    faq: Array<{ question: string; answer: string }>;
  };
  footer: {
    tools: string;
    formats: string;
    pricing: string;
    signIn: string;
    account: string;
    privacy: string;
    terms: string;
    faq: string;
    resources: string;
    blog: string;
    compare: string;
    upgradePro: string;
    note: string;
    tagline: string;
  };
  tools: Record<ToolId, ToolMessages>;
  seoLanding: {
    benefitsTitle: string;
    stepsTitle: string;
    faqTitle: string;
    relatedTitle: string;
  };
}
