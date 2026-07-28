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
    toolsIndexTitle: string;
    toolsIndexDescription: string;
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
    browseToolIndex: string;
  };
  hero: {
    titleLead: string;
    titleHighlight: string;
    description: string;
    compareNow: string;
    seeAllTools: string;
    seeCompareGuide: string;
    footnote: string;
    trustChips: string[];
    visualCaption: string;
  };
  home: {
    workflow: {
      heading: string;
      subheading: string;
      steps: Array<{ title: string; description: string; toolId: ToolId }>;
    };
    complementary: {
      heading: string;
      subheading: string;
      toolIds: ToolId[];
    };
    seoTools: {
      heading: string;
      subheading: string;
    };
  };
  toolsIndex: {
    heading: string;
    subheading: string;
    breadcrumb: string;
    compareCta: string;
    homeCta: string;
  };
  compare: {
    setupTitle: string;
    setupDescription: string;
    leftLabel: string;
    rightLabel: string;
    remove: string;
    addFromTray: string;
    enterReview: string;
    changeDocuments: string;
    swapDocuments: string;
    scrollLinked: string;
    scrollIndependent: string;
    zoomLinked: string;
    zoomIndependent: string;
    zoomOut: string;
    zoomIn: string;
    zoomOutRight: string;
    zoomInRight: string;
    fitWidth: string;
    viewContinuous: string;
    viewSinglePage: string;
    pageOf: string;
    prevPage: string;
    nextPage: string;
    fullscreen: string;
    exitFullscreen: string;
    loading: string;
    pages: string;
    privacyHint: string;
    viewerMode: string;
    diffMode: string;
    chooseDiffMode: string;
    modeOff: string;
    modeText: string;
    modeVisual: string;
    modeOverlay: string;
    textDiffLabel: string;
    overlayLabel: string;
    sensitivity: string;
    analyzing: string;
    analyzeFailed: string;
    changesFound: string;
    noChangesFound: string;
    changed: string;
    prevChange: string;
    nextChange: string;
    noTextOnPage: string;
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
    inputScopes: {
      single: { title: string; hint: string };
      multi: { title: string; hint: string };
    };
    inputScopeBadges: {
      single: string;
      multi: string;
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
  waitlist: {
    ariaLabel: string;
    badge: string;
    headline: string;
    subtext: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    submit: string;
    submitting: string;
    success: string;
    alreadyJoined: string;
    error: string;
    dismiss: string;
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
