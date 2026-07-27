import { useCallback, useEffect, useState } from "react";
import { getStorageAdapter } from "../adapters/storage";
import type { StagedFileRecord, WorkspaceEntry } from "../adapters/storage";
import { recordTrayCount } from "../stores/workspaceUsageStore";

export function useWorkspaceFiles() {
  const storage = getStorageAdapter();
  const [entries, setEntries] = useState<WorkspaceEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const nextEntries = await storage.loadEntries();
    setEntries(nextEntries);
    recordTrayCount(nextEntries.length);
    setLoading(false);
  }, [storage]);

  useEffect(() => {
    refresh();
    return storage.subscribe(() => {
      refresh();
    });
  }, [refresh, storage]);

  const addFiles = useCallback(
    async (incoming: File[]) => {
      for (const file of incoming) {
        await storage.addFile(file);
      }
    },
    [storage]
  );

  const replaceFiles = useCallback(
    async (incoming: File[]) => {
      await storage.clearAll();
      for (const file of incoming) {
        await storage.addFile(file);
      }
    },
    [storage]
  );

  const removeFile = useCallback(
    async (id: string) => {
      await storage.removeFile(id);
    },
    [storage]
  );

  const clearAll = useCallback(async () => {
    await storage.clearAll();
  }, [storage]);

  const files = entries.map((entry) => entry.file);
  const records: StagedFileRecord[] = entries.map((entry) => entry.record);

  return {
    entries,
    records,
    files,
    loading,
    addFiles,
    replaceFiles,
    removeFile,
    clearAll,
    refresh,
  };
}
