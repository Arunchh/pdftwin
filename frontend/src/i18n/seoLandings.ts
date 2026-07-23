import type { ToolId } from "../config/tools";
import type { Locale } from "./types";
import { localizePath, stripLocalePrefix, isLocalizablePath } from "./utils";

export interface SeoLanding {
  slug: string;
  locale: Locale;
  toolId: ToolId;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  benefits: string[];
  steps: Array<{ title: string; body: string }>;
  faq: Array<{ question: string; answer: string }>;
  ctaLabel: string;
  relatedSlugs?: string[];
}

const EN_LANDINGS: SeoLanding[] = [
  {
    slug: "merge-pdf-free",
    locale: "en",
    toolId: "arrange-merge",
    title: "Merge PDF Free Online — No Watermark | PDFTwin",
    metaDescription:
      "Combine multiple PDFs into one file free in your browser. No watermark, no signup, up to 50 MB per file. Merge runs on your device for privacy.",
    h1: "Merge PDF files free — no watermark",
    intro:
      "Combine contracts, invoices, and reports into a single PDF without uploading to a server. PDFTwin merges files in your browser — fast, private, and free.",
    benefits: [
      "No watermark on merged output",
      "Processed on your device — files stay private",
      "Reorder documents and pages before merging",
      "No account or daily task limits",
    ],
    steps: [
      { title: "Upload PDFs", body: "Add two or more PDF files from your computer." },
      { title: "Set order", body: "Drag documents into merge order and confirm." },
      { title: "Download", body: "Click Merge and save your combined PDF instantly." },
    ],
    faq: [
      {
        question: "Is merging PDFs really free?",
        answer: "Yes. Merge, split, and rotate are free with no watermark and no daily limits.",
      },
      {
        question: "Are my files uploaded to a server?",
        answer: "No. Merge runs entirely in your browser using pdf-lib.",
      },
    ],
    ctaLabel: "Merge PDFs now",
    relatedSlugs: ["split-pdf-online", "compress-pdf-free"],
  },
  {
    slug: "split-pdf-online",
    locale: "en",
    toolId: "split",
    title: "Split PDF Online Free — By Page Range | PDFTwin",
    metaDescription:
      "Split a PDF into separate files by page range. Free, no watermark, runs in your browser. Multiple ranges download as a ZIP.",
    h1: "Split PDF online free",
    intro:
      "Break a large PDF into smaller files by page range. Enter ranges like 1-3, 5-7 and download separate PDFs — processed locally in your browser.",
    benefits: [
      "Split by comma-separated page ranges",
      "Multiple ranges export as ZIP",
      "No upload to our servers",
      "Free with no watermark",
    ],
    steps: [
      { title: "Upload PDF", body: "Select the PDF you want to split." },
      { title: "Enter ranges", body: "Use format like 1-3, 5-7, 10 for each new file." },
      { title: "Download", body: "Get one PDF or a ZIP with all parts." },
    ],
    faq: [
      {
        question: "Can I split into more than two files?",
        answer: "Yes. Each comma-separated range becomes its own PDF in a ZIP download.",
      },
    ],
    ctaLabel: "Split PDF now",
    relatedSlugs: ["merge-pdf-free", "compress-pdf-free"],
  },
  {
    slug: "compress-pdf-free",
    locale: "en",
    toolId: "compress-pdf",
    title: "Compress PDF Free — Reduce File Size | PDFTwin",
    metaDescription:
      "Compress PDF files for email and faster downloads. Free tier up to 50 MB. Secure server processing, files discarded immediately.",
    h1: "Compress PDF free online",
    intro:
      "Shrink PDF file size for email attachments and client delivery. Choose a quality preset and download a smaller PDF in seconds.",
    benefits: [
      "Medium and high compression presets",
      "Up to 50 MB free per file",
      "Processed securely, never stored",
      "No watermark",
    ],
    steps: [
      { title: "Upload PDF", body: "Select the PDF to compress." },
      { title: "Choose quality", body: "Pick medium or high compression." },
      { title: "Download", body: "Save the smaller PDF to your device." },
    ],
    faq: [
      {
        question: "Will compression add a watermark?",
        answer: "Never. PDFTwin does not watermark free output.",
      },
    ],
    ctaLabel: "Compress PDF now",
    relatedSlugs: ["merge-pdf-free", "pdf-to-word-free"],
  },
  {
    slug: "pdf-to-word-free",
    locale: "en",
    toolId: "convert-extract",
    title: "PDF to Word Free — Convert to DOCX | PDFTwin",
    metaDescription:
      "Convert PDF to editable Word (.docx) online. Free plan includes 3 exports per day. Layout-preserving conversion for business documents.",
    h1: "PDF to Word free online",
    intro:
      "Turn business PDFs into editable Word documents. PDFTwin preserves layout and tables where possible — ideal for contracts and reports.",
    benefits: [
      "Exports to .docx format",
      "3 free conversions per day",
      "Pro plan: unlimited exports",
      "Multilingual filenames supported",
    ],
    steps: [
      { title: "Upload PDF", body: "Select the PDF to convert." },
      { title: "Choose Word", body: "Pick Word Document as output format." },
      { title: "Download DOCX", body: "Edit the file in Microsoft Word or Google Docs." },
    ],
    faq: [
      {
        question: "How many free PDF to Word conversions per day?",
        answer: "Free users get 3 PDF to Word or Excel exports per day. Pro is unlimited.",
      },
    ],
    ctaLabel: "Convert to Word now",
    relatedSlugs: ["compress-pdf-free", "word-to-pdf-free"],
  },
  {
    slug: "compare-pdf-online",
    locale: "en",
    toolId: "pdf-compare",
    title: "Compare Two PDFs Online Free — Side by Side | PDFTwin",
    metaDescription:
      "Compare two PDF documents side by side with linked scroll and zoom. Free, runs in your browser — files never leave your device.",
    h1: "Compare PDFs side by side free",
    intro:
      "Review contract revisions and design proofs with two PDFs rendered next to each other. Linked scroll keeps both panes aligned.",
    benefits: [
      "Side-by-side viewer in browser",
      "Linked scroll and zoom",
      "No server upload for viewing",
      "Free for contract review workflows",
    ],
    steps: [
      { title: "Upload two PDFs", body: "Add left and right documents." },
      { title: "Enable linked scroll", body: "Toggle sync to align both panes." },
      { title: "Review", body: "Zoom in on details with linked magnification." },
    ],
    faq: [
      {
        question: "Do compare files upload to your server?",
        answer: "No. PDF compare renders locally with PDF.js in your browser.",
      },
    ],
    ctaLabel: "Compare PDFs now",
    relatedSlugs: ["merge-pdf-free", "split-pdf-online"],
  },
  {
    slug: "word-to-pdf-free",
    locale: "en",
    toolId: "word-to-pdf",
    title: "Word to PDF Free — Convert DOCX Online | PDFTwin",
    metaDescription:
      "Convert Word documents to share-ready PDF files online. Free, secure processing, up to 50 MB per file.",
    h1: "Word to PDF free online",
    intro:
      "Turn DOCX proposals and contracts into PDFs clients can open anywhere. Upload your Word file and download a PDF in seconds.",
    benefits: [
      "DOCX to PDF conversion",
      "Free up to 50 MB per file",
      "Secure in-memory processing",
      "No watermark",
    ],
    steps: [
      { title: "Upload DOCX", body: "Select your Word document." },
      { title: "Convert", body: "PDFTwin processes the layout server-side." },
      { title: "Download PDF", body: "Share the PDF by email or cloud link." },
    ],
    faq: [],
    ctaLabel: "Convert Word to PDF",
    relatedSlugs: ["pdf-to-word-free", "merge-pdf-free"],
  },
  {
    slug: "rotate-pdf-online",
    locale: "en",
    toolId: "rotate-pdf",
    title: "Rotate PDF Pages Free Online — 90°, 180°, 270° | PDFTwin",
    metaDescription:
      "Rotate PDF pages online free in your browser. Turn all pages or selected pages 90°, 180°, or 270°. No watermark, no upload to servers.",
    h1: "Rotate PDF pages free online",
    intro:
      "Fix sideways scans and landscape slides by rotating PDF pages in seconds. PDFTwin rotates in your browser — files stay on your device.",
    benefits: [
      "Rotate all pages or a custom page list",
      "90°, 180°, or 270° in one click",
      "Processed locally — no server upload",
      "Free with no watermark",
    ],
    steps: [
      { title: "Upload PDF", body: "Select the PDF with pages to rotate." },
      { title: "Choose angle", body: "Pick 90°, 180°, or 270° and which pages to rotate." },
      { title: "Download", body: "Save the corrected PDF instantly." },
    ],
    faq: [
      {
        question: "Can I rotate only some pages?",
        answer: "Yes. Enter specific page numbers or rotate every page in the document.",
      },
    ],
    ctaLabel: "Rotate PDF now",
    relatedSlugs: ["split-pdf-online", "merge-pdf-free"],
  },
  {
    slug: "extract-pdf-pages",
    locale: "en",
    toolId: "extract-pages",
    title: "Extract PDF Pages Free — Save Selected Pages | PDFTwin",
    metaDescription:
      "Extract specific pages from a PDF into a new file. Free up to 50 MB, secure processing, files discarded immediately. No watermark.",
    h1: "Extract PDF pages free online",
    intro:
      "Pull only the pages you need — signatures, exhibits, or approval sections — into a new PDF without splitting the whole file manually.",
    benefits: [
      "Extract by page range or list",
      "Up to 50 MB free per file",
      "Secure in-memory processing",
      "No watermark on output",
    ],
    steps: [
      { title: "Upload PDF", body: "Select the source document." },
      { title: "Choose pages", body: "Enter page numbers or ranges to extract." },
      { title: "Download", body: "Save the new PDF with only those pages." },
    ],
    faq: [
      {
        question: "Is extract different from split?",
        answer: "Extract saves one new PDF with selected pages. Split can create multiple files by range.",
      },
    ],
    ctaLabel: "Extract pages now",
    relatedSlugs: ["split-pdf-online", "remove-pdf-pages"],
  },
  {
    slug: "remove-pdf-pages",
    locale: "en",
    toolId: "remove-pages",
    title: "Remove PDF Pages Free Online — Delete Unwanted Pages | PDFTwin",
    metaDescription:
      "Delete unwanted pages from a PDF in your browser. Free, no watermark, runs locally with pdf-lib. Keep the rest of the document intact.",
    h1: "Remove PDF pages free online",
    intro:
      "Strip blank pages, cover sheets, or outdated appendices without re-exporting the whole document. Removal runs in your browser for privacy.",
    benefits: [
      "Remove by page number or range",
      "Processed on your device",
      "No account or daily limits",
      "Free with no watermark",
    ],
    steps: [
      { title: "Upload PDF", body: "Select the PDF to edit." },
      { title: "Pick pages", body: "Enter the page numbers to delete." },
      { title: "Download", body: "Save the trimmed PDF." },
    ],
    faq: [
      {
        question: "Are files uploaded when removing pages?",
        answer: "No. Remove pages runs entirely in your browser.",
      },
    ],
    ctaLabel: "Remove pages now",
    relatedSlugs: ["split-pdf-online", "extract-pdf-pages"],
  },
  {
    slug: "sign-pdf-online",
    locale: "en",
    toolId: "sign-pdf",
    title: "Sign PDF Free Online — Draw or Upload Signature | PDFTwin",
    metaDescription:
      "Add a signature to PDF documents free in your browser. Draw on canvas or upload a PNG. No watermark, files stay on your device.",
    h1: "Sign PDF free online",
    intro:
      "Add your signature to contracts, NDAs, and approval forms without printing and scanning. Draw directly or upload a transparent PNG signature image.",
    benefits: [
      "Draw signature or upload PNG",
      "Place signature on any page",
      "Processed locally in browser",
      "Free with no watermark",
    ],
    steps: [
      { title: "Upload PDF", body: "Select the document to sign." },
      { title: "Create signature", body: "Draw on the canvas or upload a PNG file." },
      { title: "Place and download", body: "Position the signature and save the signed PDF." },
    ],
    faq: [
      {
        question: "Is this a legally binding e-signature?",
        answer: "PDFTwin adds a visual signature image. For regulated contracts, confirm requirements with your jurisdiction.",
      },
    ],
    ctaLabel: "Sign PDF now",
    relatedSlugs: ["merge-pdf-free", "word-to-pdf-free"],
  },
  {
    slug: "images-to-pdf-free",
    locale: "en",
    toolId: "images-to-pdf",
    title: "Images to PDF Free — JPG, PNG to One PDF | PDFTwin",
    metaDescription:
      "Combine JPG, PNG, and other images into one PDF free in your browser. Drag to reorder pages. No watermark, no server upload.",
    h1: "Convert images to PDF free online",
    intro:
      "Turn photo scans, receipts, and slide exports into a single share-ready PDF. Reorder images before export — all processed on your device.",
    benefits: [
      "Multiple JPG, PNG, and image formats",
      "Drag to reorder pages before export",
      "Processed in your browser",
      "Free with no watermark",
    ],
    steps: [
      { title: "Add images", body: "Upload one or more image files." },
      { title: "Set order", body: "Drag images into the page order you want." },
      { title: "Download PDF", body: "Export a single combined PDF." },
    ],
    faq: [
      {
        question: "Can I mix JPG and PNG in one PDF?",
        answer: "Yes. Add any supported image types and export them as one PDF.",
      },
    ],
    ctaLabel: "Create PDF from images",
    relatedSlugs: ["merge-pdf-free", "word-to-pdf-free"],
  },
  {
    slug: "ocr-pdf-online",
    locale: "en",
    toolId: "ocr-pdf",
    title: "OCR PDF Free Online — Scanned PDF to Text | PDFTwin",
    metaDescription:
      "Extract text from scanned PDFs and photos with OCR in your browser. Supports English, Spanish, French, German, Dutch, and more. Free, private.",
    h1: "OCR PDF to text free online",
    intro:
      "Turn scanned contracts and photo documents into editable text. PDFTwin runs Tesseract.js in your browser — files never leave your device.",
    benefits: [
      "OCR for scanned PDFs and images",
      "7 languages including EN, ES, FR, DE, NL",
      "Processed locally — private by default",
      "Free with no daily limits",
    ],
    steps: [
      { title: "Upload file", body: "Add a scanned PDF or image." },
      { title: "Choose language", body: "Select the document language for best accuracy." },
      { title: "Download text", body: "Copy or save the extracted .txt output." },
    ],
    faq: [
      {
        question: "Does OCR work on photos of documents?",
        answer: "Yes. Upload JPG, PNG, or a scanned PDF page and OCR extracts readable text.",
      },
      {
        question: "Are my files uploaded for OCR?",
        answer: "No. OCR runs entirely in your browser with Tesseract.js.",
      },
    ],
    ctaLabel: "Run OCR now",
    relatedSlugs: ["pdf-to-word-free", "compress-pdf-free"],
  },
];

