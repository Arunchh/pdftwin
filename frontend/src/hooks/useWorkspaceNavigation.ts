import { useCallback, useEffect, useState } from "react";
import type { ToolId } from "../config/tools";
import { toolById, toolIdFromPath, toolPath } from "../config/tools";
import { useI18n } from "../i18n/I18nProvider";

export function useWorkspaceNavigation(initialToolId: ToolId | null) {
  const { locale, messages } = useI18n();
  const [activeToolId, setActiveToolId] = useState<ToolId | null>(initialToolId);

  const syncDocumentMeta = useCallback(
    (toolId: ToolId) => {
      const copy = messages.tools[toolId];
      if (copy) {
        document.title = `${copy.name} | ${messages.meta.toolTitleSuffix}`;
      }
    },
    [messages]
  );

  const navigateToTool = useCallback(
    (toolId: ToolId) => {
      if (toolId === activeToolId) return;

      const path = toolPath(toolId, locale);
      window.history.pushState({ toolId }, "", path);
      setActiveToolId(toolId);
      syncDocumentMeta(toolId);

      const workspace = document.getElementById("workspace");
      if (workspace) {
        workspace.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [activeToolId, locale, syncDocumentMeta]
  );

  useEffect(() => {
    setActiveToolId(initialToolId);
    if (initialToolId) {
      syncDocumentMeta(initialToolId);
    }
  }, [initialToolId, syncDocumentMeta]);

  useEffect(() => {
    const onPopState = () => {
      const fromPath = toolIdFromPath(window.location.pathname, locale);
      if (fromPath) {
        setActiveToolId(fromPath);
        syncDocumentMeta(fromPath);
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [locale, syncDocumentMeta]);

  const activeTool = activeToolId ? toolById(activeToolId) : null;

  return {
    activeToolId,
    activeTool,
    navigateToTool,
  };
}
