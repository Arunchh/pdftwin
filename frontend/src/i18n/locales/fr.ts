import { formatFileLimit, FREE_DAILY_DOC_CONVERT_LIMIT, FREE_FILE_LIMIT_MB, FREE_MERGE_FILE_LIMIT, PRO_FILE_LIMIT_MB } from "../../config/limits";
import type { Messages } from "../types";

const freeLimit = formatFileLimit(FREE_FILE_LIMIT_MB);
const proLimit = formatFileLimit(PRO_FILE_LIMIT_MB);

export const fr: Messages = {
  meta: {
    siteName: "PDFTwin",
    homeTitle: "PDFTwin — Conversion de fichiers pro | PDF, Word, Excel et WebP",
    homeDescription:
      "PDFTwin est l'espace de conversion tout-en-un pour les entreprises. Convertissez PDF et images, fusionnez des documents, comparez des révisions et protégez vos fichiers dans le navigateur.",
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
  },
  nav: {
    allTools: "Tous les outils",
    convert: "Convertir",
    organize: "Organiser",
    protect: "Protéger",
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
    titleLead: "Un espace de travail pour chaque",
    titleHighlight: " format utilisé par votre entreprise",
    description:
      "Convertissez PDF en Word et Excel, exportez des images WebP, comparez des contrats côte à côte, fusionnez des rapports et protégez des fichiers confidentiels sans changer d'outil.",
    openWorkspace: "Ouvrir l'espace de travail",
    seeFormats: "Voir les formats pris en charge",
    footnote: "Pro ajoute des limites plus élevées et un traitement prioritaire pour les équipes en croissance.",
    statTools: "Outils métier",
    statFreeLimit: "Gratuit par fichier",
    statInstall: "Installation requise",
  },
  toolGrid: {
    heading: "Un envoi, tous les formats professionnels",
    subheading:
      "Choisissez un outil et téléversez une fois. Passez du PDF à l'image sans recommencer.",
    categoryHints: {
      convert: "Transformez PDF et images aux formats livrés à vos clients",
      organize: "Fusionnez, scindez, comparez et extrayez des pages de documents",
      security: "Protégez contrats confidentiels et fichiers financiers",
    },
    categories: {
      convert: "Convertir et exporter",
      organize: "Organiser les documents",
      security: "Protéger les fichiers",
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
    upgradePro: "Passer à Pro",
    note: "Les fichiers sont traités en mémoire et jamais stockés de façon permanente. Les abonnements Pro sont facturés via PayPal — annulez quand vous voulez.",
    tagline: "L'espace de conversion tout-en-un pour les entreprises modernes.",
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
