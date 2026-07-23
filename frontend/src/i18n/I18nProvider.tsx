import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Locale, Messages } from "./types";
import { DEFAULT_LOCALE } from "./config";
import { getMessages, localizePath, resolvePageLocale } from "./utils";

interface I18nContextValue {
  locale: Locale;
  messages: Messages;
  localizePath: (path: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  messages: getMessages(DEFAULT_LOCALE),
  localizePath: (path) => path,
});

interface I18nProviderProps {
  locale?: Locale;
  children: ReactNode;
}

export function I18nProvider({ locale = DEFAULT_LOCALE, children }: I18nProviderProps) {
  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      messages: getMessages(locale),
      localizePath: (path: string) => localizePath(path, locale),
    }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  const locale = resolvePageLocale(context.locale);

  return useMemo<I18nContextValue>(
    () => ({
      locale,
      messages: getMessages(locale),
      localizePath: (path: string) => localizePath(path, locale),
    }),
    [locale]
  );
}
