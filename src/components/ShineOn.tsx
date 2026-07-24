"use client";

import { useRef } from "react";

/**
 * The oversized "Bhavya Ramesh" footer watermark. A dark static wordmark; on hover a
 * focus "spotlight" follows the cursor and lights up the letters under it
 * (handled in CSS via the --mx/--my custom properties — see globals.css).
 */
export function ShineOn() {
  const ref = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <span
      ref={ref}
      aria-hidden
      onMouseMove={onMove}
      className="shine-on absolute inset-x-0 bottom-[-0.8vw] z-0 cursor-default select-none whitespace-nowrap text-center font-display font-semibold uppercase leading-none text-[11.4vw]"
    >
      Bhavya Ramesh
    </span>
  );
}
