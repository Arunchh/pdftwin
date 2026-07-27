import { useCallback, useState } from "react";
import { responseToFile } from "../api";
import type { ToolResult } from "../types/toolResult";

export function useToolResult() {
  const [result, setResult] = useState<ToolResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearResult = useCallback(() => setResult(null), []);
  const clearError = useCallback(() => setError(null), []);

  const clearFeedback = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  const setResultFromResponse = useCallback(
    async (response: Response, fallbackName: string, meta: Pick<ToolResult, "title" | "detail">) => {
      const file = await responseToFile(response, fallbackName);
      setResult({
        blob: file,
        filename: file.name,
        title: meta.title,
        detail: meta.detail,
      });
      setError(null);
    },
    []
  );

  const setResultFromBlob = useCallback(
    (blob: Blob, filename: string, meta: Pick<ToolResult, "title" | "detail">) => {
      setResult({
        blob,
        filename,
        title: meta.title,
        detail: meta.detail,
      });
      setError(null);
    },
    []
  );

  return {
    result,
    error,
    setError,
    setResult,
    setResultFromResponse,
    setResultFromBlob,
    clearResult,
    clearError,
    clearFeedback,
  };
}
