import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe2 } from "lucide-react";
import { LOCALE_LABELS, LOCALES, LOCALE_COOKIE } from "./config";
import type { Locale } from "./types";
import { useI18n } from "./I18nProvider";
import { resolveLocaleSwitchPath } from "./seoLandings";

function setLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export default function LanguageSwitcher({ variant = "header" }: { variant?: "header" | "nav" }) {
  const { locale, messages } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const switchLocale = (nextLocale: Locale) => {
    setLocaleCookie(nextLocale);
    const target = resolveLocaleSwitchPath(window.location.pathname, nextLocale);
    const suffix = window.location.search + window.location.hash;
    window.location.assign(`${target}${suffix}`);
  };

  return (
    <div className={`language-switcher language-switcher--${variant}`} ref={rootRef}>
      <button
        type="button"
        className="language-switcher-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={messages.language.label}
        onClick={() => setOpen((value) => !value)}
      >
        <Globe2 size={16} aria-hidden="true" />
        <span>{LOCALE_LABELS[locale]}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>

      {open && (
        <ul className="language-switcher-menu" role="listbox" aria-label={messages.language.label}>
          {LOCALES.map((option) => (
            <li key={option}>
              <button
                type="button"
                role="option"
                aria-selected={option === locale}
                className={option === locale ? "active" : undefined}
                onClick={() => switchLocale(option)}
              >
                {LOCALE_LABELS[option]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
