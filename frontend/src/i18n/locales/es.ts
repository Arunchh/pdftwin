import { formatFileLimit, FREE_DAILY_DOC_CONVERT_LIMIT, FREE_FILE_LIMIT_MB, FREE_MERGE_FILE_LIMIT, PRO_FILE_LIMIT_MB } from "../../config/limits";
import type { Messages } from "../types";

const freeLimit = formatFileLimit(FREE_FILE_LIMIT_MB);
const proLimit = formatFileLimit(PRO_FILE_LIMIT_MB);

export const es: Messages = {
  meta: {
    siteName: "PDFTwin",
    homeTitle: "PDFTwin — Comparar PDFs lado a lado gratis | Herramientas PDF",
    homeDescription:
      "Compara dos PDFs en línea con desplazamiento y zoom vinculados — en tu navegador, sin subir archivos para verlos. Combina, divide, convierte, firma y protege documentos en un solo espacio.",
    pricingTitle: "Precios | PDFTwin",
    pricingDescription:
      "Empieza gratis con las doce herramientas. Pasa a PDFTwin Pro para archivos más grandes y exportaciones PDF ilimitadas.",
    formatsTitle: "Formatos compatibles | PDFTwin",
    formatsDescription:
      "Consulta todos los formatos de documentos e imágenes que PDFTwin convierte para equipos empresariales.",
    toolTitleSuffix: "PDFTwin",
  },
  language: {
    label: "Idioma",
    en: "English",
    es: "Español",
    fr: "Français",
    nl: "Nederlands",
    pt: "Português",
  },
  nav: {
    allTools: "Todas las herramientas",
    pdfFrom: "Desde PDF",
    toPdf: "A PDF",
    pdfOps: "Editar PDF",
    formats: "Formatos",
    pricing: "Precios",
    signIn: "Iniciar sesión",
    account: "Cuenta",
    upgradePro: "Pasar a Pro",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    main: "Principal",
    browseToolIndex: "Ver índice completo de herramientas",
  },
  hero: {
    titleLead: "Compara dos PDFs",
    titleHighlight: " lado a lado — gratis en tu navegador",
    description:
      "Revisa revisiones de contratos y pruebas de diseño con desplazamiento vinculado, zoom real y modo página única. Después, extrae páginas, combina aprobaciones, convierte a Word y firma sin salir de PDFTwin.",
    compareNow: "Comparar PDFs ahora",
    seeAllTools: "Ver todas las herramientas",
    seeCompareGuide: "Guía para comparar PDF",
    footnote: "La comparación se ejecuta localmente con PDF.js — ver archivos no los sube. Pro añade límites más altos para conversión.",
    trustChips: [
      "Comparación PDF en el navegador",
      "Desplazamiento y zoom vinculados",
      "Sin cuenta necesaria",
    ],
    visualCaption: "Desplazamiento vinculado · Zoom · Revisión por página",
  },
  home: {
    workflow: {
      heading: "Del borrador al PDF firmado",
      subheading:
        "Después de comparar, estas herramientas completan la revisión sin cambiar de app.",
      steps: [
        {
          title: "Extraer lo que cambió",
          description: "Obtén solo las páginas que necesitas en un PDF nuevo para aprobación.",
          toolId: "extract-pages",
        },
        {
          title: "Combinar el paquete final",
          description: "Une secciones aprobadas, portadas y anexos en un solo archivo listo para el cliente.",
          toolId: "arrange-merge",
        },
        {
          title: "Firmar y proteger",
          description: "Añade tu firma y protege con contraseña el documento terminado antes de enviarlo.",
          toolId: "sign-pdf",
        },
      ],
    },
    complementary: {
      heading: "Más herramientas para flujos documentales",
      subheading: "Conversión, compresión y protección cuando las necesites.",
      toolIds: ["convert-extract", "split", "compress-pdf", "lock-unlock", "word-to-pdf", "pdf-to-jpg"],
    },
    seoTools: {
      heading: "Todas las herramientas PDFTwin",
      subheading:
        "Cada herramienta de conversión y PDF empresarial en un espacio — combinar, dividir, OCR, marca de agua y más.",
    },
  },
  compare: {
    setupTitle: "Elige dos PDFs para comparar",
    setupDescription:
      "Sube PDFs a la bandeja del espacio de trabajo, asigna documentos izquierdo y derecho, y abre el visor dedicado.",
    leftLabel: "PDF izquierdo",
    rightLabel: "PDF derecho",
    remove: "Quitar",
    addFromTray: "Añade PDFs a la bandeja de arriba y elige un archivo aquí.",
    enterReview: "Abrir visor de comparación",
    changeDocuments: "Cambiar documentos",
    swapDocuments: "Intercambiar izquierda y derecha",
    scrollLinked: "Desplazamiento vinculado",
    scrollIndependent: "Desplazamiento independiente",
    zoomLinked: "Zoom vinculado",
    zoomIndependent: "Zoom independiente",
    zoomOut: "Alejar",
    zoomIn: "Acercar",
    zoomOutRight: "Alejar panel derecho",
    zoomInRight: "Acercar panel derecho",
    fitWidth: "Ajustar ancho",
    viewContinuous: "Desplazamiento continuo",
    viewSinglePage: "Página única",
    pageOf: "Página {current} de {total}",
    prevPage: "Página anterior",
    nextPage: "Página siguiente",
    fullscreen: "Pantalla completa",
    exitFullscreen: "Salir de pantalla completa",
    loading: "Cargando PDF…",
    pages: "páginas",
    privacyHint:
      "Solo PDF · hasta {limit} por archivo · la comparación se renderiza localmente — sin subida para ver",
    viewerMode: "Visor",
    diffMode: "Diff",
    chooseDiffMode: "Modo de análisis",
    modeOff: "Solo visor — revisión manual lado a lado",
    modeText: "Cambios de texto — redline línea a línea",
    modeVisual: "Cambios visuales — resaltar píxeles diferentes",
    modeOverlay: "Superposición — mezclar ambas páginas al 50 %",
    textDiffLabel: "Diff texto",
    overlayLabel: "Superposición mezclada",
    sensitivity: "Sensibilidad",
    analyzing: "Analizando página {current} de {total}…",
    analyzeFailed: "No se pudieron analizar las diferencias entre estos PDF.",
    changesFound: "{count} página(s) con cambios",
    noChangesFound: "No se encontraron diferencias",
    changed: "Cambiada",
    prevChange: "Cambio anterior",
    nextChange: "Siguiente cambio",
    noTextOnPage: "No hay texto seleccionable en esta página.",
  },
  toolGrid: {
    heading: "Una carga, todos los formatos empresariales",
    subheading:
      "Elige una herramienta y sube una vez. Cambia entre tareas PDF e imagen sin empezar de nuevo.",
    categoryHints: {
      "pdf-from": "Exporta PDFs a Word, Excel, imágenes o texto plano",
      "to-pdf": "Convierte documentos Word, imágenes y fotos en archivos PDF",
      "pdf-ops": "Empieza con un PDF o elige una herramienta multiarchivo para combinar o comparar documentos",
    },
    categories: {
      "pdf-from": "PDF a otros formatos",
      "to-pdf": "Convertir a PDF",
      "pdf-ops": "Trabajar con PDFs",
    },
    subcategories: {
      documents: "Documentos",
      images: "Imágenes",
      pages: "Páginas y diseño",
      markup: "Marcado y firma",
      protect: "Optimizar y proteger",
    },
    inputScopes: {
      single: {
        title: "Un PDF",
        hint: "Sube un solo archivo: dividir, rotar, firmar, marcar, comprimir o proteger",
      },
      multi: {
        title: "Varios PDF",
        hint: "Sube dos o más archivos: combínalos o compáralos lado a lado",
      },
    },
    inputScopeBadges: {
      single: "1 PDF",
      multi: "2+ PDF",
    },
  },
  trust: [
    {
      title: "Subidas cifradas",
      description: "Cada transferencia usa HTTPS: contratos y activos viajan de forma segura.",
    },
    {
      title: "Cero almacenamiento permanente",
      description: "Los archivos se procesan en memoria y se eliminan de inmediato.",
    },
    {
      title: "Acceso instantáneo",
      description: "Sin instalación ni despliegue de TI. Abre una herramienta y convierte en segundos.",
    },
    {
      title: "Nombres globales",
      description: "Hindi, árabe, japonés y más se conservan al descargar.",
    },
  ],
  formats: {
    heading: "Formatos que tu empresa ya usa",
    subheading:
      "PDFTwin cubre flujos diarios de documentos e imágenes para que tu equipo deje de saltar entre herramientas.",
    highlights: [
      "PDF → Word, Excel o imágenes",
      "Word (DOCX) → PDF listo para clientes",
      "PNG, JPG, GIF, BMP → WebP, PNG o JPEG",
      "Comprimir, marcar, combinar, dividir y rotar PDFs",
      "Comparar PDFs lado a lado con desplazamiento y zoom enlazados",
      "Proteger con contraseña archivos empresariales sensibles",
    ],
    inputs: [
      { ext: "PDF", use: "Documentos, informes, contratos" },
      { ext: "DOCX", use: "Exportaciones editables desde PDF" },
      { ext: "XLSX", use: "Tablas y datos estructurados" },
      { ext: "PNG", use: "Gráficos sin pérdida y capturas" },
      { ext: "JPG", use: "Fotos e imágenes comprimidas" },
      { ext: "WebP", use: "Imágenes ligeras para web" },
      { ext: "GIF", use: "Gráficos simples y animaciones" },
      { ext: "BMP / TIFF", use: "Flujos heredados e impresión" },
    ],
  },
  pricing: {
    heading: "Precios pensados para equipos",
    subheading:
      "Empieza gratis con todas las herramientas. Pasa a Pro cuando necesites archivos más grandes y exportaciones PDF ilimitadas — pago seguro con PayPal.",
    bestForTeams: "Ideal para equipos",
    trustFooter:
      "Pago de confianza. PayPal gestiona la seguridad, la facturación y la cancelación de la suscripción.",
    faqHeading: "Preguntas sobre la suscripción",
    checkoutSuccess: "¡Gracias! Tu suscripción de PayPal se está activando.",
    checkoutCancelled: "Pago cancelado. Puedes intentarlo de nuevo cuando quieras.",
    freePeriod: "para siempre",
    proPeriod: "mes",
    plans: {
      free: {
        name: "Gratis",
        description: "Todo lo que un equipo pequeño necesita para convertir, organizar y proteger archivos.",
        cta: "Empezar gratis",
        features: [
          "Todas las herramientas de conversión y PDF",
          `Hasta ${freeLimit} por archivo`,
          `Combinar hasta ${FREE_MERGE_FILE_LIMIT} PDFs a la vez`,
          `${FREE_DAILY_DOC_CONVERT_LIMIT} exportaciones PDF → Word o Excel al día`,
          "Herramientas locales en tu dispositivo — sin subida",
          "Sin marca de agua ni cuenta obligatoria",
        ],
      },
      pro: {
        name: "Pro",
        description: "Para empresas que procesan documentos grandes y conversiones intensivas cada día.",
        cta: "Mejorar con PayPal",
        features: [
          "Todo lo incluido en Gratis",
          `Hasta ${proLimit} por archivo`,
          "Combinaciones PDF ilimitadas",
          "Exportaciones PDF → Word y Excel ilimitadas",
          "Cola de procesamiento prioritario",
          "Conversiones por lotes y ajustes guardados",
        ],
      },
    },
    faq: [
      {
        question: "¿Qué herramientas se ejecutan en mi dispositivo y cuáles en el servidor?",
        answer:
          "Combinar, dividir, rotar y comparar se ejecutan en el navegador — los archivos no salen de tu dispositivo. PDF → Word, PDF → Excel, comprimir, marca de agua, bloqueo y herramientas de imagen usan el servidor de forma segura y se eliminan al terminar.",
      },
      {
        question: "¿Qué pasa cuando alcanzo el límite diario de Word/Excel?",
        answer: `Los usuarios gratuitos pueden exportar ${FREE_DAILY_DOC_CONVERT_LIMIT} PDFs a Word o Excel al día. La extracción de imágenes y otras herramientas no tienen límite. Pasa a Pro para exportaciones ilimitadas.`,
      },
      {
        question: "¿Cuánto cuesta Pro?",
        answer:
          "PDFTwin Pro cuesta 9 USD al mes. PayPal factura automáticamente cada mes hasta que canceles desde tu cuenta de PayPal.",
      },
    ],
  },
  waitlist: {
    ariaLabel: "Anuncio de lanzamiento",
    badge: "Próximo lanzamiento",
    headline: "PDFTwin llega pronto — sé de los primeros",
    subtext: "Únete a la lista de espera para acceso anticipado y ofertas exclusivas de lanzamiento.",
    nameLabel: "Tu nombre",
    namePlaceholder: "Tu nombre (opcional)",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "tu@empresa.com",
    submit: "Unirme a la lista",
    submitting: "Uniéndote…",
    success: "¡Estás en la lista! Te avisaremos cuando lancemos.",
    alreadyJoined: "Ya estás en la lista de espera — pronto nos pondremos en contacto.",
    error: "Algo salió mal. Inténtalo de nuevo.",
    dismiss: "Cerrar anuncio",
  },
  footer: {
    tools: "Herramientas",
    formats: "Formatos",
    pricing: "Precios",
    signIn: "Iniciar sesión",
    account: "Cuenta",
    privacy: "Privacidad",
    terms: "Términos",
    faq: "FAQ",
    resources: "Cómo funciona",
    blog: "Blog",
    compare: "Comparar",
    upgradePro: "Pasar a Pro",
    note: "Los archivos se procesan en memoria y nunca se almacenan de forma permanente. Las suscripciones Pro se facturan de forma segura con PayPal — cancela cuando quieras.",
    tagline: "Compara PDFs lado a lado y completa flujos documentales en un solo espacio del navegador.",
  },
  tools: {
    "convert-extract": {
      name: "Conversión de documentos",
      shortLabel: "Convertir",
      description: "Exporta PDFs a Word, Excel o imágenes listas para web",
    },
    "image-convert": {
      name: "Conversión de imágenes",
      shortLabel: "Imágenes",
      description: "Convierte PNG, JPG, GIF y BMP a WebP, PNG o JPEG en un paso",
    },
    "images-to-pdf": {
      name: "Imágenes a PDF",
      shortLabel: "Img→PDF",
      description: "Combina JPG, PNG y otras imágenes en un PDF listo para compartir",
    },
    "pdf-to-jpg": {
      name: "PDF a JPG",
      shortLabel: "PDF→JPG",
      description: "Exporta páginas PDF como JPG o PNG para correo y presentaciones",
    },
    "pdf-to-text": {
      name: "PDF a texto",
      shortLabel: "PDF→Texto",
      description: "Extrae texto seleccionable de PDFs a un archivo .txt editable",
    },
    "ocr-pdf": {
      name: "OCR — extraer texto",
      shortLabel: "OCR",
      description: "Convierte PDFs escaneados y fotos en texto editable con OCR",
    },
    "compress-pdf": {
      name: "Comprimir PDF",
      shortLabel: "Comprimir",
      description: "Reduce el tamaño del PDF para correo y descargas más rápidas",
    },
    "word-to-pdf": {
      name: "Word a PDF",
      shortLabel: "Word→PDF",
      description: "Convierte propuestas y contratos DOCX en PDFs listos para compartir",
    },
    "image-resize": {
      name: "Redimensionar imágenes",
      shortLabel: "Redimensionar",
      description: "Redimensiona y comprime imágenes para correo, web y presentaciones",
    },
    "pdf-compare": {
      name: "Comparar PDFs",
      shortLabel: "Comparar",
      description: "Visualiza dos PDFs lado a lado con desplazamiento y zoom enlazados",
    },
    "arrange-merge": {
      name: "Combinar y ordenar",
      shortLabel: "Combinar",
      description: "Une propuestas, facturas e informes en un solo PDF",
    },
    split: {
      name: "Dividir PDF",
      shortLabel: "Dividir",
      description: "Separa contratos y presentaciones por rangos de páginas",
    },
    "extract-pages": {
      name: "Extraer páginas",
      shortLabel: "Extraer",
      description: "Obtén solo las páginas que necesitas en un PDF nuevo",
    },
    "remove-pages": {
      name: "Eliminar páginas",
      shortLabel: "Eliminar",
      description: "Elimina páginas no deseadas de un PDF sin dividir todo el archivo",
    },
    "rotate-pdf": {
      name: "Rotar páginas",
      shortLabel: "Rotar",
      description: "Rota todas las páginas o páginas seleccionadas 90°, 180° o 270°",
    },
    "watermark-pdf": {
      name: "Marca de agua PDF",
      shortLabel: "Marca",
      description: "Añade una marca confidencial o borrador en cada página",
    },
    "lock-unlock": {
      name: "Bloquear y desbloquear",
      shortLabel: "Proteger",
      description: "Protege con contraseña o elimina restricciones de forma segura",
    },
    "sign-pdf": {
      name: "Firmar PDF",
      shortLabel: "Firmar",
      description: "Añade tu firma manuscrita o una imagen PNG a las páginas del PDF",
    },
  },
  seoLanding: {
    benefitsTitle: "Por qué usar PDFTwin",
    stepsTitle: "Cómo funciona",
    faqTitle: "Preguntas frecuentes",
    relatedTitle: "Herramientas relacionadas",
  },
};
