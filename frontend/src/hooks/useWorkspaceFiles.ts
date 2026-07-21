import { useCallback, useEffect, useState } from "react";
import {
  addStagedFile,
  clearStagedFiles,
  listStagedFiles,
  loadWorkspaceFiles,
  removeStagedFile,
  subscribeWorkspace,
  type StagedFileRecord,
} from "../stores/workspaceStore";

export function useWorkspaceFiles() {
  const [records, setRecords] = useState<StagedFileRecord[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const nextRecords = await listStagedFiles();
    setRecords(nextRecords);
    const nextFiles = await loadWorkspaceFiles();
    setFiles(nextFiles);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    return subscribeWorkspace(() => {
      refresh();
    });
  }, [refresh]);

  const addFiles = useCallback(async (incoming: File[]) => {
    for (const file of incoming) {
      await addStagedFile(file);
    }
  }, []);

  const replaceFiles = useCallback(async (incoming: File[]) => {
    await clearStagedFiles();
    for (const file of incoming) {
      await addStagedFile(file);
    }
  }, []);

  const removeFile = useCallback(async (id: string) => {
    await removeStagedFile(id);
  }, []);

  const clearAll = useCallback(async () => {
    await clearStagedFiles();
  }, []);

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
