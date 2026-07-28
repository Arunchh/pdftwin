import { formatFileLimit, FREE_DAILY_DOC_CONVERT_LIMIT, FREE_FILE_LIMIT_MB, FREE_MERGE_FILE_LIMIT, PRO_FILE_LIMIT_MB } from "../../config/limits";
import type { Messages } from "../types";

const freeLimit = formatFileLimit(FREE_FILE_LIMIT_MB);
const proLimit = formatFileLimit(PRO_FILE_LIMIT_MB);

export const nl: Messages = {
  meta: {
    siteName: "PDFTwin",
    homeTitle: "PDFTwin — PDF's naast elkaar vergelijken gratis | PDF-tools",
    homeDescription:
      "Vergelijk twee PDF's online met gekoppeld scrollen en zoom — in uw browser, zonder upload voor weergave. Voeg samen, splits, converteer, onderteken en beveilig documenten in één werkruimte.",
    pricingTitle: "Prijzen | PDFTwin",
    pricingDescription:
      "Start gratis met alle twaalf tools. Upgrade naar PDFTwin Pro voor grotere bestanden en onbeperkte PDF-export.",
    formatsTitle: "Ondersteunde formaten | PDFTwin",
    formatsDescription:
      "Bekijk alle document- en afbeeldingsformaten die PDFTwin converteert voor zakelijke teams.",
    toolTitleSuffix: "PDFTwin",
  },
  language: {
    label: "Taal",
    en: "English",
    es: "Español",
    fr: "Français",
    nl: "Nederlands",
    pt: "Português",
  },
  nav: {
    allTools: "Alle tools",
    pdfFrom: "Van PDF",
    toPdf: "Naar PDF",
    pdfOps: "PDF bewerken",
    formats: "Formaten",
    pricing: "Prijzen",
    signIn: "Inloggen",
    account: "Account",
    upgradePro: "Upgrade naar Pro",
    openMenu: "Menu openen",
    closeMenu: "Menu sluiten",
    main: "Hoofd",
    browseToolIndex: "Volledige toolindex bekijken",
  },
  hero: {
    titleLead: "Vergelijk twee PDF's",
    titleHighlight: " naast elkaar — gratis in uw browser",
    description:
      "Beoordeel contractrevisies en designproeven met gekoppeld scrollen, echte zoom en enkel-pagina-modus. Daarna pagina's extraheren, goedkeuringen samenvoegen, naar Word converteren en ondertekenen — zonder PDFTwin te verlaten.",
    compareNow: "PDF's nu vergelijken",
    seeAllTools: "Alle tools bekijken",
    seeCompareGuide: "PDF-vergelijkingsgids",
    footnote: "Vergelijken draait lokaal met PDF.js — weergave uploadt uw bestanden niet. Pro voegt hogere limieten toe voor conversie.",
    trustChips: [
      "PDF-vergelijking in de browser",
      "Gekoppeld scrollen en zoom",
      "Geen account vereist",
    ],
    visualCaption: "Gekoppeld scrollen · Zoom · Enkel-pagina review",
  },
  home: {
    workflow: {
      heading: "Van concept tot ondertekende PDF",
      subheading:
        "Na het vergelijken ronden deze tools de review af zonder van app te wisselen.",
      steps: [
        {
          title: "Wijzigingen extraheren",
          description: "Haal alleen de pagina's op die u nodig heeft in een nieuwe PDF voor goedkeuring.",
          toolId: "extract-pages",
        },
        {
          title: "Het definitieve pakket samenvoegen",
          description: "Combineer goedgekeurde secties, voorbladen en bijlagen in één klare PDF.",
          toolId: "arrange-merge",
        },
        {
          title: "Ondertekenen en beveiligen",
          description: "Voeg uw handtekening toe en beveilig het document met een wachtwoord voor verzending.",
          toolId: "sign-pdf",
        },
      ],
    },
    complementary: {
      heading: "Meer tools voor documentworkflows",
      subheading: "Conversie, compressie en beveiliging — beschikbaar wanneer u ze nodig heeft.",
      toolIds: ["convert-extract", "split", "compress-pdf", "lock-unlock", "word-to-pdf", "pdf-to-jpg"],
    },
    seoTools: {
      heading: "Alle PDFTwin-tools",
      subheading:
        "Elke zakelijke conversie- en PDF-tool in één werkruimte — samenvoegen, splitsen, OCR, watermerk en meer.",
    },
  },
  compare: {
    setupTitle: "Kies twee PDF's om te vergelijken",
    setupDescription:
      "Upload PDF's naar de werkruimte-bak, wijs links en rechts toe en open de dedicated vergelijkingsviewer.",
    leftLabel: "PDF links",
    rightLabel: "PDF rechts",
    remove: "Verwijderen",
    addFromTray: "Voeg PDF's toe aan de bak hierboven en kies hier een bestand.",
    enterReview: "Vergelijkingsviewer openen",
    changeDocuments: "Documenten wijzigen",
    swapDocuments: "Links en rechts omwisselen",
    scrollLinked: "Scroll gekoppeld",
    scrollIndependent: "Scroll onafhankelijk",
    zoomLinked: "Zoom gekoppeld",
    zoomIndependent: "Zoom onafhankelijk",
    zoomOut: "Uitzoomen",
    zoomIn: "Inzoomen",
    zoomOutRight: "Rechter paneel uitzoomen",
    zoomInRight: "Rechter paneel inzoomen",
    fitWidth: "Passend op breedte",
    viewContinuous: "Doorlopend scrollen",
    viewSinglePage: "Enkele pagina",
    pageOf: "Pagina {current} van {total}",
    prevPage: "Vorige pagina",
    nextPage: "Volgende pagina",
    fullscreen: "Volledig scherm",
    exitFullscreen: "Volledig scherm sluiten",
    loading: "PDF laden…",
    pages: "pagina's",
    privacyHint:
      "Alleen PDF · tot {limit} per bestand · vergelijken lokaal gerenderd — geen upload voor weergave",
    viewerMode: "Viewer",
    diffMode: "Diff",
    chooseDiffMode: "Analysemethode",
    modeOff: "Alleen viewer — handmatige vergelijking naast elkaar",
    modeText: "Tekstwijzigingen — redline per regel",
    modeVisual: "Visuele wijzigingen — verschillende pixels markeren",
    modeOverlay: "Overlay — beide pagina's 50% mengen",
    textDiffLabel: "Tekstdiff",
    overlayLabel: "Gemengde overlay",
    sensitivity: "Gevoeligheid",
    analyzing: "Pagina {current} van {total} analyseren…",
    analyzeFailed: "Kon deze PDF's niet analyseren op verschillen.",
    changesFound: "{count} gewijzigde pagina('s)",
    noChangesFound: "Geen verschillen gevonden",
    changed: "Gewijzigd",
    prevChange: "Vorige wijziging",
    nextChange: "Volgende wijziging",
    noTextOnPage: "Geen selecteerbare tekst op deze pagina.",
  },
  toolGrid: {
    heading: "Eén upload, elk zakelijk formaat",
    subheading:
      "Kies een tool en upload één keer. Wissel tussen PDF- en afbeeldingstaken zonder opnieuw te beginnen.",
    categoryHints: {
      "pdf-from": "Exporteer PDF's naar Word, Excel, afbeeldingen of platte tekst",
      "to-pdf": "Zet Word-documenten, afbeeldingen en foto's om naar PDF-bestanden",
      "pdf-ops": "Begin met één PDF, of kies een multi-bestand tool om samen te voegen of te vergelijken",
    },
    categories: {
      "pdf-from": "PDF naar andere formaten",
      "to-pdf": "Converteren naar PDF",
      "pdf-ops": "Werken met PDF's",
    },
    subcategories: {
      documents: "Documenten",
      images: "Afbeeldingen",
      pages: "Pagina's en lay-out",
      markup: "Markering en ondertekening",
      protect: "Optimaliseren en beveiligen",
    },
    inputScopes: {
      single: {
        title: "Eén PDF",
        hint: "Upload één bestand — splitsen, roteren, ondertekenen, watermerken, comprimeren of beveiligen",
      },
      multi: {
        title: "Meerdere PDF's",
        hint: "Upload twee of meer bestanden — voeg samen of vergelijk naast elkaar",
      },
    },
    inputScopeBadges: {
      single: "1 PDF",
      multi: "2+ PDF",
    },
  },
  trust: [
    {
      title: "Versleutelde uploads",
      description: "Elke overdracht gebruikt HTTPS — contracten en assets reizen veilig.",
    },
    {
      title: "Geen permanente opslag",
      description: "Bestanden worden in het geheugen verwerkt en direct verwijderd.",
    },
    {
      title: "Direct toegang",
      description: "Geen installatie of IT-uitrol. Open een tool en converteer in seconden.",
    },
    {
      title: "Wereldwijde bestandsnamen",
      description: "Hindi, Arabisch, Japans en meer blijven behouden bij download.",
    },
  ],
  formats: {
    heading: "Formaten die uw bedrijf al gebruikt",
    subheading:
      "PDFTwin dekt dagelijkse document- en afbeeldingsworkflows zodat uw team niet tussen tools hoeft te springen.",
    highlights: [
      "PDF → Word, Excel of afbeeldingen",
      "Word (DOCX) → PDF klaar voor klanten",
      "PNG, JPG, GIF, BMP → WebP, PNG of JPEG",
      "PDF comprimeren, watermerk, samenvoegen, splitsen en roteren",
      "PDF's naast elkaar vergelijken met gekoppeld scrollen en zoom",
      "Gevoelige zakelijke bestanden met wachtwoord beveiligen",
    ],
    inputs: [
      { ext: "PDF", use: "Documenten, rapporten, contracten" },
      { ext: "DOCX", use: "Bewerkbare exports vanuit PDF" },
      { ext: "XLSX", use: "Tabellen en gestructureerde data" },
      { ext: "PNG", use: "Verliesvrije graphics en screenshots" },
      { ext: "JPG", use: "Foto's en gecomprimeerde afbeeldingen" },
      { ext: "WebP", use: "Lichte afbeeldingen voor web" },
      { ext: "GIF", use: "Eenvoudige graphics en animaties" },
      { ext: "BMP / TIFF", use: "Legacy- en printworkflows" },
    ],
  },
  pricing: {
    heading: "Prijzen voor zakelijke teams",
    subheading:
      "Start gratis met alle conversietools. Upgrade naar Pro voor grotere bestanden en onbeperkte PDF-export — veilig via PayPal.",
    bestForTeams: "Beste voor teams",
    trustFooter:
      "Betrouwbare checkout. PayPal regelt betalingsbeveiliging, facturering en opzegging van het abonnement.",
    faqHeading: "Veelgestelde vragen over abonnement",
    checkoutSuccess: "Bedankt! Uw PayPal-abonnement wordt geactiveerd.",
    checkoutCancelled: "Checkout geannuleerd. U kunt het opnieuw proberen.",
    freePeriod: "voor altijd",
    proPeriod: "maand",
    plans: {
      free: {
        name: "Gratis",
        description: "Alles wat een klein team nodig heeft om bestanden te converteren, organiseren en beveiligen.",
        cta: "Gratis starten",
        features: [
          "Alle conversie- en PDF-tools",
          `Tot ${freeLimit} per bestand`,
          `Tot ${FREE_MERGE_FILE_LIMIT} PDF's tegelijk samenvoegen`,
          `${FREE_DAILY_DOC_CONVERT_LIMIT} PDF → Word- of Excel-export per dag`,
          "Lokale tools op uw apparaat — geen upload",
          "Geen watermerk, geen account vereist",
        ],
      },
      pro: {
        name: "Pro",
        description: "Voor bedrijven die dagelijks grote documenten en zware conversies verwerken.",
        cta: "Upgraden met PayPal",
        features: [
          "Alles in Gratis",
          `Tot ${proLimit} per bestand`,
          "Onbeperkte samenvoegbatchgrootte",
          "Onbeperkte PDF → Word- en Excel-export",
          "Prioriteitsverwerkingswachtrij",
          "Batchconversies en opgeslagen presets",
        ],
      },
    },
    faq: [
      {
        question: "Welke tools draaien op mijn apparaat en welke op uw servers?",
        answer:
          "Samenvoegen, splitsen, roteren en vergelijken draaien in de browser — bestanden verlaten uw apparaat niet. PDF → Word, PDF → Excel, comprimeren, watermerk, vergrendelen en afbeeldingstools gebruiken de server veilig en worden daarna verwijderd.",
      },
      {
        question: "Wat gebeurt er als ik de dagelijkse Word/Excel-limiet bereik?",
        answer: `Gratis gebruikers kunnen ${FREE_DAILY_DOC_CONVERT_LIMIT} PDF's per dag naar Word of Excel exporteren. Afbeeldingsextractie en andere tools zijn niet beperkt. Upgrade naar Pro voor onbeperkte export.`,
      },
      {
        question: "Wat kost Pro?",
        answer:
          "PDFTwin Pro kost $ 9 USD per maand. PayPal factureert automatisch elke maand tot u opzegt via uw PayPal-account.",
      },
    ],
  },
  waitlist: {
    ariaLabel: "Lancering aankondiging",
    badge: "Binnenkort live",
    headline: "PDFTwin komt er bijna aan — schrijf je als eerste in",
    subtext: "Meld je aan voor de wachtlijst voor vroege toegang en exclusieve lanceringsaanbiedingen.",
    nameLabel: "Je naam",
    namePlaceholder: "Je naam (optioneel)",
    emailLabel: "E-mailadres",
    emailPlaceholder: "jij@bedrijf.com",
    submit: "Aanmelden",
    submitting: "Bezig…",
    success: "Je staat op de lijst! We mailen je zodra we live gaan.",
    alreadyJoined: "Je staat al op de wachtlijst — we nemen binnenkort contact op.",
    error: "Er ging iets mis. Probeer het opnieuw.",
    dismiss: "Aankondiging sluiten",
  },
  footer: {
    tools: "Tools",
    formats: "Formaten",
    pricing: "Prijzen",
    signIn: "Inloggen",
    account: "Account",
    privacy: "Privacy",
    terms: "Voorwaarden",
    faq: "FAQ",
    resources: "Hoe het werkt",
    blog: "Blog",
    compare: "Vergelijken",
    upgradePro: "Upgrade naar Pro",
    note: "Bestanden worden in het geheugen verwerkt en nooit permanent opgeslagen. Pro-abonnementen worden veilig via PayPal gefactureerd — opzeggen kan altijd.",
    tagline: "Vergelijk PDF's naast elkaar en rond documentworkflows af in één browserwerkruimte.",
  },
  tools: {
    "convert-extract": {
      name: "Documentconversie",
      shortLabel: "Converteren",
      description: "Exporteer PDF's naar Word, Excel of webklare afbeeldingen",
    },
    "image-convert": {
      name: "Afbeeldingsconversie",
      shortLabel: "Afbeeldingen",
      description: "Converteer PNG, JPG, GIF en BMP naar WebP, PNG of JPEG in één stap",
    },
    "images-to-pdf": {
      name: "Afbeeldingen naar PDF",
      shortLabel: "Img→PDF",
      description: "Combineer JPG, PNG en andere afbeeldingen in één deelbare PDF",
    },
    "pdf-to-jpg": {
      name: "PDF naar JPG",
      shortLabel: "PDF→JPG",
      description: "Exporteer PDF-pagina's als JPG of PNG voor e-mail en presentaties",
    },
    "pdf-to-text": {
      name: "PDF naar tekst",
      shortLabel: "PDF→Tekst",
      description: "Haal selecteerbare tekst uit PDF's naar een bewerkbaar .txt-bestand",
    },
    "ocr-pdf": {
      name: "OCR — tekstextractie",
      shortLabel: "OCR",
      description: "Zet gescande PDF's en foto's om in bewerkbare tekst met OCR",
    },
    "compress-pdf": {
      name: "PDF comprimeren",
      shortLabel: "Comprimeren",
      description: "Verklein PDF-bestanden voor e-mail en snellere downloads",
    },
    "word-to-pdf": {
      name: "Word naar PDF",
      shortLabel: "Word→PDF",
      description: "Converteer DOCX-voorstellen en contracten naar deelbare PDF's",
    },
    "image-resize": {
      name: "Afbeeldingen verkleinen",
      shortLabel: "Formaat",
      description: "Formateer en comprimeer afbeeldingen voor e-mail, web en slides",
    },
    "pdf-compare": {
      name: "PDF's vergelijken",
      shortLabel: "Vergelijken",
      description: "Bekijk twee PDF's naast elkaar met gekoppeld scrollen en zoom",
    },
    "arrange-merge": {
      name: "Samenvoegen en ordenen",
      shortLabel: "Samenvoegen",
      description: "Combineer voorstellen, facturen en rapporten in één PDF",
    },
    split: {
      name: "PDF splitsen",
      shortLabel: "Splitsen",
      description: "Split grote contracten en decks op paginabereik",
    },
    "extract-pages": {
      name: "Pagina's extraheren",
      shortLabel: "Extraheren",
      description: "Haal alleen de pagina's op die u nodig heeft in een nieuwe PDF",
    },
    "remove-pages": {
      name: "Pagina's verwijderen",
      shortLabel: "Verwijderen",
      description: "Verwijder ongewenste pagina's uit een PDF zonder het hele bestand te splitsen",
    },
    "rotate-pdf": {
      name: "Pagina's roteren",
      shortLabel: "Roteren",
      description: "Roteer alle pagina's of geselecteerde pagina's 90°, 180° of 270°",
    },
    "watermark-pdf": {
      name: "PDF-watermerk",
      shortLabel: "Watermerk",
      description: "Voeg een vertrouwelijk of conceptwatermerk toe op elke pagina",
    },
    "lock-unlock": {
      name: "Vergrendelen en ontgrendelen",
      shortLabel: "Beveiligen",
      description: "Beveilig met wachtwoord of verwijder beperkingen veilig",
    },
    "sign-pdf": {
      name: "PDF ondertekenen",
      shortLabel: "Ondertekenen",
      description: "Voeg uw handtekening of een PNG-afbeelding toe aan PDF-pagina's",
    },
  },
  seoLanding: {
    benefitsTitle: "Waarom PDFTwin",
    stepsTitle: "Hoe het werkt",
    faqTitle: "Veelgestelde vragen",
    relatedTitle: "Gerelateerde tools",
  },
};