const ES_LANDINGS: SeoLanding[] = [
  {
    slug: "unir-pdf",
    locale: "es",
    toolId: "arrange-merge",
    title: "Unir PDF Gratis Online — Sin Marca de Agua | PDFTwin",
    metaDescription:
      "Combina varios PDF en uno gratis en el navegador. Sin marca de agua, sin registro, hasta 50 MB. Unión en tu dispositivo para más privacidad.",
    h1: "Unir PDF gratis — sin marca de agua",
    intro:
      "Combina contratos, facturas e informes en un solo PDF sin subir archivos a un servidor. PDFTwin une tus PDF en el navegador — rápido, privado y gratis.",
    benefits: [
      "Sin marca de agua en el PDF final",
      "Procesado en tu dispositivo — archivos privados",
      "Reordena documentos y páginas antes de unir",
      "Sin cuenta ni límites diarios",
    ],
    steps: [
      { title: "Sube PDFs", body: "Añade dos o más archivos PDF." },
      { title: "Ordena", body: "Arrastra los documentos al orden deseado y confirma." },
      { title: "Descarga", body: "Haz clic en Unir y guarda tu PDF combinado." },
    ],
    faq: [
      {
        question: "¿Unir PDF es realmente gratis?",
        answer: "Sí. Unir, dividir y rotar son gratis sin marca de agua ni límites diarios.",
      },
      {
        question: "¿Se suben mis archivos a un servidor?",
        answer: "No. La unión se ejecuta en tu navegador.",
      },
    ],
    ctaLabel: "Unir PDFs ahora",
    relatedSlugs: ["dividir-pdf", "comprimir-pdf"],
  },
  {
    slug: "dividir-pdf",
    locale: "es",
    toolId: "split",
    title: "Dividir PDF Online Gratis — Por Páginas | PDFTwin",
    metaDescription:
      "Divide un PDF en archivos separados por rango de páginas. Gratis, sin marca de agua, en el navegador.",
    h1: "Dividir PDF online gratis",
    intro:
      "Separa un PDF grande en archivos más pequeños por rango de páginas. Introduce rangos como 1-3, 5-7 y descarga — procesado localmente.",
    benefits: [
      "Divide por rangos separados por comas",
      "Varios rangos se descargan en ZIP",
      "Sin subida a servidores",
      "Gratis sin marca de agua",
    ],
    steps: [
      { title: "Sube el PDF", body: "Selecciona el PDF a dividir." },
      { title: "Introduce rangos", body: "Formato: 1-3, 5-7, 10" },
      { title: "Descarga", body: "Obtén un PDF o un ZIP con todas las partes." },
    ],
    faq: [
      {
        question: "¿Puedo dividir en más de dos archivos?",
        answer: "Sí. Cada rango separado por coma genera su propio PDF en un ZIP.",
      },
    ],
    ctaLabel: "Dividir PDF ahora",
    relatedSlugs: ["unir-pdf", "comprimir-pdf"],
  },
  {
    slug: "comprimir-pdf",
    locale: "es",
    toolId: "compress-pdf",
    title: "Comprimir PDF Gratis — Reducir Tamaño | PDFTwin",
    metaDescription:
      "Comprime PDF para email y descargas más rápidas. Plan gratis hasta 50 MB. Procesamiento seguro, archivos eliminados al instante.",
    h1: "Comprimir PDF gratis online",
    intro:
      "Reduce el tamaño de PDF para adjuntos de correo. Elige calidad y descarga un PDF más ligero en segundos.",
    benefits: [
      "Presets de compresión media y alta",
      "Hasta 50 MB gratis por archivo",
      "Procesado de forma segura",
      "Sin marca de agua",
    ],
    steps: [
      { title: "Sube el PDF", body: "Selecciona el archivo a comprimir." },
      { title: "Elige calidad", body: "Compresión media o alta." },
      { title: "Descarga", body: "Guarda el PDF reducido." },
    ],
    faq: [
      {
        question: "¿La compresión añade marca de agua?",
        answer: "Nunca. PDFTwin no añade marca de agua en la salida gratuita.",
      },
    ],
    ctaLabel: "Comprimir PDF ahora",
    relatedSlugs: ["unir-pdf", "pdf-a-word"],
  },
  {
    slug: "pdf-a-word",
    locale: "es",
    toolId: "convert-extract",
    title: "PDF a Word Gratis — Convertir a DOCX | PDFTwin",
    metaDescription:
      "Convierte PDF a Word editable (.docx) online. Plan gratis: 3 exportaciones al día. Conversión con layout para documentos empresariales.",
    h1: "PDF a Word gratis online",
    intro:
      "Convierte PDFs empresariales en documentos Word editables. PDFTwin preserva el layout y tablas cuando es posible.",
    benefits: [
      "Exporta a formato .docx",
      "3 conversiones gratis al día",
      "Pro: exportaciones ilimitadas",
      "Nombres de archivo multilingües",
    ],
    steps: [
      { title: "Sube el PDF", body: "Selecciona el PDF a convertir." },
      { title: "Elige Word", body: "Formato de salida: documento Word." },
      { title: "Descarga DOCX", body: "Edita en Word o Google Docs." },
    ],
    faq: [
      {
        question: "¿Cuántas conversiones PDF a Word gratis al día?",
        answer: "Usuarios gratis: 3 exportaciones PDF a Word o Excel al día. Pro es ilimitado.",
      },
    ],
    ctaLabel: "Convertir a Word ahora",
    relatedSlugs: ["comprimir-pdf", "word-a-pdf"],
  },
  {
    slug: "comparar-pdf",
    locale: "es",
    toolId: "pdf-compare",
    title: "Comparar PDF Online Gratis — Lado a Lado | PDFTwin",
    metaDescription:
      "Compara dos PDF lado a lado con desplazamiento y zoom enlazados. Gratis, en el navegador — archivos no salen de tu dispositivo.",
    h1: "Comparar PDFs lado a lado gratis",
    intro:
      "Revisa revisiones de contratos con dos PDF renderizados juntos. El desplazamiento enlazado mantiene ambos paneles alineados.",
    benefits: [
      "Visor lado a lado en el navegador",
      "Desplazamiento y zoom enlazados",
      "Sin subida al servidor",
      "Gratis para revisión de contratos",
    ],
    steps: [
      { title: "Sube dos PDFs", body: "Añade documento izquierdo y derecho." },
      { title: "Activa scroll enlazado", body: "Sincroniza ambos paneles." },
      { title: "Revisa", body: "Amplía detalles con zoom enlazado." },
    ],
    faq: [
      {
        question: "¿Se suben los archivos al comparar?",
        answer: "No. La comparación se renderiza localmente con PDF.js.",
      },
    ],
    ctaLabel: "Comparar PDFs ahora",
    relatedSlugs: ["unir-pdf", "dividir-pdf"],
  },
  {
    slug: "word-a-pdf",
    locale: "es",
    toolId: "word-to-pdf",
    title: "Word a PDF Gratis — Convertir DOCX | PDFTwin",
    metaDescription:
      "Convierte Word a PDF listo para compartir. Gratis, procesamiento seguro, hasta 50 MB por archivo.",
    h1: "Word a PDF gratis online",
    intro:
      "Convierte propuestas y contratos DOCX en PDFs que cualquier cliente puede abrir. Sube Word y descarga PDF en segundos.",
    benefits: [
      "Conversión DOCX a PDF",
      "Gratis hasta 50 MB",
      "Procesamiento seguro en memoria",
      "Sin marca de agua",
    ],
    steps: [
      { title: "Sube DOCX", body: "Selecciona tu documento Word." },
      { title: "Convierte", body: "PDFTwin procesa el layout." },
      { title: "Descarga PDF", body: "Comparte por email o en la nube." },
    ],
    faq: [],
    ctaLabel: "Convertir Word a PDF",
    relatedSlugs: ["pdf-a-word", "unir-pdf"],
  },
  {
    slug: "rotar-pdf",
    locale: "es",
    toolId: "rotate-pdf",
    title: "Rotar PDF Gratis Online — 90°, 180°, 270° | PDFTwin",
    metaDescription:
      "Rota páginas PDF gratis en el navegador. Gira todas o páginas seleccionadas. Sin marca de agua, sin subida a servidores.",
    h1: "Rotar PDF gratis online",
    intro:
      "Corrige escaneos girados y diapositivas en horizontal. PDFTwin rota en tu navegador — los archivos permanecen en tu dispositivo.",
    benefits: [
      "Rotar todas las páginas o una lista personalizada",
      "90°, 180° o 270° en un clic",
      "Procesado localmente",
      "Gratis sin marca de agua",
    ],
    steps: [
      { title: "Sube el PDF", body: "Selecciona el PDF a rotar." },
      { title: "Elige ángulo", body: "Selecciona 90°, 180° o 270° y qué páginas rotar." },
      { title: "Descarga", body: "Guarda el PDF corregido." },
    ],
    faq: [
      {
        question: "¿Puedo rotar solo algunas páginas?",
        answer: "Sí. Introduce números de página concretos o rota todo el documento.",
      },
    ],
    ctaLabel: "Rotar PDF ahora",
    relatedSlugs: ["dividir-pdf", "unir-pdf"],
  },
  {
    slug: "extraer-paginas-pdf",
    locale: "es",
    toolId: "extract-pages",
    title: "Extraer Páginas PDF Gratis — Guardar Páginas | PDFTwin",
    metaDescription:
      "Extrae páginas concretas de un PDF a un archivo nuevo. Gratis hasta 50 MB, procesamiento seguro, sin marca de agua.",
    h1: "Extraer páginas PDF gratis online",
    intro:
      "Obtén solo las páginas que necesitas — firmas, anexos o secciones de aprobación — en un PDF nuevo sin dividir manualmente todo el archivo.",
    benefits: [
      "Extrae por rango o lista de páginas",
      "Hasta 50 MB gratis por archivo",
      "Procesamiento seguro en memoria",
      "Sin marca de agua",
    ],
    steps: [
      { title: "Sube el PDF", body: "Selecciona el documento origen." },
      { title: "Elige páginas", body: "Introduce números o rangos a extraer." },
      { title: "Descarga", body: "Guarda el PDF con solo esas páginas." },
    ],
    faq: [
      {
        question: "¿Extraer es distinto de dividir?",
        answer: "Extraer crea un PDF con páginas seleccionadas. Dividir puede generar varios archivos por rango.",
      },
    ],
    ctaLabel: "Extraer páginas ahora",
    relatedSlugs: ["dividir-pdf", "eliminar-paginas-pdf"],
  },
  {
    slug: "eliminar-paginas-pdf",
    locale: "es",
    toolId: "remove-pages",
    title: "Eliminar Páginas PDF Gratis Online | PDFTwin",
    metaDescription:
      "Elimina páginas no deseadas de un PDF en el navegador. Gratis, sin marca de agua, procesado localmente.",
    h1: "Eliminar páginas PDF gratis online",
    intro:
      "Quita páginas en blanco, portadas o anexos obsoletos sin reexportar todo el documento. La eliminación se ejecuta en tu navegador.",
    benefits: [
      "Elimina por número o rango de páginas",
      "Procesado en tu dispositivo",
      "Sin cuenta ni límites diarios",
      "Gratis sin marca de agua",
    ],
    steps: [
      { title: "Sube el PDF", body: "Selecciona el PDF a editar." },
      { title: "Elige páginas", body: "Introduce los números de página a eliminar." },
      { title: "Descarga", body: "Guarda el PDF recortado." },
    ],
    faq: [
      {
        question: "¿Se suben los archivos al eliminar páginas?",
        answer: "No. La eliminación se ejecuta íntegramente en tu navegador.",
      },
    ],
    ctaLabel: "Eliminar páginas ahora",
    relatedSlugs: ["dividir-pdf", "extraer-paginas-pdf"],
  },
  {
    slug: "firmar-pdf",
    locale: "es",
    toolId: "sign-pdf",
    title: "Firmar PDF Gratis Online — Dibujar o Subir Firma | PDFTwin",
    metaDescription:
      "Añade firma a PDF gratis en el navegador. Dibuja en lienzo o sube PNG. Sin marca de agua, archivos en tu dispositivo.",
    h1: "Firmar PDF gratis online",
    intro:
      "Firma contratos, NDAs y formularios sin imprimir ni escanear. Dibuja directamente o sube una imagen PNG con fondo transparente.",
    benefits: [
      "Dibuja firma o sube PNG",
      "Coloca la firma en cualquier página",
      "Procesado localmente",
      "Gratis sin marca de agua",
    ],
    steps: [
      { title: "Sube el PDF", body: "Selecciona el documento a firmar." },
      { title: "Crea firma", body: "Dibuja en el lienzo o sube un PNG." },
      { title: "Coloca y descarga", body: "Posiciona la firma y guarda el PDF firmado." },
    ],
    faq: [
      {
        question: "¿Es una firma electrónica legalmente vinculante?",
        answer: "PDFTwin añade una imagen de firma visual. Para contratos regulados, confirma los requisitos de tu jurisdicción.",
      },
    ],
    ctaLabel: "Firmar PDF ahora",
    relatedSlugs: ["unir-pdf", "word-a-pdf"],
  },
  {
    slug: "imagenes-a-pdf",
    locale: "es",
    toolId: "images-to-pdf",
    title: "Imágenes a PDF Gratis — JPG, PNG en un PDF | PDFTwin",
    metaDescription:
      "Combina JPG, PNG e imágenes en un PDF gratis en el navegador. Arrastra para reordenar. Sin marca de agua.",
    h1: "Convertir imágenes a PDF gratis online",
    intro:
      "Convierte escaneos, recibos y exportaciones de diapositivas en un PDF listo para compartir. Reordena imágenes antes de exportar.",
    benefits: [
      "Varios formatos JPG, PNG e imágenes",
      "Arrastra para reordenar páginas",
      "Procesado en el navegador",
      "Gratis sin marca de agua",
    ],
    steps: [
      { title: "Añade imágenes", body: "Sube uno o más archivos de imagen." },
      { title: "Ordena", body: "Arrastra las imágenes al orden deseado." },
      { title: "Descarga PDF", body: "Exporta un PDF combinado." },
    ],
    faq: [
      {
        question: "¿Puedo mezclar JPG y PNG?",
        answer: "Sí. Añade cualquier formato compatible y expórtalos como un PDF.",
      },
    ],
    ctaLabel: "Crear PDF desde imágenes",
    relatedSlugs: ["unir-pdf", "word-a-pdf"],
  },
  {
    slug: "ocr-pdf",
    locale: "es",
    toolId: "ocr-pdf",
    title: "OCR PDF Gratis Online — PDF Escaneado a Texto | PDFTwin",
    metaDescription:
      "Extrae texto de PDF escaneados y fotos con OCR en el navegador. Español, inglés, francés, alemán, holandés y más. Gratis y privado.",
    h1: "OCR PDF a texto gratis online",
    intro:
      "Convierte contratos escaneados y documentos fotografiados en texto editable. PDFTwin usa Tesseract.js en tu navegador.",
    benefits: [
      "OCR para PDF escaneados e imágenes",
      "7 idiomas incl. ES, EN, FR, DE, NL",
      "Procesado localmente",
      "Gratis sin límites diarios",
    ],
    steps: [
      { title: "Sube archivo", body: "Añade un PDF escaneado o imagen." },
      { title: "Elige idioma", body: "Selecciona el idioma del documento." },
      { title: "Descarga texto", body: "Copia o guarda el .txt extraído." },
    ],
    faq: [
      {
        question: "¿Funciona con fotos de documentos?",
        answer: "Sí. Sube JPG, PNG o una página PDF escaneada y el OCR extrae texto legible.",
      },
    ],
    ctaLabel: "Ejecutar OCR ahora",
    relatedSlugs: ["pdf-a-word", "comprimir-pdf"],
  },
];

