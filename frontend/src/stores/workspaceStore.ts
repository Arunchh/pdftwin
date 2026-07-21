export interface StagedFileRecord {
  id: string;
  name: string;
  size: number;
  type: string;
  addedAt: number;
}

const DB_NAME = "pdftwin_workspace";
const DB_VERSION = 1;
const META_STORE = "meta";
const BLOB_STORE = "blobs";
const WORKSPACE_EVENT = "pdftwin:workspace";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(BLOB_STORE)) {
        db.createObjectStore(BLOB_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB open failed."));
  });
}

function notifyWorkspaceChange() {
  window.dispatchEvent(new Event(WORKSPACE_EVENT));
}

export function subscribeWorkspace(callback: () => void) {
  window.addEventListener(WORKSPACE_EVENT, callback);
  return () => window.removeEventListener(WORKSPACE_EVENT, callback);
}

export async function listStagedFiles(): Promise<StagedFileRecord[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(META_STORE, "readonly");
    const store = tx.objectStore(META_STORE);
    const request = store.getAll();
    request.onsuccess = () => {
      const rows = (request.result as StagedFileRecord[]).sort((a, b) => b.addedAt - a.addedAt);
      resolve(rows);
    };
    request.onerror = () => reject(request.error ?? new Error("Could not list workspace files."));
  });
}

export async function addStagedFile(file: File): Promise<StagedFileRecord> {
  const db = await openDb();
  const id = crypto.randomUUID();
  const record: StagedFileRecord = {
    id,
    name: file.name,
    size: file.size,
    type: file.type,
    addedAt: Date.now(),
  };

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([META_STORE, BLOB_STORE], "readwrite");
    tx.objectStore(META_STORE).put(record);
    tx.objectStore(BLOB_STORE).put({ id, blob: file });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Could not save file."));
  });

  notifyWorkspaceChange();
  return record;
}

export async function removeStagedFile(id: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([META_STORE, BLOB_STORE], "readwrite");
    tx.objectStore(META_STORE).delete(id);
    tx.objectStore(BLOB_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Could not remove file."));
  });
  notifyWorkspaceChange();
}

export async function clearStagedFiles(): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([META_STORE, BLOB_STORE], "readwrite");
    tx.objectStore(META_STORE).clear();
    tx.objectStore(BLOB_STORE).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Could not clear workspace."));
  });
  notifyWorkspaceChange();
}

export async function stagedFileToFile(record: StagedFileRecord): Promise<File> {
  const db = await openDb();
  const blobEntry = await new Promise<{ id: string; blob: Blob } | undefined>((resolve, reject) => {
    const tx = db.transaction(BLOB_STORE, "readonly");
    const request = tx.objectStore(BLOB_STORE).get(record.id);
    request.onsuccess = () => resolve(request.result as { id: string; blob: Blob } | undefined);
    request.onerror = () => reject(request.error ?? new Error("Could not read file."));
  });

  if (!blobEntry) {
    throw new Error("File data missing from workspace.");
  }

  return new File([blobEntry.blob], record.name, {
    type: record.type || blobEntry.blob.type || "application/octet-stream",
  });
}

export async function loadWorkspaceFiles(): Promise<File[]> {
  const records = await listStagedFiles();
  const files: File[] = [];
  for (const record of records) {
    try {
      files.push(await stagedFileToFile(record));
    } catch {
      await removeStagedFile(record.id);
    }
  }
  return files;
}

export async function syncWorkspaceFiles(files: File[]): Promise<void> {
  await clearStagedFiles();
  for (const file of files) {
    await addStagedFile(file);
  }
}
