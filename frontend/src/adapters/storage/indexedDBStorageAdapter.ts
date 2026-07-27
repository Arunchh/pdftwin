import type { StorageAdapter } from "./types";
import {
  addStagedFile,
  clearStagedFiles,
  listStagedFiles,
  loadWorkspaceEntries,
  loadWorkspaceFiles,
  removeStagedFile,
  stagedFileToFile,
  subscribeWorkspace,
} from "../../stores/workspaceStore";

export const indexedDBStorageAdapter: StorageAdapter = {
  listFiles: listStagedFiles,
  addFile: addStagedFile,
  removeFile: removeStagedFile,
  clearAll: clearStagedFiles,
  getFile: stagedFileToFile,
  loadAllFiles: loadWorkspaceFiles,
  loadEntries: loadWorkspaceEntries,
  subscribe: subscribeWorkspace,
};

export type { StorageAdapter, StagedFileRecord, WorkspaceEntry } from "./types";
