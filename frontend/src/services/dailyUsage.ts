import { FREE_DAILY_DOC_CONVERT_LIMIT } from "../config/limits";

const STORAGE_KEY = "pdftwin_doc_convert";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function readRecord(): { date: string; count: number } {
  if (typeof localStorage === "undefined") {
    return { date: todayKey(), count: 0 };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: todayKey(), count: 0 };
    const parsed = JSON.parse(raw) as { date?: string; count?: number };
    if (parsed.date !== todayKey() || typeof parsed.count !== "number") {
      return { date: todayKey(), count: 0 };
    }
    return { date: parsed.date, count: parsed.count };
  } catch {
    return { date: todayKey(), count: 0 };
  }
}

function writeRecord(count: number) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ date: todayKey(), count })
  );
}

/** Remaining PDF → Word/Excel exports today (client mirror of server cookie). */
export function remainingDocConverts(isPro: boolean): number | null {
  if (isPro) return null;
  const { count } = readRecord();
  return Math.max(0, FREE_DAILY_DOC_CONVERT_LIMIT - count);
}

export function docConvertLimitReached(isPro: boolean): boolean {
  if (isPro) return false;
  return remainingDocConverts(false) === 0;
}

export function recordDocConvert(isPro: boolean) {
  if (isPro) return;
  const { count } = readRecord();
  writeRecord(count + 1);
}

/** Sync local counter when the server reports remaining quota. */
export function syncDocConvertRemaining(remaining: number) {
  writeRecord(FREE_DAILY_DOC_CONVERT_LIMIT - remaining);
}
