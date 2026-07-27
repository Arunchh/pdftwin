import { formatFileLimit, FREE_DAILY_DOC_CONVERT_LIMIT, FREE_FILE_LIMIT_MB, FREE_MERGE_FILE_LIMIT, PRO_FILE_LIMIT_MB } from "../../config/limits";
import type { Messages } from "../types";

const freeLimit = formatFileLimit(FREE_FILE_LIMIT_MB);
const proLimit = formatFileLimit(PRO_FILE_LIMIT_MB);

export const fr: Messages = {
  meta: {
    siteName: "PDFTwin",
    homeTitle: "PDFTwin — Comparer des PDF côte à côte gratuitement | Outils PDF",
    homeDescription:
      "Comparez deux PDF en ligne avec défilement et zoom liés — dans votre navigateur, sans envoi pour la visualisation. Fusionnez, divisez, convertissez, signez et protégez vos documents dans un seul espace.",
    pricingTitle: "Tarifs | PDFTwin",
    pricingDescription:
      "Commencez gratuitement avec les douze outils. Passez à PDFTwin Pro pour des fichiers plus volumineux et des exportations PDF illimitées.",
    formatsTitle: "Formats pris en charge | PDFTwin",
    formatsDescription:
      "Découvrez tous les formats document et image que PDFTwin convertit pour les équipes professionnelles.",
    toolTitleSuffix: "PDFTwin",
  },
  language: {
    label: "Langue",
    en: "English",
    es: "Español",
    fr: "Français",
    nl: "Nederlands",
    pt: "Português",
  },
  nav: {
    allTools: "Tous les outils",
    pdfFrom: "Depuis PDF",
    toPdf: "Vers PDF",
    pdfOps: "Modifier PDF",
    formats: "Formats",
    pricing: "Tarifs",
    signIn: "Se connecter",
    account: "Compte",
    upgradePro: "Passer à Pro",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    main: "Principal",
  },
  hero: {
    titleLead: "Comparez deux PDF",
    titleHighlight: " côte à côte — gratuit dans votre navigateur",
    description:
      "Relisez les révisions de contrats et les épreuves de design avec défilement lié, zoom réel et mode page unique. Ensuite, extrayez des pages, fusionnez les approbations, convertissez en Word et signez — sans quitter PDFTwin.",
    compareNow: "Comparer des PDF maintenant",
    seeAllTools: "Parcourir tous les outils",
    seeCompareGuide: "Guide comparer PDF",
    footnote: "La comparaison s'exécute localement avec PDF.js — la visualisation n'envoie pas vos fichiers. Pro ajoute des limites plus élevées pour la conversion.",
    trustChips: [
      "Comparaison PDF côté client",
      "Défilement et zoom liés",
      "Sans compte requis",
    ],
    visualCaption: "Défilement lié · Zoom · Relecture page par page",
  },
  home: {
    workflow: {
      heading: "Du brouillon au PDF signé",
      subheading:
        "Comparer est le point de départ. Ces outils terminent la relecture sans changer d'application.",
      steps: [
        {
          title: "Comparer les révisions",
          description: "Ouvrez deux PDF côte à côte avec défilement, zoom et relecture page par page.",
          toolId: "pdf-compare",
        },
        {
          title: "Extraire les changements",
          description: "Récupérez uniquement les pages nécessaires dans un nouveau PDF pour approbation.",
          toolId: "extract-pages",
        },
        {
          title: "Fusionner le dossier final",
          description: "Combinez sections approuvées, pages de garde et annexes en un fichier prêt client.",
          toolId: "arrange-merge",
        },
        {
          title: "Signer et protéger",
          description: "Ajoutez votre signature et protégez par mot de passe le document final avant envoi.",
          toolId: "sign-pdf",
        },
      ],
    },
    complementary: {
      heading: "Plus d'outils pour les flux documentaires",
      subheading: "Conversion, compression et protection — disponibles quand vous en avez besoin.",
      toolIds: ["convert-extract", "split", "compress-pdf", "lock-unlock", "word-to-pdf", "pdf-to-jpg"],
    },
    seoTools: {
      heading: "Tous les outils PDFTwin",
      subheading:
        "Chaque outil de conversion et PDF professionnel dans un espace — fusion, division, OCR, filigrane et plus.",
    },
  },
  compare: {
    setupTitle: "Choisissez deux PDF à comparer",
    setupDescription:
      "Téléversez des PDF dans le bac de l'espace de travail, assignez gauche et droite, puis ouvrez le visualiseur dédié.",
    leftLabel: "PDF gauche",
    rightLabel: "PDF droit",
    remove: "Retirer",
    addFromTray: "Ajoutez des PDF au bac ci-dessus, puis choisissez un fichier ici.",
    enterReview: "Ouvrir le visualiseur",
    changeDocuments: "Changer de documents",
    swapDocuments: "Inverser gauche et droite",
    scrollLinked: "Défilement lié",
    scrollIndependent: "Défilement indépendant",
    zoomLinked: "Zoom lié",
    zoomIndependent: "Zoom indépendant",
    zoomOut: "Zoom arrière",
    zoomIn: "Zoom avant",
    zoomOutRight: "Zoom arrière panneau droit",
    zoomInRight: "Zoom avant panneau droit",
    fitWidth: "Ajuster à la largeur",
    viewContinuous: "Défilement continu",
    viewSinglePage: "Page unique",
    pageOf: "Page {current} sur {total}",
    prevPage: "Page précédente",
    nextPage: "Page suivante",
    fullscreen: "Plein écran",
    exitFullscreen: "Quitter le plein écran",
    loading: "Chargement du PDF…",
    pages: "pages",
    privacyHint:
      "PDF uniquement · jusqu'à {limit} par fichier · comparaison locale — pas d'envoi pour la visualisation",
    viewerMode: "Visionneuse",
    diffMode: "Diff",
    chooseDiffMode: "Mode d'analyse",
    modeOff: "Visionneuse seule — comparaison manuelle côte à côte",
    modeText: "Modifications texte — redline ligne par ligne",
    modeVisual: "Modifications visuelles — surligner les pixels différents",
    modeOverlay: "Superposition — fusionner les deux pages à 50 %",
    textDiffLabel: "Diff texte",
    overlayLabel: "Superposition fusionnée",
    sensitivity: "Sensibilité",
    analyzing: "Analyse de la page {current} sur {total}…",
    analyzeFailed: "Impossible d'analyser les différences entre ces PDF.",
    changesFound: "{count} page(s) modifiée(s)",
    noChangesFound: "Aucune différence trouvée",
    changed: "Modifiée",
    prevChange: "Modification précédente",
    nextChange: "Modification suivante",
    noTextOnPage: "Aucun texte sélectionnable sur cette page.",
  },
  toolGrid: {
    heading: "Un envoi, tous les formats professionnels",
    subheading:
      "Choisissez un outil et téléversez une fois. Passez du PDF à l'image sans recommencer.",
    categoryHints: {
      "pdf-from": "Exportez des PDF vers Word, Excel, images ou texte brut",
      "to-pdf": "Transformez documents Word, images et photos en fichiers PDF",
      "pdf-ops": "Commencez avec un PDF, ou choisissez un outil multi-fichiers pour fusionner ou comparer",
    },
    categories: {
      "pdf-from": "PDF vers autres formats",
      "to-pdf": "Convertir en PDF",
      "pdf-ops": "Travailler avec des PDF",
    },
    subcategories: {
      documents: "Documents",
      images: "Images",
      pages: "Pages et mise en page",
      markup: "Annotation et signature",
      protect: "Optimiser et protéger",
    },
    inputScopes: {
      single: {
        title: "Un PDF",
        hint: "Téléversez un seul fichier — scinder, pivoter, signer, filigraner, compresser ou protéger",
      },
      multi: {
        title: "Plusieurs PDF",
        hint: "Téléversez deux fichiers ou plus — fusionnez ou comparez côte à côte",
      },
    },
    inputScopeBadges: {
      single: "1 PDF",
      multi: "2+ PDF",
    },
  },
  trust: [
    {
      title: "Téléversements chiffrés",
      description: "Chaque transfert utilise HTTPS — contrats et actifs voyagent en sécurité.",
    },
    {
      title: "Zéro stockage permanent",
      description: "Les fichiers sont traités en mémoire puis supprimés immédiatement.",
    },
    {
      title: "Accès instantané",
      description: "Sans installation ni déploiement IT. Ouvrez un outil et convertissez en secondes.",
    },
    {
      title: "Noms de fichiers mondiaux",
      description: "Hindi, arabe, japonais et plus restent intacts au téléchargement.",
    },
  ],
  formats: {
    heading: "Les formats que votre entreprise utilise déjà",
    subheading:
      "PDFTwin couvre les flux document et image quotidiens pour éviter les outils à usage unique.",
    highlights: [
      "PDF → Word, Excel ou images",
      "Word (DOCX) → PDF prêt pour le client",
      "PNG, JPG, GIF, BMP → WebP, PNG ou JPEG",
      "Compresser, filigrane, fusionner, scinder et pivoter des PDF",
      "Comparer des PDF côte à côte avec défilement et zoom liés",
      "Protéger par mot de passe les fichiers sensibles",
    ],
    inputs: [
      { ext: "PDF", use: "Documents, rapports, contrats" },
      { ext: "DOCX", use: "Exports modifiables depuis PDF" },
      { ext: "XLSX", use: "Tableaux et données structurées" },
      { ext: "PNG", use: "Graphiques sans perte et captures" },
      { ext: "JPG", use: "Photos et images compressées" },
      { ext: "WebP", use: "Images légères pour le web" },
      { ext: "GIF", use: "Graphiques simples et animations" },
      { ext: "BMP / TIFF", use: "Flux hérités et impression" },
    ],
  },
  pricing: {
    heading: "Des tarifs pensés pour les équipes",
    subheading:
      "Commencez gratuitement avec tous les outils. Passez à Pro pour des fichiers plus grands et des exportations PDF illimitées — paiement sécurisé via PayPal.",
    bestForTeams: "Idéal pour les équipes",
    trustFooter:
      "Paiement de confiance. PayPal gère la sécurité, la facturation et l'annulation de l'abonnement.",
    faqHeading: "FAQ abonnement",
    checkoutSuccess: "Merci ! Votre abonnement PayPal est en cours d'activation.",
    checkoutCancelled: "Paiement annulé. Vous pouvez réessayer à tout moment.",
    freePeriod: "à vie",
    proPeriod: "mois",
    plans: {
      free: {
        name: "Gratuit",
        description: "Tout ce dont une petite équipe a besoin pour convertir, organiser et protéger ses fichiers.",
        cta: "Commencer gratuitement",
        features: [
          "Tous les outils de conversion et PDF",
          `Jusqu'à ${freeLimit} par fichier`,
          `Fusionner jusqu'à ${FREE_MERGE_FILE_LIMIT} PDF à la fois`,
          `${FREE_DAILY_DOC_CONVERT_LIMIT} exportations PDF → Word ou Excel par jour`,
          "Outils locaux sur votre appareil — sans envoi",
          "Sans filigrane ni compte obligatoire",
        ],
      },
      pro: {
        name: "Pro",
        description: "Pour les entreprises qui traitent de gros documents et des conversions intensives.",
        cta: "Passer à Pro via PayPal",
        features: [
          "Tout ce qui est inclus dans Gratuit",
          `Jusqu'à ${proLimit} par fichier`,
          "Fusions PDF illimitées",
          "Exportations PDF → Word et Excel illimitées",
          "File de traitement prioritaire",
          "Conversions par lot et préréglages enregistrés",
        ],
      },
    },
    faq: [
      {
        question: "Quels outils s'exécutent sur mon appareil et lesquels sur vos serveurs ?",
        answer:
          "Fusionner, scinder, pivoter et comparer s'exécutent dans le navigateur — les fichiers ne quittent jamais votre appareil. PDF → Word, PDF → Excel, compression, filigrane, verrouillage et outils image utilisent le serveur de façon sécurisée puis sont supprimés.",
      },
      {
        question: "Que se passe-t-il quand j'atteins la limite quotidienne Word/Excel ?",
        answer: `Les utilisateurs gratuits peuvent exporter ${FREE_DAILY_DOC_CONVERT_LIMIT} PDF en Word ou Excel par jour. L'extraction d'images et les autres outils ne sont pas limités. Passez à Pro pour des exportations illimitées.`,
      },
      {
        question: "Combien coûte Pro ?",
        answer:
          "PDFTwin Pro coûte 9 USD par mois. PayPal facture automatiquement chaque mois jusqu'à annulation depuis votre compte PayPal.",
      },
    ],
  },
  footer: {
    tools: "Outils",
    formats: "Formats",
    pricing: "Tarifs",
    signIn: "Se connecter",
    account: "Compte",
    privacy: "Confidentialité",
    terms: "Conditions",
    faq: "FAQ",
    resources: "Comment ça marche",
    blog: "Blog",
    compare: "Comparer",
    upgradePro: "Passer à Pro",
    note: "Les fichiers sont traités en mémoire et jamais stockés de façon permanente. Les abonnements Pro sont facturés via PayPal — annulez quand vous voulez.",
    tagline: "Comparez des PDF côte à côte et terminez vos flux documentaires dans un seul espace navigateur.",
  },
  tools: {
    "convert-extract": {
      name: "Conversion de documents",
      shortLabel: "Convertir",
      description: "Exportez des PDF vers Word, Excel ou images prêtes pour le web",
    },
    "image-convert": {
      name: "Conversion d'images",
      shortLabel: "Images",
      description: "Convertissez PNG, JPG, GIF et BMP en WebP, PNG ou JPEG en une étape",
    },
    "images-to-pdf": {
      name: "Images en PDF",
      shortLabel: "Img→PDF",
      description: "Combinez JPG, PNG et autres images en un PDF prêt à partager",
    },
    "pdf-to-jpg": {
      name: "PDF en JPG",
      shortLabel: "PDF→JPG",
      description: "Exportez des pages PDF en JPG ou PNG pour e-mail et présentations",
    },
    "pdf-to-text": {
      name: "PDF en texte",
      shortLabel: "PDF→Texte",
      description: "Extrayez le texte sélectionnable des PDF dans un fichier .txt",
    },
    "ocr-pdf": {
      name: "OCR — extraire le texte",
      shortLabel: "OCR",
      description: "Transformez PDF scannés et photos en texte éditable avec l'OCR",
    },
    "compress-pdf": {
      name: "Compresser PDF",
      shortLabel: "Compresser",
      description: "Réduisez la taille du PDF pour e-mail et téléchargements plus rapides",
    },
    "word-to-pdf": {
      name: "Word en PDF",
      shortLabel: "Word→PDF",
      description: "Convertissez propositions et contrats DOCX en PDF partageables",
    },
    "image-resize": {
      name: "Redimensionner images",
      shortLabel: "Redimensionner",
      description: "Redimensionnez et compressez des images pour e-mail, web et slides",
    },
    "pdf-compare": {
      name: "Comparer PDF",
      shortLabel: "Comparer",
      description: "Affichez deux PDF côte à côte avec défilement et zoom liés",
    },
    "arrange-merge": {
      name: "Fusionner et ordonner",
      shortLabel: "Fusionner",
      description: "Combinez propositions, factures et rapports en un seul PDF",
    },
    split: {
      name: "Scinder PDF",
      shortLabel: "Scinder",
      description: "Séparez contrats et présentations par plages de pages",
    },
    "extract-pages": {
      name: "Extraire des pages",
      shortLabel: "Extraire",
      description: "Obtenez uniquement les pages nécessaires dans un nouveau PDF",
    },
    "remove-pages": {
      name: "Supprimer des pages",
      shortLabel: "Supprimer",
      description: "Supprimez des pages indésirables d'un PDF sans scinder tout le fichier",
    },
    "rotate-pdf": {
      name: "Pivoter des pages",
      shortLabel: "Pivoter",
      description: "Pivotez toutes les pages ou une sélection de 90°, 180° ou 270°",
    },
    "watermark-pdf": {
      name: "Filigrane PDF",
      shortLabel: "Filigrane",
      description: "Ajoutez un filigrane confidentiel ou brouillon sur chaque page",
    },
    "lock-unlock": {
      name: "Verrouiller et déverrouiller",
      shortLabel: "Protéger",
      description: "Protégez par mot de passe ou supprimez les restrictions en sécurité",
    },
    "sign-pdf": {
      name: "Signer un PDF",
      shortLabel: "Signer",
      description: "Ajoutez votre signature manuscrite ou une image PNG aux pages du PDF",
    },
  },
  seoLanding: {
    benefitsTitle: "Pourquoi PDFTwin",
    stepsTitle: "Comment ça marche",
    faqTitle: "Questions fréquentes",
    relatedTitle: "Outils associés",
  },
};
