interface IconProps {
  size?: number;
  className?: string;
}

export function PdfIcon({ size = 32, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
    >
      <path fill="#E74C3C" d="M10 4h20l8 8v32a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path fill="#C0392B" d="M30 4v8h8" />
      <text x="14" y="33" fill="#fff" fontSize="11" fontWeight="700" fontFamily="Arial, sans-serif">
        PDF
      </text>
    </svg>
  );
}

export function WordIcon({ size = 32, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
    >
      <path fill="#2B579A" d="M10 4h20l8 8v32a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path fill="#1E3F6F" d="M30 4v8h8" />
      <text x="15" y="33" fill="#fff" fontSize="14" fontWeight="700" fontFamily="Arial, sans-serif">
        W
      </text>
    </svg>
  );
}

export function ExcelIcon({ size = 32, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
    >
      <path fill="#217346" d="M10 4h20l8 8v32a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path fill="#185C37" d="M30 4v8h8" />
      <text x="15" y="33" fill="#fff" fontSize="14" fontWeight="700" fontFamily="Arial, sans-serif">
        X
      </text>
    </svg>
  );
}

export function ImagesIcon({ size = 32, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
    >
      <rect x="6" y="8" width="36" height="32" rx="4" fill="#7C3AED" />
      <circle cx="17" cy="19" r="4" fill="#FDE68A" />
      <path fill="#A78BFA" d="M6 30l10-9 8 7 7-6 11 12H6z" />
    </svg>
  );
}

export function ZipIcon({ size = 32, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
    >
      <path fill="#F59E0B" d="M10 4h20l8 8v32a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path fill="#D97706" d="M30 4v8h8" />
      <text x="13" y="33" fill="#fff" fontSize="10" fontWeight="700" fontFamily="Arial, sans-serif">
        ZIP
      </text>
    </svg>
  );
}
