export const FREE_FILE_LIMIT_MB = 50;
export const PRO_FILE_LIMIT_MB = 200;

/** Free-plan PDF → Word / Excel exports per calendar day (server-enforced). */
export const FREE_DAILY_DOC_CONVERT_LIMIT = 3;

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
