import type { Locale } from "../types";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { nl } from "./nl";
import { pt } from "./pt";

export const MESSAGES = { en, es, fr, nl, pt } as const;

export function getMessages(locale: Locale) {
  return MESSAGES[locale] ?? MESSAGES.en;
}
