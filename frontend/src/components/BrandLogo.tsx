interface BrandLogoProps {
  size?: number;
  className?: string;
}

export default function BrandLogo({ size = 36, className }: BrandLogoProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="36" height="36" rx="10" fill="#1B4332" />
      <path
        d="M10 11h10c2.2 0 4 1.8 4 4v10H14c-2.2 0-4-1.8-4-4V11z"
        fill="#FAFAF8"
      />
      <path
        d="M16 11h10c2.2 0 4 1.8 4 4v10H20c-2.2 0-4-1.8-4-4V11z"
        fill="#E8F0EA"
      />
      <path d="M12 15h6v1.5h-6V15zm0 3.5h8v1.5h-8V18.5zm0 3.5h5v1.5h-5V22z" fill="#1B4332" />
      <path d="M20 15h6v1.5h-6V15zm0 3.5h8v1.5h-8V18.5z" fill="#52796F" fillOpacity="0.7" />
    </svg>
  );
}
