import { formatFileLimit, FREE_DAILY_DOC_CONVERT_LIMIT, FREE_FILE_LIMIT_MB, PRO_FILE_LIMIT_MB } from "../../config/limits";
import type { Messages } from "../types";

const freeLimit = formatFileLimit(FREE_FILE_LIMIT_MB);
const proLimit = formatFileLimit(PRO_FILE_LIMIT_MB);

export const nl: Messages = {
  meta: {
    siteName: "PDFTwin",
    homeTitle: "PDFTwin — Zakelijke bestandsconversie | PDF, Word, Excel en WebP",
    homeDescription:
      "PDFTwin is de alles-in-één werkruimte voor zakelijke bestandsconversie. Converteer PDF's en afbeeldingen, voeg documenten samen, vergelijk revisies en beveilig bestanden in de browser.",
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
  },
  nav: {
    allTools: "Alle tools",
    convert: "Converteren",
    organize: "Organiseren",
    protect: "Beveiligen",
    formats: "Formaten",
    pricing: "Prijzen",
    signIn: "Inloggen",
    account: "Account",
    upgradePro: "Upgrade naar Pro",
    openMenu: "Menu openen",
    closeMenu: "Menu sluiten",
    main: "Hoofd",
  },
  hero: {
    titleLead: "Eén werkruimte voor elk",
    titleHighlight: " bestandsformaat van uw bedrijf",
    description:
      "Converteer PDF naar Word en Excel, exporteer WebP-afbeeldingen, vergelijk contracten naast elkaar, voeg rapporten samen en beveilig vertrouwelijke bestanden zonder van tool te wisselen.",
    openWorkspace: "Werkruimte openen",
    seeFormats: "Ondersteunde formaten bekijken",
    footnote: "Pro voegt hogere limieten en prioriteitsverwerking toe voor groeiende teams.",
    statTools: "Zakelijke tools",
    statFreeLimit: "Gratis per bestand",
    statInstall: "Installatie vereist",
  },
  toolGrid: {
    heading: "Eén upload, elk zakelijk formaat",
    subheading:
      "Kies een tool en upload één keer. Wissel tussen PDF- en afbeeldingstaken zonder opnieuw te beginnen.",
    categoryHints: {
      convert: "Zet PDF's en afbeeldingen om naar formaten voor uw klanten",
      organize: "Voeg samen, splits, vergelijk en haal pagina's uit documenten",
      security: "Beveilig vertrouwelijke contracten en financiële bestanden",
    },
    categories: {
      convert: "Converteren en exporteren",
      organize: "Documenten organiseren",
      security: "Bestanden beveiligen",
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
          "Alle 12 conversie- en PDF-tools",
          `Tot ${freeLimit} per bestand`,
          `${FREE_DAILY_DOC_CONVERT_LIMIT} PDF → Word- of Excel-export per dag`,
          "Samenvoegen, splitsen en roteren op uw apparaat — geen upload",
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
  footer: {
    tools: "Tools",
    formats: "Formaten",
    pricing: "Prijzen",
    signIn: "Inloggen",
    account: "Account",
    privacy: "Privacy",
    terms: "Voorwaarden",
    faq: "FAQ",
    upgradePro: "Upgrade naar Pro",
    note: "Bestanden worden in het geheugen verwerkt en nooit permanent opgeslagen. Pro-abonnementen worden veilig via PayPal gefactureerd — opzeggen kan altijd.",
    tagline: "De alles-in-één bestandsconversiewerkruimte voor moderne bedrijven.",
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
  },
  seoLanding: {
    benefitsTitle: "Waarom PDFTwin",
    stepsTitle: "Hoe het werkt",
    faqTitle: "Veelgestelde vragen",
    relatedTitle: "Gerelateerde tools",
  },
};
