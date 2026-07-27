import { useEffect, useRef, useState } from "react";
import { ChevronDown, Eye, GitCompare, Layers, ScanSearch, Type } from "lucide-react";
import type { CompareDiffMode } from "../../services/compareDiff";

interface CompareDiffModeMenuProps {
  mode: CompareDiffMode;
  analyzing: boolean;
  labels: {
    viewerMode: string;
    diffMode: string;
    chooseMode: string;
    modeOff: string;
    modeText: string;
    modeVisual: string;
    modeOverlay: string;
  };
  onChange: (mode: CompareDiffMode) => void;
}

const MODE_OPTIONS: Array<{
  value: CompareDiffMode;
  icon: typeof Eye;
}> = [
  { value: "off", icon: Eye },
  { value: "text", icon: Type },
  { value: "visual", icon: ScanSearch },
  { value: "overlay", icon: Layers },
];

export default function CompareDiffModeMenu({
  mode,
  analyzing,
  labels,
  onChange,
}: CompareDiffModeMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const modeLabel =
    mode === "off"
      ? labels.modeOff
      : mode === "text"
        ? labels.modeText
        : mode === "visual"
          ? labels.modeVisual
          : labels.modeOverlay;

  return (
    <div className="compare-diff-menu" ref={rootRef}>
      <button
        type="button"
        className={`btn btn-sm compare-diff-toggle ${mode !== "off" ? "btn-primary" : "btn-secondary"}`}
        aria-expanded={open}
        aria-haspopup="menu"
        title={mode === "off" ? labels.viewerMode : labels.diffMode}
        onClick={() => setOpen((value) => !value)}
      >
        {mode === "off" ? <Eye size={16} /> : <GitCompare size={16} />}
        <span>{mode === "off" ? labels.viewerMode : labels.diffMode}</span>
        {analyzing && mode !== "off" ? (
          <span className="compare-diff-analyzing-dot" aria-hidden="true" />
        ) : null}
        <ChevronDown size={14} className={`compare-diff-chevron ${open ? "is-open" : ""}`} />
      </button>

      {open && (
        <div className="compare-diff-popover" role="menu">
          <p className="compare-diff-popover-label">{labels.chooseMode}</p>
          {MODE_OPTIONS.map((option) => {
            const Icon = option.icon;
            const label =
              option.value === "off"
                ? labels.modeOff
                : option.value === "text"
                  ? labels.modeText
                  : option.value === "visual"
                    ? labels.modeVisual
                    : labels.modeOverlay;

            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={mode === option.value}
                className={`compare-diff-option ${mode === option.value ? "is-active" : ""}`}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            );
          })}
          {mode !== "off" && (
            <p className="compare-diff-popover-hint">{modeLabel}</p>
          )}
        </div>
      )}
    </div>
  );
}
