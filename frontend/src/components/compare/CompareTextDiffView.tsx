import type { TextDiffSide } from "../../services/compareDiff";

function renderSegments(segments: TextDiffSide["segments"]) {
  return segments.map((segment, index) => {
    if (segment.type === "equal") {
      return <span key={index}>{segment.text}</span>;
    }
    if (segment.type === "delete") {
      return (
        <mark key={index} className="compare-diff-delete">
          {segment.text}
        </mark>
      );
    }
    return (
      <mark key={index} className="compare-diff-insert">
        {segment.text}
      </mark>
    );
  });
}

export default function CompareTextDiffView({
  side,
  title,
  emptyLabel,
}: {
  side: TextDiffSide | null;
  title: string;
  emptyLabel: string;
}) {
  const hasContent = side?.segments.some((segment) => segment.text.trim().length > 0);

  return (
    <div className="compare-text-diff-pane">
      <div className="compare-text-diff-pane-title">{title}</div>
      <pre className="compare-text-diff-body">
        {hasContent ? renderSegments(side!.segments) : <span className="muted">{emptyLabel}</span>}
      </pre>
    </div>
  );
}
