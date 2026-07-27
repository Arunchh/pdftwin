type Listener = () => void;

let activeToolLabel: string | null = null;
const listeners = new Set<Listener>();

export function setWorkspaceToolLabel(label: string | null) {
  activeToolLabel = label;
  listeners.forEach((listener) => listener());
}

export function getWorkspaceToolLabel(): string | null {
  return activeToolLabel;
}

export function subscribeWorkspaceToolLabel(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
