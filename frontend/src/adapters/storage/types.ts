export interface StagedFileRecord {
  id: string;
  name: string;
  size: number;
  type: string;
  addedAt: number;
}

export interface WorkspaceEntry {
  record: StagedFileRecord;
  file: File;
}

export interface StorageAdapter {
  listFiles(): Promise<StagedFileRecord[]>;
  addFile(file: File): Promise<StagedFileRecord>;
  removeFile(id: string): Promise<void>;
  clearAll(): Promise<void>;
  getFile(record: StagedFileRecord): Promise<File>;
  loadAllFiles(): Promise<File[]>;
  loadEntries(): Promise<WorkspaceEntry[]>;
  subscribe(callback: () => void): () => void;
}
