export interface StagedFileRecord {
  id: string;
  name: string;
  size: number;
  type: string;
  addedAt: number;
}

export interface StorageAdapter {
  listFiles(): Promise<StagedFileRecord[]>;
  addFile(file: File): Promise<StagedFileRecord>;
  removeFile(id: string): Promise<void>;
  clearAll(): Promise<void>;
  getFile(record: StagedFileRecord): Promise<File>;
  loadAllFiles(): Promise<File[]>;
  subscribe(callback: () => void): () => void;
}
