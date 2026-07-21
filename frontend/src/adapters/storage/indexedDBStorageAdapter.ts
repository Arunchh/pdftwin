import type { StorageAdapter, StagedFileRecord } from "./types";
import {
  addStagedFile,
  clearStagedFiles,
  listStagedFiles,
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
  subscribe: subscribeWorkspace,
};

export type { StagedFileRecord };
