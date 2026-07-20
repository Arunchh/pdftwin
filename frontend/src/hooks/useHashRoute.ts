import { useCallback, useEffect, useState } from "react";
import type { ToolId } from "../config/tools";
import { toolByHash, toolById } from "../config/tools";

const DEFAULT_TOOL: ToolId = "convert-extract";

function parseHash(): { tool: ToolId; section: "tools" | "pricing" | "home" } {
  const raw = window.location.hash.replace(/^#/, "").toLowerCase();

  if (!raw || raw === "home") {
    return { tool: DEFAULT_TOOL, section: "home" };
  }

  if (raw === "pricing") {
    return { tool: DEFAULT_TOOL, section: "pricing" };
  }

  const matched = toolByHash(raw);
  if (matched) {
    return { tool: matched.id, section: "tools" };
  }

  return { tool: DEFAULT_TOOL, section: "tools" };
}

export function useHashRoute() {
  const [route, setRoute] = useState(parseHash);

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const selectTool = useCallback((toolId: ToolId) => {
    const hash = toolById(toolId).hash;
    window.location.hash = hash;
    setRoute({ tool: toolId, section: "tools" });
  }, []);

  const goHome = useCallback(() => {
    window.location.hash = "";
    setRoute({ tool: DEFAULT_TOOL, section: "home" });
  }, []);

  const goPricing = useCallback(() => {
    window.location.hash = "pricing";
    setRoute({ tool: DEFAULT_TOOL, section: "pricing" });
  }, []);

  return { ...route, selectTool, goHome, goPricing };
}
