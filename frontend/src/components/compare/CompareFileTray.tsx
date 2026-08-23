import { ArrowLeftRight, Columns2 } from "lucide-react";
import { formatFileLimit } from "../../config/limits";
import { useI18n } from "../../i18n/I18nProvider";
import CompareFileSlot from "./CompareFileSlot";

interface CompareFileTrayProps {
  leftFile: File | null;
  rightFile: File | null;
  onLeftFileChange: (file: File | null) => void;
  onRightFileChange: (file: File | null) => void;
  onSwap: () => void;
  onCompare: () => void;
  canCompare: boolean;
  compareLoading: boolean;
  fileLimitMb: number;
  entitlementsLabel: string;
  isPro: boolean;
}

export default function CompareFileTray({
  leftFile,
  rightFile,
  onLeftFileChange,
  onRightFileChange,
  onSwap,
  onCompare,
  canCompare,
  compareLoading,
  fileLimitMb,
  entitlementsLabel,
  isPro,
}: CompareFileTrayProps) {
  const { messages } = useI18n();
  const copy = messages.compare;

  const bothFilesSelected = Boolean(leftFile && rightFile);

  return (
    <aside className="workspace-files-column compare-file-tray">
      <div className="compare-file-tray-header">
        <h3>
          <Columns2 size={18} aria-hidden="true" />
          {copy.fileTrayTitle}
        </h3>
        <p className="description">{copy.fileTrayDescription}</p>
        <span className={`workspace-limit ${isPro ? "workspace-limit--pro" : ""}`}>
          {entitlementsLabel} · up to {formatFileLimit(fileLimitMb)} per file
        </span>
      </div>

      <div className="compare-file-tray-slots">
        <CompareFileSlot
          label={copy.leftSlotLabel}
          file={leftFile}
          placeholder={copy.leftSlotPlaceholder}
          browseLabel={copy.browsePdf}
          emptyHint={copy.slotEmptyHint}
          removeLabel={copy.remove}
          onFileChange={onLeftFileChange}
        />

        <CompareFileSlot
          label={copy.rightSlotLabel}
          file={rightFile}
          placeholder={copy.rightSlotPlaceholder}
          browseLabel={copy.browsePdf}
          emptyHint={copy.slotEmptyHint}
          removeLabel={copy.remove}
          onFileChange={onRightFileChange}
        />
      </div>

      <button
        type="button"
        className="btn btn-primary compare-file-tray-compare"
        disabled={!bothFilesSelected || !canCompare || compareLoading}
        onClick={onCompare}
      >
        {compareLoading ? copy.loading : copy.compareButton}
      </button>

      {bothFilesSelected && (
        <button type="button" className="btn btn-secondary btn-sm compare-file-tray-swap" onClick={onSwap}>
          <ArrowLeftRight size={15} />
          {copy.swapDocuments}
        </button>
      )}

      <p className="compare-file-tray-privacy">{copy.privacyHint.replace("{limit}", formatFileLimit(fileLimitMb))}</p>
    </aside>
  );
}
