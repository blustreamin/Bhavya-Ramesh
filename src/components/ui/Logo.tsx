type LogoProps = { className?: string };

/**
 * Bhavya Ramesh snake monogram — the metallic serpent wordmark exported from
 * Figma (node "silver logo 1").
 */
export function Logo({ className }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/figma/53ecebb32436c8fc102ad0fc85bfbdb3477402ba.png"
      alt="Bhavya Ramesh"
      draggable={false}
      className={className}
    />
  );
}
