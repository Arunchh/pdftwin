export function parseAcceptExtensions(accept: string): string[] {
  return accept
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)
    .map((part) => (part.startsWith(".") ? part : `.${part}`));
}

export function fileExtension(name: string): string {
  const lower = name.toLowerCase();
  return lower.includes(".") ? `.${lower.split(".").pop()}` : "";
}

export function fileMatchesAccept(file: File, accept: string): boolean {
  const allowed = parseAcceptExtensions(accept);
  const ext = fileExtension(file.name);
  return allowed.includes(ext);
}

export function acceptLabel(accept: string): string {
  return parseAcceptExtensions(accept)
    .map((ext) => ext.replace(/^\./, "").toUpperCase())
    .join(", ");
}
