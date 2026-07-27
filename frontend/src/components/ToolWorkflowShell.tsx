import type { ReactNode } from "react";

export interface WorkflowStepDef {
  label: string;
  icon?: ReactNode;
  optional?: boolean;
  active: boolean;
}

interface ToolWorkflowShellProps {
  steps: WorkflowStepDef[];
  children: ReactNode;
  emptyState?: ReactNode;
  showContent: boolean;
}

export default function ToolWorkflowShell({
  steps,
  children,
  emptyState,
  showContent,
}: ToolWorkflowShellProps) {
  return (
    <>
      <div className="workflow-rail">
        {steps.flatMap((step, index) => {
          const nodes: ReactNode[] = [];
          if (index > 0) {
            nodes.push(<span key={`connector-${index}`} className="workflow-connector" aria-hidden="true" />);
          }
          nodes.push(
            <div
              key={`step-${index}`}
              className={`workflow-step ${step.active ? "active" : ""}`}
            >
              <span className="workflow-step-number">{index + 1}</span>
              {step.icon}
              <span>{step.label}</span>
              {step.optional && <span className="workflow-step-tag">Optional</span>}
            </div>
          );
          return nodes;
        })}
      </div>
      {showContent ? children : emptyState}
    </>
  );
}
