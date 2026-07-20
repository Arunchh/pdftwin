import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
  iconOnly?: boolean;
}

export default function IconButton({
  icon,
  label,
  variant = "primary",
  loading = false,
  iconOnly = false,
  className = "",
  disabled,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn-${variant} ${iconOnly ? "btn-icon" : "btn-with-icon"} ${className}`.trim()}
      disabled={disabled || loading}
      title={label}
      aria-label={label}
      {...props}
    >
      {loading ? <Loader2 size={18} className="spin" /> : icon}
      {!iconOnly && <span>{label}</span>}
    </button>
  );
}
