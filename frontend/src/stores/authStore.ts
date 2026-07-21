import { useSyncExternalStore } from "react";
import type { AuthUser } from "../adapters/auth/types";

const STORAGE_KEY = "pdftwin_auth";
const AUTH_EVENT = "pdftwin:auth";

export function readSession(): { user: AuthUser | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null };
    const parsed = JSON.parse(raw) as { user: AuthUser | null };
    return { user: parsed.user ?? null };
  } catch {
    return { user: null };
  }
}

export function writeSession(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user }));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
  window.dispatchEvent(new Event(AUTH_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(AUTH_EVENT, callback);
  return () => window.removeEventListener(AUTH_EVENT, callback);
}

export function useAuthSession() {
  return useSyncExternalStore(subscribe, () => readSession(), () => ({ user: null }));
}

export function getAuthHeaders(): Record<string, string> {
  const { user } = readSession();
  if (!user) {
    return { "X-PDFTwin-Plan": "free" };
  }
  return {
    "X-PDFTwin-Plan": user.plan,
    "X-PDFTwin-User-Id": user.id,
  };
}