const FR_LANDINGS: SeoLanding[] = [
  {
    slug: "fusionner-pdf",
    locale: "fr",
    toolId: "arrange-merge",
    title: "Fusionner PDF Gratuit — Sans Filigrane | PDFTwin",
    metaDescription:
      "Combinez plusieurs PDF en un seul fichier gratuitement dans le navigateur. Sans filigrane, sans inscription, jusqu'à 50 Mo.",
    h1: "Fusionner PDF gratuitement — sans filigrane",
    intro:
      "Combinez contrats, factures et rapports en un PDF sans envoi vers un serveur. PDFTwin fusionne dans votre navigateur — rapide et privé.",
    benefits: [
      "Aucun filigrane sur le PDF fusionné",
      "Traitement sur votre appareil",
      "Réordonnez documents et pages",
      "Sans compte ni limite quotidienne",
    ],
    steps: [
      { title: "Téléversez des PDF", body: "Ajoutez deux fichiers PDF ou plus." },
      { title: "Ordre", body: "Glissez les documents dans l'ordre souhaité." },
      { title: "Téléchargez", body: "Fusionnez et enregistrez votre PDF." },
    ],
    faq: [
      {
        question: "La fusion est-elle vraiment gratuite ?",
        answer: "Oui. Fusion, scission et rotation sont gratuites sans filigrane.",
      },
    ],
    ctaLabel: "Fusionner des PDF",
    relatedSlugs: ["diviser-pdf", "compresser-pdf"],
  },
  {
    slug: "diviser-pdf",
    locale: "fr",
    toolId: "split",
    title: "Diviser PDF En Ligne Gratuit | PDFTwin",
    metaDescription: "Scindez un PDF par plages de pages. Gratuit, sans filigrane, dans le navigateur.",
    h1: "Diviser PDF en ligne gratuit",
    intro: "Séparez un grand PDF en fichiers plus petits par plage de pages — traité localement.",
    benefits: ["Plages séparées par virgules", "ZIP pour plusieurs parties", "Sans envoi serveur", "Gratuit"],
    steps: [
      { title: "Téléversez le PDF", body: "Sélectionnez le fichier." },
      { title: "Plages", body: "Ex. 1-3, 5-7, 10" },
      { title: "Téléchargez", body: "PDF unique ou ZIP." },
    ],
    faq: [],
    ctaLabel: "Diviser le PDF",
    relatedSlugs: ["fusionner-pdf", "compresser-pdf"],
  },
  {
    slug: "compresser-pdf",
    locale: "fr",
    toolId: "compress-pdf",
    title: "Compresser PDF Gratuit | PDFTwin",
    metaDescription: "Réduisez la taille d'un PDF pour e-mail. Gratuit jusqu'à 50 Mo, sans filigrane.",
    h1: "Compresser PDF gratuit en ligne",
    intro: "Réduisez un PDF pour pièces jointes e-mail. Choisissez la qualité et téléchargez.",
    benefits: ["Presets moyen et élevé", "50 Mo gratuits", "Sécurisé", "Sans filigrane"],
    steps: [
      { title: "Téléversez", body: "Sélectionnez le PDF." },
      { title: "Qualité", body: "Compression moyenne ou élevée." },
      { title: "Téléchargez", body: "Enregistrez le PDF réduit." },
    ],
    faq: [],
    ctaLabel: "Compresser le PDF",
    relatedSlugs: ["fusionner-pdf", "pdf-vers-word"],
  },
  {
    slug: "pdf-vers-word",
    locale: "fr",
    toolId: "convert-extract",
    title: "PDF vers Word Gratuit — DOCX | PDFTwin",
    metaDescription: "Convertissez PDF en Word éditable. 3 exportations gratuites par jour.",
    h1: "PDF vers Word gratuit",
    intro: "Transformez des PDF professionnels en documents Word modifiables.",
    benefits: ["Export .docx", "3/jour en gratuit", "Pro illimité", "Noms UTF-8"],
    steps: [
      { title: "PDF", body: "Téléversez le fichier." },
      { title: "Word", body: "Choisissez Word." },
      { title: "DOCX", body: "Téléchargez et éditez." },
    ],
    faq: [],
    ctaLabel: "Convertir en Word",
    relatedSlugs: ["compresser-pdf", "word-vers-pdf"],
  },
  {
    slug: "comparer-pdf",
    locale: "fr",
    toolId: "pdf-compare",
    title: "Comparer PDF Gratuit — Côte à Côte | PDFTwin",
    metaDescription: "Comparez deux PDF côte à côte avec défilement lié. Gratuit, dans le navigateur.",
    h1: "Comparer PDF côte à côte",
    intro: "Révisez des contrats avec deux PDF affichés ensemble — défilement synchronisé.",
    benefits: ["Vue côte à côte", "Défilement lié", "Sans upload", "Gratuit"],
    steps: [
      { title: "Deux PDF", body: "Ajoutez gauche et droite." },
      { title: "Sync", body: "Activez le défilement lié." },
      { title: "Révisez", body: "Zoomez sur les détails." },
    ],
    faq: [],
    ctaLabel: "Comparer des PDF",
    relatedSlugs: ["fusionner-pdf", "diviser-pdf"],
  },
  {
    slug: "word-vers-pdf",
    locale: "fr",
    toolId: "word-to-pdf",
    title: "Word vers PDF Gratuit | PDFTwin",
    metaDescription: "Convertissez DOCX en PDF partageable. Gratuit, jusqu'à 50 Mo.",
    h1: "Word vers PDF gratuit",
    intro: "Convertissez propositions DOCX en PDF prêts à envoyer aux clients.",
    benefits: ["DOCX → PDF", "50 Mo gratuits", "Sécurisé", "Sans filigrane"],
    steps: [
      { title: "DOCX", body: "Téléversez Word." },
      { title: "Convertir", body: "Traitement serveur sécurisé." },
      { title: "PDF", body: "Téléchargez." },
    ],
    faq: [],
    ctaLabel: "Convertir Word en PDF",
    relatedSlugs: ["pdf-vers-word", "fusionner-pdf"],
  },
  {
    slug: "pivoter-pdf",
    locale: "fr",
    toolId: "rotate-pdf",
    title: "Pivoter PDF Gratuit — 90°, 180°, 270° | PDFTwin",
    metaDescription:
      "Faites pivoter des pages PDF gratuitement dans le navigateur. Sans filigrane, sans envoi serveur.",
    h1: "Pivoter PDF gratuit en ligne",
    intro:
      "Corrigez scans de travers et diapositives paysage. PDFTwin pivote dans votre navigateur — fichiers sur votre appareil.",
    benefits: ["Toutes les pages ou liste personnalisée", "90°, 180° ou 270°", "Traitement local", "Gratuit sans filigrane"],
    steps: [
      { title: "Téléversez", body: "Sélectionnez le PDF." },
      { title: "Angle", body: "Choisissez 90°, 180° ou 270° et les pages." },
      { title: "Téléchargez", body: "Enregistrez le PDF corrigé." },
    ],
    faq: [
      {
        question: "Puis-je pivoter seulement certaines pages ?",
        answer: "Oui. Indiquez des numéros de page ou pivotez tout le document.",
      },
    ],
    ctaLabel: "Pivoter le PDF",
    relatedSlugs: ["diviser-pdf", "fusionner-pdf"],
  },
  {
    slug: "extraire-pages-pdf",
    locale: "fr",
    toolId: "extract-pages",
    title: "Extraire Pages PDF Gratuit | PDFTwin",
    metaDescription: "Extrayez des pages d'un PDF dans un nouveau fichier. Gratuit jusqu'à 50 Mo, sans filigrane.",
    h1: "Extraire pages PDF gratuit",
    intro: "Obtenez uniquement les pages utiles — signatures, annexes — dans un nouveau PDF.",
    benefits: ["Plages ou liste de pages", "50 Mo gratuits", "Traitement sécurisé", "Sans filigrane"],
    steps: [
      { title: "PDF", body: "Téléversez le document." },
      { title: "Pages", body: "Indiquez les pages à extraire." },
      { title: "Téléchargez", body: "Enregistrez le nouveau PDF." },
    ],
    faq: [],
    ctaLabel: "Extraire des pages",
    relatedSlugs: ["diviser-pdf", "supprimer-pages-pdf"],
  },
  {
    slug: "supprimer-pages-pdf",
    locale: "fr",
    toolId: "remove-pages",
    title: "Supprimer Pages PDF Gratuit | PDFTwin",
    metaDescription: "Supprimez des pages indésirables d'un PDF dans le navigateur. Gratuit, sans filigrane.",
    h1: "Supprimer pages PDF gratuit",
    intro: "Retirez pages blanches et annexes obsolètes sans réexporter tout le document.",
    benefits: ["Par numéro ou plage", "Sur votre appareil", "Sans limite quotidienne", "Gratuit"],
    steps: [
      { title: "PDF", body: "Téléversez le fichier." },
      { title: "Pages", body: "Indiquez les pages à supprimer." },
      { title: "Téléchargez", body: "Enregistrez le PDF réduit." },
    ],
    faq: [],
    ctaLabel: "Supprimer des pages",
    relatedSlugs: ["diviser-pdf", "extraire-pages-pdf"],
  },
  {
    slug: "signer-pdf",
    locale: "fr",
    toolId: "sign-pdf",
    title: "Signer PDF Gratuit — Dessiner ou Importer | PDFTwin",
    metaDescription: "Ajoutez une signature à un PDF gratuitement dans le navigateur. Sans filigrane.",
    h1: "Signer PDF gratuit en ligne",
    intro: "Signez contrats et formulaires sans imprimer. Dessinez ou importez un PNG transparent.",
    benefits: ["Dessin ou PNG", "Sur n'importe quelle page", "Traitement local", "Gratuit"],
    steps: [
      { title: "PDF", body: "Téléversez le document." },
      { title: "Signature", body: "Dessinez ou importez PNG." },
      { title: "Téléchargez", body: "Placez et enregistrez." },
    ],
    faq: [],
    ctaLabel: "Signer le PDF",
    relatedSlugs: ["fusionner-pdf", "word-vers-pdf"],
  },
  {
    slug: "images-en-pdf",
    locale: "fr",
    toolId: "images-to-pdf",
    title: "Images en PDF Gratuit — JPG, PNG | PDFTwin",
    metaDescription: "Combinez images en un PDF gratuit dans le navigateur. Glissez pour réordonner. Sans filigrane.",
    h1: "Convertir images en PDF gratuit",
    intro: "Transformez scans et photos en un PDF partageable. Réordonnez avant export.",
    benefits: ["JPG, PNG et plus", "Réordonnancement par glisser", "Dans le navigateur", "Gratuit"],
    steps: [
      { title: "Images", body: "Ajoutez vos fichiers." },
      { title: "Ordre", body: "Glissez dans l'ordre voulu." },
      { title: "PDF", body: "Téléchargez le PDF combiné." },
    ],
    faq: [],
    ctaLabel: "Créer PDF depuis images",
    relatedSlugs: ["fusionner-pdf", "word-vers-pdf"],
  },
  {
    slug: "ocr-pdf",
    locale: "fr",
    toolId: "ocr-pdf",
    title: "OCR PDF Gratuit — PDF Scanné en Texte | PDFTwin",
    metaDescription: "Extrayez le texte de PDF scannés avec OCR dans le navigateur. FR, EN, ES, DE, NL et plus.",
    h1: "OCR PDF en texte gratuit",
    intro: "Convertissez documents scannés en texte éditable. Tesseract.js s'exécute dans votre navigateur.",
    benefits: ["PDF scannés et images", "7 langues", "Traitement local", "Gratuit"],
    steps: [
      { title: "Fichier", body: "PDF scanné ou image." },
      { title: "Langue", body: "Choisissez la langue du document." },
      { title: "Texte", body: "Copiez ou téléchargez le .txt." },
    ],
    faq: [],
    ctaLabel: "Lancer l'OCR",
    relatedSlugs: ["pdf-vers-word", "compresser-pdf"],
  },
];

