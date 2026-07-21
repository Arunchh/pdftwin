import { indexedDBStorageAdapter } from "./indexedDBStorageAdapter";
import type { StorageAdapter } from "./types";

/** Swap to a Supabase-backed adapter when cloud workspace is ready. */
export function getStorageAdapter(): StorageAdapter {
  return indexedDBStorageAdapter;
}

export type { StorageAdapter, StagedFileRecord } from "./types";
