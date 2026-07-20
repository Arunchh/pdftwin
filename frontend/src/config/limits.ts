export const FREE_FILE_LIMIT_MB = 30;
export const PRO_FILE_LIMIT_MB = 200;

export const FREE_FILE_LIMIT_BYTES = FREE_FILE_LIMIT_MB * 1024 * 1024;
export const PRO_FILE_LIMIT_BYTES = PRO_FILE_LIMIT_MB * 1024 * 1024;

export function formatFileLimit(mb: number): string {
  return `${mb} MB`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
