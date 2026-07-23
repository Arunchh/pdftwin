import { DEFAULT_LOCALE, NON_DEFAULT_LOCALES } from "./frontend/src/i18n/config";
import { getSeoLanding, getSeoLandingForTool, seoLandingPath } from "./frontend/src/i18n/seoLandings";
import { detectLocaleFromRequest, localizePath, stripLocalePrefix } from "./frontend/src/i18n/utils";

export const config = {
  matcher: ["/((?!api|_astro|favicon\\.svg|apple-touch-icon\\.svg|og-image\\.svg|robots\\.txt|sitemap\\.xml|.*\\..*).*)"],
};

function hasLocalePrefix(pathname: string): boolean {
  return NON_DEFAULT_LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
}

export default function middleware(request: Request) {
  const url = new URL(request.url);

  if (hasLocalePrefix(url.pathname)) {
    return;
  }

  const cookie = request.headers.get("cookie");
  if (cookie?.includes("pdftwin_locale=")) {
    return;
  }

  const country = request.headers.get("x-vercel-ip-country");
  const acceptLanguage = request.headers.get("accept-language");
  const detected = detectLocaleFromRequest(url.pathname, acceptLanguage, country, cookie);

  const guideMatch = url.pathname.match(/^\/guides\/([^/]+)\/?$/);
  if (guideMatch && detected !== DEFAULT_LOCALE) {
    const enLanding = getSeoLanding("en", guideMatch[1]);
    if (enLanding) {
      const localized = getSeoLandingForTool(detected, enLanding.toolId);
      if (localized) {
        const redirectUrl = new URL(seoLandingPath(localized), url);
        redirectUrl.search = url.search;
        return Response.redirect(redirectUrl, 307);
      }
    }
    return;
  }

  if (guideMatch) {
    return;
  }

  if (detected === DEFAULT_LOCALE) {
    return;
  }

  const targetPath = localizePath(stripLocalePrefix(url.pathname), detected);
  if (targetPath === url.pathname) {
    return;
  }

  const redirectUrl = new URL(targetPath, url);
  redirectUrl.search = url.search;
  return Response.redirect(redirectUrl, 307);
}
