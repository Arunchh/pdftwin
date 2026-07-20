import type { ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import IconButton from "./IconButton";

interface OrderActionsProps {
  primaryIcon?: ReactNode;
  primaryLabel?: string;
  onPrimary?: () => void;
  primaryLoading?: boolean;
  primaryDisabled?: boolean;
  onReset?: () => void;
  resetLabel?: string;
  resetDisabled?: boolean;
  secondaryIcon?: ReactNode;
  secondaryLabel?: string;
  onSecondary?: () => void;
  secondaryLoading?: boolean;
  secondaryDisabled?: boolean;
  secondaryVariant?: "primary" | "secondary";
}

export default function OrderActions({
  primaryIcon,
  primaryLabel,
  onPrimary,
  primaryLoading = false,
  primaryDisabled = false,
  onReset,
  resetLabel = "Reset order",
  resetDisabled = false,
  secondaryIcon,
  secondaryLabel,
  onSecondary,
  secondaryLoading = false,
  secondaryDisabled = false,
  secondaryVariant = "secondary",
}: OrderActionsProps) {
  return (
    <div className="actions order-actions">
      {onSecondary && secondaryIcon && secondaryLabel && (
        <IconButton
          icon={secondaryIcon}
          label={secondaryLabel}
          variant={secondaryVariant}
          loading={secondaryLoading}
          disabled={secondaryDisabled || primaryLoading}
          onClick={onSecondary}
        />
      )}
      {onPrimary && primaryIcon && primaryLabel && (
        <IconButton
          icon={primaryIcon}
          label={primaryLabel}
          loading={primaryLoading}
          disabled={primaryDisabled || secondaryLoading}
          onClick={onPrimary}
        />
      )}
      {onReset && (
        <IconButton
          icon={<RotateCcw size={18} />}
          label={resetLabel}
          variant="secondary"
          disabled={resetDisabled || primaryLoading || secondaryLoading}
          onClick={onReset}
        />
      )}
    </div>
  );
}
