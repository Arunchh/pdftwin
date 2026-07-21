import { getAuthHeaders } from "./stores/authStore";

export interface UploadedFileInfo {
  filename: string;
  size: number;
  type: string;
}

/**
 * Parse RFC 5987 / RFC 2616 Content-Disposition filenames.
 * Prefers UTF-8 filename* values so Hindi, Arabic, Greek, Japanese, Russian, etc. are preserved.
 */
export function parseContentDispositionFilename(
  disposition: string,
  fallback: string
): string {
  if (!disposition) return fallback;

  const utf8Part = disposition.match(/filename\*\s*=\s*([^;]+)/i);
  if (utf8Part) {
    const raw = utf8Part[1].trim().replace(/^"(.*)"$/, "$1");
    const encoded =
      raw.match(/^(?:[A-Za-z0-9._-]+)'[^']*'(.*)$/)?.[1] ?? raw.replace(/^UTF-8''/i, "");

    try {
      const decoded = decodeURIComponent(encoded);
      if (decoded) return decoded;
    } catch {
      // Fall back to ASCII filename below.
    }
  }

  const quoted = disposition.match(/filename\s*=\s*"([^"]*)"/i);
  if (quoted?.[1]) return quoted[1];

  const plain = disposition.match(/filename\s*=\s*([^;]+)/i);
  if (plain?.[1]) return plain[1].trim().replace(/^"(.*)"$/, "$1");

  return fallback;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export async function responseToFile(
  response: Response,
  fallbackName: string
): Promise<File> {
  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition") ?? "";
  const filename = parseContentDispositionFilename(disposition, fallbackName);
  const type = blob.type || "application/octet-stream";
  return new File([blob], filename, { type });
}

export async function downloadResponse(response: Response, fallbackName: string) {
  const file = await responseToFile(response, fallbackName);
  downloadBlob(file, file.name);
}

export async function postFiles(
  endpoint: string,
  files: File[],
  extraFields?: Record<string, string>
): Promise<Response> {
  const formData = new FormData();
  const fieldName = files.length > 1 ? "files" : "file";

  files.forEach((file) => formData.append(fieldName, file));

  if (extraFields) {
    Object.entries(extraFields).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  return fetch(endpoint, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });
}
