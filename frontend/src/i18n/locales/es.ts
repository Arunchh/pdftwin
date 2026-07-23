import { formatFileLimit, FREE_DAILY_DOC_CONVERT_LIMIT, FREE_FILE_LIMIT_MB, FREE_MERGE_FILE_LIMIT, PRO_FILE_LIMIT_MB } from "../../config/limits";
import type { Messages } from "../types";

const freeLimit = formatFileLimit(FREE_FILE_LIMIT_MB);
const proLimit = formatFileLimit(PRO_FILE_LIMIT_MB);

export const es: Messages = {
  meta: {
    siteName: "PDFTwin",
    homeTitle: "PDFTwin — Conversión de archivos empresariales | PDF, Word, Excel y WebP",
    homeDescription:
      "PDFTwin es el espacio de trabajo integral para convertir archivos empresariales. Convierte PDFs e imágenes, combina documentos, compara revisiones y protege archivos en el navegador.",
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
  },
  nav: {
    allTools: "Todas las herramientas",
    convert: "Convertir",
    organize: "Organizar",
    protect: "Proteger",
    formats: "Formatos",
    pricing: "Precios",
    signIn: "Iniciar sesión",
    account: "Cuenta",
    upgradePro: "Pasar a Pro",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    main: "Principal",
  },
  hero: {
    titleLead: "Un espacio de trabajo para cada",
    titleHighlight: " formato que usa tu empresa",
    description:
      "Convierte PDF a Word y Excel, exporta imágenes WebP, compara contratos lado a lado, combina informes y protege archivos confidenciales sin cambiar de herramienta.",
    openWorkspace: "Abrir el espacio de trabajo",
    seeFormats: "Ver formatos compatibles",
    footnote: "Pro añade límites más altos y procesamiento prioritario para equipos en crecimiento.",
    statTools: "Herramientas",
    statFreeLimit: "Gratis por archivo",
    statInstall: "Instalación necesaria",
  },
  toolGrid: {
    heading: "Una carga, todos los formatos empresariales",
    subheading:
      "Elige una herramienta y sube una vez. Cambia entre tareas PDF e imagen sin empezar de nuevo.",
    categoryHints: {
      convert: "Convierte PDFs e imágenes a los formatos que entregas a clientes",
      organize: "Combina, divide, compara y extrae páginas de documentos empresariales",
      security: "Protege contratos confidenciales y archivos financieros",
    },
    categories: {
      convert: "Convertir y exportar",
      organize: "Organizar documentos",
      security: "Proteger archivos",
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
    tagline: "El espacio de trabajo integral de conversión de archivos para empresas modernas.",
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
