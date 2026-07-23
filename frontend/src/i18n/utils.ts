import {
  COUNTRY_LOCALE,
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  NON_DEFAULT_LOCALES,
} from "./config";
import { getMessages } from "./locales";
import type { Locale } from "./types";

export { DEFAULT_LOCALE, LOCALES, LOCALE_LABELS, LOCALE_COOKIE, NON_DEFAULT_LOCALES } from "./config";
export type { Locale, Messages } from "./types";
export { getMessages };

const LOCALE_PREFIX_RE = new RegExp(`^/(${NON_DEFAULT_LOCALES.join("|")})(/|$)`);

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "es" || value === "fr" || value === "nl";
}

export function getLocaleFromPathname(pathname: string): Locale {
  const match = pathname.match(LOCALE_PREFIX_RE);
  if (match?.[1] && isLocale(match[1])) return match[1];
  return DEFAULT_LOCALE;
}

export function stripLocalePrefix(pathname: string): string {
  const normalized = pathname.replace(/\/+$/, "") || "/";

  for (const locale of NON_DEFAULT_LOCALES) {
    if (normalized === `/${locale}`) return "/";
    if (normalized.startsWith(`/${locale}/`)) {
      const rest = normalized.slice(`/${locale}`.length);
      return rest.startsWith("/") ? rest : `/${rest}`;
    }
  }

  return normalized;
}

const LOCALIZED_PREFIXES = ["/pricing", "/formats", "/tools", "/guides"];

export function isLocalizablePath(pathname: string): boolean {
  const base = stripLocalePrefix(pathname.replace(/\/+$/, "") || "/");
  if (base === "/") return true;
  return LOCALIZED_PREFIXES.some(
    (prefix) => base === prefix || base.startsWith(`${prefix}/`)
  );
}

export function localizePath(path: string, locale: Locale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = stripLocalePrefix(normalized.replace(/\/+$/, "") || "/");

  if (locale === DEFAULT_LOCALE) {
    return base;
  }

  if (!isLocalizablePath(base)) {
    return base;
  }

  if (base === "/") return `/${locale}`;
  return `/${locale}${base}`;
}

export function parseAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return DEFAULT_LOCALE;

  const candidates = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? Number(qParam.split("=")[1]) : 1;
      const primary = tag.trim().toLowerCase().split("-")[0];
      return { primary, q: Number.isFinite(q) ? q : 0 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { primary } of candidates) {
    if (primary === "es" || primary === "fr" || primary === "nl") return primary;
    if (primary === "en") return DEFAULT_LOCALE;
  }

  return DEFAULT_LOCALE;
}

export function detectLocaleFromRequest(
  pathname: string,
  acceptLanguage: string | null | undefined,
  country: string | null | undefined,
  cookieHeader: string | null | undefined
): Locale {
  const cookieLocale = readLocaleCookie(cookieHeader);
  if (cookieLocale) return cookieLocale;

  const pathLocale = getLocaleFromPathname(pathname);
  if (pathLocale !== DEFAULT_LOCALE) return pathLocale;

  if (country === "BE") {
    return parseAcceptLanguage(acceptLanguage);
  }

  if (country && COUNTRY_LOCALE[country.toUpperCase()]) {
    return COUNTRY_LOCALE[country.toUpperCase()];
  }

  return parseAcceptLanguage(acceptLanguage);
}

export function readLocaleCookie(cookieHeader: string | null | undefined): Locale | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${LOCALE_COOKIE}=([^;]+)`));
  const value = match?.[1]?.trim();
  return value && isLocale(value) ? value : null;
}

export function localeCookieValue(locale: Locale): string {
  return `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function hreflangAlternates(pathname: string): Array<{ locale: Locale; href: string }> {
  const basePath = stripLocalePrefix(pathname);
  const origin = "https://pdftwin.com";
  return (["en", "es", "fr", "nl"] as Locale[]).map((locale) => ({
    locale,
    href: `${origin}${localizePath(basePath, locale)}`,
  }));
}

export function t(locale: Locale) {
  return getMessages(locale);
}
