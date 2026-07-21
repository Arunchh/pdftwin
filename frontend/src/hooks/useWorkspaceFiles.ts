import { useCallback, useEffect, useState } from "react";
import { getStorageAdapter } from "../adapters/storage";
import type { StagedFileRecord } from "../adapters/storage";
import { recordTrayCount } from "../stores/workspaceUsageStore";

export function useWorkspaceFiles() {
  const storage = getStorageAdapter();
  const [records, setRecords] = useState<StagedFileRecord[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const nextRecords = await storage.listFiles();
    setRecords(nextRecords);
    const nextFiles = await storage.loadAllFiles();
    setFiles(nextFiles);
    recordTrayCount(nextFiles.length);
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

  return {
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
