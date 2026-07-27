import { createContext, useContext, type ReactNode } from "react";
import type { ToolId } from "../config/tools";

interface WorkspaceNavContextValue {
  navigateToTool: (toolId: ToolId) => void;
}

const WorkspaceNavContext = createContext<WorkspaceNavContextValue | null>(null);

export function WorkspaceNavProvider({
  navigateToTool,
  children,
}: {
  navigateToTool: (toolId: ToolId) => void;
  children: ReactNode;
}) {
  return (
    <WorkspaceNavContext.Provider value={{ navigateToTool }}>
      {children}
    </WorkspaceNavContext.Provider>
  );
}

export function useWorkspaceNav(): WorkspaceNavContextValue | null {
  return useContext(WorkspaceNavContext);
}