const NL_LANDINGS: SeoLanding[] = [
  {
    slug: "pdf-samenvoegen",
    locale: "nl",
    toolId: "arrange-merge",
    title: "PDF Samenvoegen Gratis — Geen Watermerk | PDFTwin",
    metaDescription:
      "Voeg meerdere PDF's samen in één bestand, gratis in de browser. Geen watermerk, geen account, tot 50 MB.",
    h1: "PDF samenvoegen gratis — geen watermerk",
    intro:
      "Combineer contracten, facturen en rapporten in één PDF zonder upload naar een server. PDFTwin werkt in uw browser — snel en privé.",
    benefits: [
      "Geen watermerk op output",
      "Verwerking op uw apparaat",
      "Documenten en pagina's herschikken",
      "Geen daglimiet",
    ],
    steps: [
      { title: "Upload PDF's", body: "Voeg twee of meer PDF's toe." },
      { title: "Volgorde", body: "Sleep documenten in de juiste volgorde." },
      { title: "Download", body: "Sla het samengevoegde PDF op." },
    ],
    faq: [
      {
        question: "Is samenvoegen echt gratis?",
        answer: "Ja. Samenvoegen, splitsen en roteren zijn gratis zonder watermerk.",
      },
    ],
    ctaLabel: "PDF's samenvoegen",
    relatedSlugs: ["pdf-splitsen", "pdf-comprimeren"],
  },
  {
    slug: "pdf-splitsen",
    locale: "nl",
    toolId: "split",
    title: "PDF Splitsen Online Gratis | PDFTwin",
    metaDescription: "Split PDF op paginabereik. Gratis, geen watermerk, in de browser.",
    h1: "PDF splitsen online gratis",
    intro: "Split een grote PDF in kleinere bestanden op paginabereik — lokaal verwerkt.",
    benefits: ["Bereiken met komma's", "ZIP bij meerdere delen", "Geen server-upload", "Gratis"],
    steps: [
      { title: "Upload PDF", body: "Kies het bestand." },
      { title: "Bereiken", body: "Bijv. 1-3, 5-7, 10" },
      { title: "Download", body: "Eén PDF of ZIP." },
    ],
    faq: [],
    ctaLabel: "PDF splitsen",
    relatedSlugs: ["pdf-samenvoegen", "pdf-comprimeren"],
  },
  {
    slug: "pdf-comprimeren",
    locale: "nl",
    toolId: "compress-pdf",
    title: "PDF Comprimeren Gratis | PDFTwin",
    metaDescription: "Verklein PDF voor e-mail. Gratis tot 50 MB, geen watermerk.",
    h1: "PDF comprimeren gratis online",
    intro: "Verklein PDF-bestanden voor e-mail bijlagen. Kies kwaliteit en download.",
    benefits: ["Medium en hoog preset", "50 MB gratis", "Veilig", "Geen watermerk"],
    steps: [
      { title: "Upload", body: "Selecteer PDF." },
      { title: "Kwaliteit", body: "Kies compressie." },
      { title: "Download", body: "Bewaar kleiner PDF." },
    ],
    faq: [],
    ctaLabel: "PDF comprimeren",
    relatedSlugs: ["pdf-samenvoegen", "pdf-naar-word"],
  },
  {
    slug: "pdf-naar-word",
    locale: "nl",
    toolId: "convert-extract",
    title: "PDF naar Word Gratis — DOCX | PDFTwin",
    metaDescription: "Converteer PDF naar bewerkbaar Word. 3 gratis exports per dag.",
    h1: "PDF naar Word gratis online",
    intro: "Zet zakelijke PDF's om in bewerkbare Word-documenten.",
    benefits: [".docx export", "3/dag gratis", "Pro onbeperkt", "UTF-8 bestandsnamen"],
    steps: [
      { title: "Upload PDF", body: "Kies bestand." },
      { title: "Word", body: "Kies Word als output." },
      { title: "DOCX", body: "Download en bewerk." },
    ],
    faq: [],
    ctaLabel: "Naar Word converteren",
    relatedSlugs: ["pdf-comprimeren", "word-naar-pdf"],
  },
  {
    slug: "pdf-vergelijken",
    locale: "nl",
    toolId: "pdf-compare",
    title: "PDF Vergelijken Gratis — Naast Elkaar | PDFTwin",
    metaDescription: "Vergelijk twee PDF's naast elkaar met gekoppeld scrollen. Gratis in browser.",
    h1: "PDF's vergelijken naast elkaar",
    intro: "Beoordeel contractrevisies met twee PDF's naast elkaar — gesynchroniseerd scrollen.",
    benefits: ["Naast-elkaar viewer", "Gekoppeld scrollen", "Geen upload", "Gratis"],
    steps: [
      { title: "Twee PDF's", body: "Links en rechts toevoegen." },
      { title: "Koppelen", body: "Schakel gekoppeld scrollen in." },
      { title: "Review", body: "Zoom op details." },
    ],
    faq: [],
    ctaLabel: "PDF's vergelijken",
    relatedSlugs: ["pdf-samenvoegen", "pdf-splitsen"],
  },
  {
    slug: "word-naar-pdf",
    locale: "nl",
    toolId: "word-to-pdf",
    title: "Word naar PDF Gratis | PDFTwin",
    metaDescription: "Converteer DOCX naar deelbare PDF. Gratis, tot 50 MB.",
    h1: "Word naar PDF gratis online",
    intro: "Zet DOCX-voorstellen om in PDF's die klanten overal kunnen openen.",
    benefits: ["DOCX → PDF", "50 MB gratis", "Veilig", "Geen watermerk"],
    steps: [
      { title: "DOCX", body: "Upload Word." },
      { title: "Converteren", body: "Veilige serververwerking." },
      { title: "PDF", body: "Download." },
    ],
    faq: [],
    ctaLabel: "Word naar PDF",
    relatedSlugs: ["pdf-naar-word", "pdf-samenvoegen"],
  },
  {
    slug: "pdf-roteren",
    locale: "nl",
    toolId: "rotate-pdf",
    title: "PDF Roteren Gratis Online — 90°, 180°, 270° | PDFTwin",
    metaDescription:
      "Roteer PDF-pagina's gratis in de browser. Geen watermerk, geen server-upload.",
    h1: "PDF roteren gratis online",
    intro:
      "Corrigeer scheve scans en liggende dia's. PDFTwin roteert in uw browser — bestanden blijven op uw apparaat.",
    benefits: ["Alle pagina's of selectie", "90°, 180° of 270°", "Lokaal verwerkt", "Gratis zonder watermerk"],
    steps: [
      { title: "Upload PDF", body: "Kies het PDF-bestand." },
      { title: "Hoek", body: "Kies 90°, 180° of 270° en pagina's." },
      { title: "Download", body: "Sla het gecorrigeerde PDF op." },
    ],
    faq: [
      {
        question: "Kan ik alleen sommige pagina's roteren?",
        answer: "Ja. Voer paginanummers in of roteer het hele document.",
      },
    ],
    ctaLabel: "PDF roteren",
    relatedSlugs: ["pdf-splitsen", "pdf-samenvoegen"],
  },
  {
    slug: "pdf-paginas-extraheren",
    locale: "nl",
    toolId: "extract-pages",
    title: "PDF Pagina's Extraheren Gratis | PDFTwin",
    metaDescription: "Haal geselecteerde pagina's uit een PDF. Gratis tot 50 MB, geen watermerk.",
    h1: "PDF-pagina's extraheren gratis",
    intro: "Pak alleen de pagina's die u nodig heeft in een nieuw PDF — handtekeningen, bijlagen of goedkeuringen.",
    benefits: ["Paginabereik of lijst", "50 MB gratis", "Veilige verwerking", "Geen watermerk"],
    steps: [
      { title: "Upload PDF", body: "Kies het brondocument." },
      { title: "Pagina's", body: "Voer paginanummers of bereiken in." },
      { title: "Download", body: "Sla het nieuwe PDF op." },
    ],
    faq: [],
    ctaLabel: "Pagina's extraheren",
    relatedSlugs: ["pdf-splitsen", "pdf-paginas-verwijderen"],
  },
  {
    slug: "pdf-paginas-verwijderen",
    locale: "nl",
    toolId: "remove-pages",
    title: "PDF Pagina's Verwijderen Gratis | PDFTwin",
    metaDescription: "Verwijder ongewenste pagina's uit een PDF in de browser. Gratis, geen watermerk.",
    h1: "PDF-pagina's verwijderen gratis",
    intro: "Verwijder lege pagina's en verouderde bijlagen zonder het hele document opnieuw te exporteren.",
    benefits: ["Op nummer of bereik", "Op uw apparaat", "Geen daglimiet", "Gratis"],
    steps: [
      { title: "Upload PDF", body: "Kies het te bewerken PDF." },
      { title: "Pagina's", body: "Voer te verwijderen paginanummers in." },
      { title: "Download", body: "Sla het ingekorte PDF op." },
    ],
    faq: [],
    ctaLabel: "Pagina's verwijderen",
    relatedSlugs: ["pdf-splitsen", "pdf-paginas-extraheren"],
  },
  {
    slug: "pdf-ondertekenen",
    locale: "nl",
    toolId: "sign-pdf",
    title: "PDF Ondertekenen Gratis — Tekenen of Uploaden | PDFTwin",
    metaDescription: "Voeg handtekening toe aan PDF gratis in de browser. Geen watermerk.",
    h1: "PDF ondertekenen gratis online",
    intro: "Onderteken contracten zonder printen. Teken op het canvas of upload een transparante PNG.",
    benefits: ["Tekenen of PNG", "Op elke pagina", "Lokaal verwerkt", "Gratis"],
    steps: [
      { title: "Upload PDF", body: "Kies het document." },
      { title: "Handtekening", body: "Teken of upload PNG." },
      { title: "Download", body: "Plaats en sla op." },
    ],
    faq: [],
    ctaLabel: "PDF ondertekenen",
    relatedSlugs: ["pdf-samenvoegen", "word-naar-pdf"],
  },
  {
    slug: "afbeeldingen-naar-pdf",
    locale: "nl",
    toolId: "images-to-pdf",
    title: "Afbeeldingen naar PDF Gratis — JPG, PNG | PDFTwin",
    metaDescription: "Combineer afbeeldingen in één PDF gratis in de browser. Sleep om te ordenen. Geen watermerk.",
    h1: "Afbeeldingen naar PDF gratis",
    intro: "Maak van scans en foto's één deelbaar PDF. Orden afbeeldingen vóór export.",
    benefits: ["JPG, PNG en meer", "Sleep om te ordenen", "In browser", "Gratis"],
    steps: [
      { title: "Afbeeldingen", body: "Upload één of meer bestanden." },
      { title: "Volgorde", body: "Sleep in de gewenste volgorde." },
      { title: "PDF", body: "Download het gecombineerde PDF." },
    ],
    faq: [],
    ctaLabel: "PDF maken van afbeeldingen",
    relatedSlugs: ["pdf-samenvoegen", "word-naar-pdf"],
  },
  {
    slug: "pdf-ocr",
    locale: "nl",
    toolId: "ocr-pdf",
    title: "PDF OCR Gratis — Gescande PDF naar Tekst | PDFTwin",
    metaDescription: "Haal tekst uit gescande PDF's met OCR in de browser. NL, EN, FR, DE, ES en meer.",
    h1: "PDF OCR naar tekst gratis",
    intro: "Zet gescande documenten om in bewerkbare tekst. Tesseract.js draait in uw browser.",
    benefits: ["Gescande PDF's en foto's", "7 talen", "Lokaal en privé", "Gratis"],
    steps: [
      { title: "Bestand", body: "Gescande PDF of afbeelding." },
      { title: "Taal", body: "Kies de documenttaal." },
      { title: "Tekst", body: "Kopieer of download .txt." },
    ],
    faq: [],
    ctaLabel: "OCR starten",
    relatedSlugs: ["pdf-naar-word", "pdf-comprimeren"],
  },
];

