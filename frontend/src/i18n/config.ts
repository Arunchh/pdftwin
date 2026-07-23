import type { Locale } from "./types";

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALES: Locale[] = ["en", "es", "fr", "nl"];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  nl: "Nederlands",
};

export const LOCALE_HTML_LANG: Record<Locale, string> = {
  en: "en",
  es: "es",
  fr: "fr",
  nl: "nl",
};

export const LOCALE_OG: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
  nl: "nl_NL",
};

/** Strong geo signals → locale (used by edge middleware). */
export const COUNTRY_LOCALE: Record<string, Locale> = {
  ES: "es",
  MX: "es",
  AR: "es",
  CO: "es",
  CL: "es",
  PE: "es",
  VE: "es",
  EC: "es",
  GT: "es",
  CU: "es",
  BO: "es",
  DO: "es",
  HN: "es",
  PY: "es",
  SV: "es",
  NI: "es",
  CR: "es",
  PA: "es",
  UY: "es",
  PR: "es",
  FR: "fr",
  GF: "fr",
  GP: "fr",
  MQ: "fr",
  RE: "fr",
  NC: "fr",
  LU: "fr",
  MC: "fr",
  SN: "fr",
  CI: "fr",
  CM: "fr",
  MA: "fr",
  DZ: "fr",
  TN: "fr",
  NL: "nl",
  AW: "nl",
  SR: "nl",
};

/** Belgium: prefer Accept-Language between fr and nl. */
export const LOCALE_COOKIE = "pdftwin_locale";

export const NON_DEFAULT_LOCALES = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);
