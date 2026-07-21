import { useSyncExternalStore } from "react";
import type { AuthUser } from "../adapters/auth/types";

const STORAGE_KEY = "pdftwin_auth";
const AUTH_EVENT = "pdftwin:auth";

export interface AuthSnapshot {
  user: AuthUser | null;
}

/** Stable empty snapshot — must be reused (React 19 useSyncExternalStore requirement). */
const EMPTY_SNAPSHOT: AuthSnapshot = { user: null };

/** Cached server snapshot for SSR / hydration. */
const SERVER_SNAPSHOT: AuthSnapshot = EMPTY_SNAPSHOT;

let cachedSnapshot: AuthSnapshot = EMPTY_SNAPSHOT;
let cachedStorageValue: string | null | undefined;

function snapshotFromUser(user: AuthUser | null): AuthSnapshot {
  if (!user) {
    return EMPTY_SNAPSHOT;
  }

  const current = cachedSnapshot.user;
  if (
    current &&
    current.id === user.id &&
    current.email === user.email &&
    current.plan === user.plan
  ) {
    return cachedSnapshot;
  }

  cachedSnapshot = { user };
  return cachedSnapshot;
}

function invalidateSnapshotCache() {
  cachedStorageValue = undefined;
}

export function readSession(): AuthSnapshot {
  if (typeof localStorage === "undefined") {
    return SERVER_SNAPSHOT;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === cachedStorageValue) {
      return cachedSnapshot;
    }

    cachedStorageValue = raw;

    if (!raw) {
      cachedSnapshot = EMPTY_SNAPSHOT;
      return cachedSnapshot;
    }

    const parsed = JSON.parse(raw) as { user: AuthUser | null };
    cachedSnapshot = snapshotFromUser(parsed.user ?? null);
    return cachedSnapshot;
  } catch {
    cachedStorageValue = null;
    cachedSnapshot = EMPTY_SNAPSHOT;
    return cachedSnapshot;
  }
}

export function writeSession(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user }));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
  invalidateSnapshotCache();
  window.dispatchEvent(new Event(AUTH_EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(AUTH_EVENT, callback);
  return () => window.removeEventListener(AUTH_EVENT, callback);
}

function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export function useAuthSession() {
  return useSyncExternalStore(subscribe, readSession, getServerSnapshot);
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