export const ALL_SEO_LANDINGS: SeoLanding[] = [
  ...EN_LANDINGS,
  ...ES_LANDINGS,
  ...FR_LANDINGS,
  ...NL_LANDINGS,
];

export function getSeoLandingsForLocale(locale: Locale): SeoLanding[] {
  return ALL_SEO_LANDINGS.filter((landing) => landing.locale === locale);
}

export function getSeoLanding(locale: Locale, slug: string): SeoLanding | undefined {
  return ALL_SEO_LANDINGS.find((landing) => landing.locale === locale && landing.slug === slug);
}

export function seoLandingPath(landing: SeoLanding): string {
  if (landing.locale === "en") return `/guides/${landing.slug}`;
  return `/${landing.locale}/${landing.slug}`;
}

export function relatedLandingPath(locale: Locale, slug: string): string | null {
  const landing = getSeoLanding(locale, slug);
  if (!landing) return null;
  return seoLandingPath(landing);
}

export function getSeoLandingByPath(pathname: string): SeoLanding | undefined {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const guideMatch = normalized.match(/^\/guides\/([^/]+)$/);
  if (guideMatch) return getSeoLanding("en", guideMatch[1]);

  const localeMatch = normalized.match(/^\/(es|fr|nl)\/([^/]+)$/);
  if (localeMatch) {
    const locale = localeMatch[1] as Locale;
    return getSeoLanding(locale, localeMatch[2]);
  }

  return undefined;
}

export function getSeoLandingForTool(locale: Locale, toolId: ToolId): SeoLanding | undefined {
  return ALL_SEO_LANDINGS.find((landing) => landing.locale === locale && landing.toolId === toolId);
}

export function seoHreflangAlternates(landing: SeoLanding): Array<{ locale: Locale; href: string }> {
  const origin = "https://pdftwin.com";
  return (["en", "es", "fr", "nl"] as Locale[])
    .map((locale) => getSeoLandingForTool(locale, landing.toolId))
    .filter((item): item is SeoLanding => Boolean(item))
    .map((item) => ({
      locale: item.locale,
      href: `${origin}${seoLandingPath(item)}`,
    }));
}

export function resolveLocaleSwitchPath(pathname: string, nextLocale: Locale): string {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const current = getSeoLandingByPath(normalized);
  if (current) {
    const target = getSeoLandingForTool(nextLocale, current.toolId);
    if (target) return seoLandingPath(target);
  }

  const base = stripLocalePrefix(normalized);
  if (!isLocalizablePath(base)) {
    return base;
  }

  return localizePath(base, nextLocale);
}
