import Link from "next/link";

/**
 * Promo announcement bar pinned above the header.
 */
export function AnnouncementBar() {
  return (
    <Link
      href="#sale"
      className="fixed inset-x-0 top-0 z-[55] flex h-9 items-center justify-center border-b border-white/10 px-4 text-center text-[12px] font-medium tracking-wide text-white underline decoration-white/60 underline-offset-2 sm:text-[13px]"
      style={{
        background:
          "linear-gradient(90deg, #1a0a10 0%, #3a0f1f 50%, #1a0a10 100%)",
      }}
    >
      Get upto 15% Off during this Independence Day Sales
    </Link>
  );
}
