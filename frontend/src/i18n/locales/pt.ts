import { formatFileLimit, FREE_DAILY_DOC_CONVERT_LIMIT, FREE_FILE_LIMIT_MB, FREE_MERGE_FILE_LIMIT, PRO_FILE_LIMIT_MB } from "../../config/limits";
import type { Messages } from "../types";

const freeLimit = formatFileLimit(FREE_FILE_LIMIT_MB);
const proLimit = formatFileLimit(PRO_FILE_LIMIT_MB);

export const pt: Messages = {
  meta: {
    siteName: "PDFTwin",
    homeTitle: "PDFTwin — Conversão de arquivos empresariais | PDF, Word, Excel e WebP",
    homeDescription:
      "PDFTwin é o espaço de trabalho completo para converter arquivos empresariais. Converta PDFs e imagens, combine documentos, compare revisões e proteja arquivos no navegador.",
    pricingTitle: "Preços | PDFTwin",
    pricingDescription:
      "Comece grátis com todas as ferramentas. Atualize para o PDFTwin Pro para arquivos maiores e exportações PDF ilimitadas.",
    formatsTitle: "Formatos compatíveis | PDFTwin",
    formatsDescription:
      "Veja todos os formatos de documentos e imagens que o PDFTwin converte para equipes empresariais.",
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
    allTools: "Todas as ferramentas",
    pdfFrom: "De PDF",
    toPdf: "Para PDF",
    pdfOps: "Editar PDF",
    formats: "Formatos",
    pricing: "Preços",
    signIn: "Entrar",
    account: "Conta",
    upgradePro: "Atualizar para Pro",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    main: "Principal",
  },
  hero: {
    titleLead: "Um espaço de trabalho para cada",
    titleHighlight: " formato que sua empresa usa",
    description:
      "Converta PDF para Word e Excel, exporte imagens WebP, compare contratos lado a lado, combine relatórios e proteja arquivos confidenciais sem trocar de ferramenta.",
    openWorkspace: "Abrir o espaço de trabalho",
    seeFormats: "Ver formatos compatíveis",
    footnote: "O Pro adiciona limites maiores e processamento prioritário para equipes em crescimento.",
    statTools: "Ferramentas",
    statFreeLimit: "Grátis por arquivo",
    statInstall: "Instalação necessária",
  },
  toolGrid: {
    heading: "Um upload, todos os formatos empresariais",
    subheading:
      "Escolha uma ferramenta e faça upload uma vez. Alterne entre tarefas de PDF e imagem sem recomeçar.",
    categoryHints: {
      "pdf-from": "Exporte PDFs para Word, Excel, imagens ou texto simples",
      "to-pdf": "Converta documentos Word, imagens e fotos em arquivos PDF",
      "pdf-ops": "Combine, divida, gire, assine, marque com d'água, comprima e proteja PDFs",
    },
    categories: {
      "pdf-from": "PDF para outros formatos",
      "to-pdf": "Converter para PDF",
      "pdf-ops": "Trabalhar com PDFs",
    },
    subcategories: {
      documents: "Documentos",
      images: "Imagens",
      pages: "Páginas e layout",
      markup: "Marcação e assinatura",
      protect: "Otimizar e proteger",
    },
  },
  trust: [
    {
      title: "Uploads criptografados",
      description: "Cada transferência usa HTTPS — contratos e arquivos viajam com segurança.",
    },
    {
      title: "Zero armazenamento permanente",
      description: "Os arquivos são processados na memória e descartados imediatamente.",
    },
    {
      title: "Acesso instantâneo",
      description: "Sem instalação ou implantação de TI. Abra uma ferramenta e converta em segundos.",
    },
    {
      title: "Nomes globais",
      description: "Hindi, árabe, japonês e mais são preservados no download.",
    },
  ],
  formats: {
    heading: "Formatos que sua empresa já usa",
    subheading:
      "O PDFTwin cobre fluxos diários de documentos e imagens para que sua equipe pare de alternar entre ferramentas.",
    highlights: [
      "PDF → Word, Excel ou imagens",
      "Word (DOCX) → PDF pronto para clientes",
      "PNG, JPG, GIF, BMP → WebP, PNG ou JPEG",
      "Comprimir, marcar, combinar, dividir e rotacionar PDFs",
      "Comparar PDFs lado a lado com rolagem e zoom sincronizados",
      "Proteger com senha arquivos empresariais sensíveis",
    ],
    inputs: [
      { ext: "PDF", use: "Documentos, relatórios, contratos" },
      { ext: "DOCX", use: "Exportações editáveis a partir de PDF" },
      { ext: "XLSX", use: "Planilhas e dados estruturados" },
      { ext: "PNG", use: "Gráficos sem perda e capturas de tela" },
      { ext: "JPG", use: "Fotos e imagens comprimidas" },
      { ext: "WebP", use: "Imagens leves para web" },
      { ext: "GIF", use: "Gráficos simples e animações" },
      { ext: "BMP / TIFF", use: "Fluxos legados e impressão" },
    ],
  },
  pricing: {
    heading: "Preços pensados para equipes",
    subheading:
      "Comece grátis com todas as ferramentas. Atualize para o Pro quando precisar de arquivos maiores e exportações PDF ilimitadas — pagamento seguro com PayPal.",
    bestForTeams: "Ideal para equipes",
    trustFooter:
      "Pagamento confiável. O PayPal gerencia segurança, faturamento e cancelamento da assinatura.",
    faqHeading: "Perguntas sobre a assinatura",
    checkoutSuccess: "Obrigado! Sua assinatura PayPal está sendo ativada.",
    checkoutCancelled: "Pagamento cancelado. Você pode tentar novamente quando quiser.",
    freePeriod: "para sempre",
    proPeriod: "mês",
    plans: {
      free: {
        name: "Grátis",
        description: "Tudo que uma equipe pequena precisa para converter, organizar e proteger arquivos.",
        cta: "Começar grátis",
        features: [
          "Todas as ferramentas de conversão e PDF",
          `Até ${freeLimit} por arquivo`,
          `Combinar até ${FREE_MERGE_FILE_LIMIT} PDFs de uma vez`,
          `${FREE_DAILY_DOC_CONVERT_LIMIT} exportações PDF → Word ou Excel por dia`,
          "Ferramentas locais no seu dispositivo — sem upload",
          "Sem marca d'água ou conta obrigatória",
        ],
      },
      pro: {
        name: "Pro",
        description: "Para empresas que processam documentos grandes e conversões intensivas todos os dias.",
        cta: "Atualizar com PayPal",
        features: [
          "Tudo incluído no Grátis",
          `Até ${proLimit} por arquivo`,
          "Combinações PDF ilimitadas",
          "Exportações PDF → Word e Excel ilimitadas",
          "Fila de processamento prioritário",
          "Conversões em lote e ajustes salvos",
        ],
      },
    },
    faq: [
      {
        question: "Quais ferramentas rodam no meu dispositivo e quais no servidor?",
        answer:
          "Combinar, dividir, rotacionar e comparar rodam no navegador — os arquivos não saem do seu dispositivo. PDF → Word, PDF → Excel, comprimir, marca d'água, bloqueio e ferramentas de imagem usam o servidor com segurança e são excluídos ao terminar.",
      },
      {
        question: "O que acontece quando atinjo o limite diário de Word/Excel?",
        answer: `Usuários gratuitos podem exportar ${FREE_DAILY_DOC_CONVERT_LIMIT} PDFs para Word ou Excel por dia. A extração de imagens e outras ferramentas não têm limite. Atualize para o Pro para exportações ilimitadas.`,
      },
      {
        question: "Quanto custa o Pro?",
        answer:
          "O PDFTwin Pro custa US$ 9 por mês. O PayPal cobra automaticamente todo mês até você cancelar na sua conta PayPal.",
      },
    ],
  },
  footer: {
    tools: "Ferramentas",
    formats: "Formatos",
    pricing: "Preços",
    signIn: "Entrar",
    account: "Conta",
    privacy: "Privacidade",
    terms: "Termos",
    faq: "FAQ",
    resources: "Como funciona",
    blog: "Blog",
    compare: "Comparar",
    upgradePro: "Atualizar para Pro",
    note: "Os arquivos são processados na memória e nunca armazenados permanentemente. Assinaturas Pro são cobradas com segurança via PayPal — cancele quando quiser.",
    tagline: "O espaço de trabalho completo de conversão de arquivos para empresas modernas.",
  },
  tools: {
    "convert-extract": {
      name: "Conversão de documentos",
      shortLabel: "Converter",
      description: "Exporte PDFs para Word, Excel ou imagens prontas para web",
    },
    "image-convert": {
      name: "Conversão de imagens",
      shortLabel: "Imagens",
      description: "Converta PNG, JPG, GIF e BMP para WebP, PNG ou JPEG em um passo",
    },
    "images-to-pdf": {
      name: "Imagens para PDF",
      shortLabel: "Img→PDF",
      description: "Combine JPG, PNG e outras imagens em um PDF pronto para compartilhar",
    },
    "pdf-to-jpg": {
      name: "PDF para JPG",
      shortLabel: "PDF→JPG",
      description: "Exporte páginas PDF como JPG ou PNG para e-mail e apresentações",
    },
    "pdf-to-text": {
      name: "PDF para texto",
      shortLabel: "PDF→Texto",
      description: "Extraia texto selecionável de PDFs para um arquivo .txt editável",
    },
    "ocr-pdf": {
      name: "OCR — extrair texto",
      shortLabel: "OCR",
      description: "Converta PDFs digitalizados e fotos em texto editável com OCR",
    },
    "compress-pdf": {
      name: "Comprimir PDF",
      shortLabel: "Comprimir",
      description: "Reduza o tamanho do PDF para e-mail e downloads mais rápidos",
    },
    "word-to-pdf": {
      name: "Word para PDF",
      shortLabel: "Word→PDF",
      description: "Converta propostas e contratos DOCX em PDFs prontos para compartilhar",
    },
    "image-resize": {
      name: "Redimensionar imagens",
      shortLabel: "Redimensionar",
      description: "Redimensione e comprima imagens para e-mail, web e apresentações",
    },
    "pdf-compare": {
      name: "Comparar PDFs",
      shortLabel: "Comparar",
      description: "Visualize dois PDFs lado a lado com rolagem e zoom sincronizados",
    },
    "arrange-merge": {
      name: "Combinar e ordenar",
      shortLabel: "Combinar",
      description: "Una propostas, faturas e relatórios em um único PDF",
    },
    split: {
      name: "Dividir PDF",
      shortLabel: "Dividir",
      description: "Separe contratos e apresentações por intervalos de páginas",
    },
    "extract-pages": {
      name: "Extrair páginas",
      shortLabel: "Extrair",
      description: "Obtenha apenas as páginas que precisa em um novo PDF",
    },
    "remove-pages": {
      name: "Remover páginas",
      shortLabel: "Remover",
      description: "Remova páginas indesejadas de um PDF sem dividir o arquivo inteiro",
    },
    "rotate-pdf": {
      name: "Rotacionar páginas",
      shortLabel: "Rotacionar",
      description: "Rotacione todas as páginas ou páginas selecionadas em 90°, 180° ou 270°",
    },
    "watermark-pdf": {
      name: "Marca d'água PDF",
      shortLabel: "Marca",
      description: "Adicione uma marca confidencial ou rascunho em cada página",
    },
    "lock-unlock": {
      name: "Bloquear e desbloquear",
      shortLabel: "Proteger",
      description: "Proteja com senha ou remova restrições com segurança",
    },
    "sign-pdf": {
      name: "Assinar PDF",
      shortLabel: "Assinar",
      description: "Adicione sua assinatura manuscrita ou uma imagem PNG às páginas do PDF",
    },
  },
  seoLanding: {
    benefitsTitle: "Por que usar o PDFTwin",
    stepsTitle: "Como funciona",
    faqTitle: "Perguntas frequentes",
    relatedTitle: "Ferramentas relacionadas",
  },
};
