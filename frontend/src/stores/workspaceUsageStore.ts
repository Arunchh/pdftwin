import type { ToolId } from "../config/tools";
import { toolById } from "../config/tools";

const STORAGE_KEY = "pdftwin_workspace_usage";

export interface WorkspaceUsage {
  filesInTray: number;
  lastToolId: ToolId | null;
  lastToolLabel: string | null;
  lastActiveAt: string | null;
}

const EMPTY_USAGE: WorkspaceUsage = {
  filesInTray: 0,
  lastToolId: null,
  lastToolLabel: null,
  lastActiveAt: null,
};

export function readWorkspaceUsage(): WorkspaceUsage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_USAGE;
    return { ...EMPTY_USAGE, ...(JSON.parse(raw) as WorkspaceUsage) };
  } catch {
    return EMPTY_USAGE;
  }
}

export function recordToolVisit(toolId: ToolId) {
  const tool = toolById(toolId);
  const current = readWorkspaceUsage();
  writeWorkspaceUsage({
    ...current,
    lastToolId: toolId,
    lastToolLabel: tool.name,
    lastActiveAt: new Date().toISOString(),
  });
}

export function recordTrayCount(count: number) {
  const current = readWorkspaceUsage();
  writeWorkspaceUsage({ ...current, filesInTray: count });
}

function writeWorkspaceUsage(usage: WorkspaceUsage) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
}
