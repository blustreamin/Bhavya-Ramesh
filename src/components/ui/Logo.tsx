import type { SVGProps } from "react";

/**
 * Bhavya Ramesh serpent monogram (placeholder).
 * TODO: replace this stylised path with the official snake "S" logo asset.
 */
export function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 56"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Bhavya Ramesh"
      role="img"
      className={className}
      {...props}
    >
      {/* Serpentine "S" body */}
      <path d="M32 10c-6-5-16-3-17 5s9 9 12 13-1 11-9 11-12-6-9-12" />
      {/* Head */}
      <circle cx="33" cy="9" r="3" fill="currentColor" stroke="none" />
      {/* Forked tongue */}
      <path d="M36 9h4m-4-2 3-1m-3 5 3 1" strokeWidth={1.2} />
    </svg>
  );
}
