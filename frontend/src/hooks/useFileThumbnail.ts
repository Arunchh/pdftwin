import { useEffect, useState } from "react";
import { pdfThumbnailDataUrl } from "../services/pdfJsClient";
import { fileKey, isImageFile, isPdfFile } from "../utils/files";

const thumbnailCache = new Map<string, string>();

export function useFileThumbnail(file: File | undefined) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) {
      setThumbnailUrl(null);
      return;
    }

    const key = fileKey(file);
    const cached = thumbnailCache.get(key);
    if (cached) {
      setThumbnailUrl(cached);
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;

    const load = async () => {
      setLoading(true);
      try {
        if (isImageFile(file)) {
          objectUrl = URL.createObjectURL(file);
          if (!cancelled) {
            thumbnailCache.set(key, objectUrl);
            setThumbnailUrl(objectUrl);
          }
          return;
        }

        if (isPdfFile(file)) {
          const dataUrl = await pdfThumbnailDataUrl(file);
          if (!cancelled) {
            thumbnailCache.set(key, dataUrl);
            setThumbnailUrl(dataUrl);
          }
          return;
        }

        if (!cancelled) setThumbnailUrl(null);
      } catch {
        if (!cancelled) setThumbnailUrl(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
      if (objectUrl && !thumbnailCache.has(key)) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file]);

  return { thumbnailUrl, loading };
}
