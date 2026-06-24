"use client";

import { useEffect, useRef } from "react";

/**
 * A serpent that follows the cursor — echoing the Bhavya Ramesh snake
 * monogram. The head eases toward the pointer and each body segment trails
 * the one ahead of it, producing a slithering metallic snake. Pointer-events
 * are disabled so it never interferes, and it's skipped on touch devices and
 * when reduced motion is preferred.
 */

const COUNT = 30; // head + body segments

export function SnakeCursor() {
  const headRef = useRef<HTMLDivElement>(null);
  const bodyRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const pts = Array.from({ length: COUNT }, () => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }));
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    let angle = 0;

    const loop = () => {
      const prevX = pts[0].x;
      const prevY = pts[0].y;

      // Head eases toward the cursor.
      pts[0].x += (mouse.x - pts[0].x) * 0.3;
      pts[0].y += (mouse.y - pts[0].y) * 0.3;

      // Body segments trail the segment ahead.
      for (let i = 1; i < COUNT; i++) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * 0.42;
        pts[i].y += (pts[i - 1].y - pts[i].y) * 0.42;
      }

      // Head orientation follows its velocity.
      const dx = pts[0].x - prevX;
      const dy = pts[0].y - prevY;
      if (dx * dx + dy * dy > 0.5) angle = Math.atan2(dy, dx);

      if (headRef.current) {
        headRef.current.style.transform = `translate3d(${pts[0].x}px, ${pts[0].y}px, 0) translate(-50%, -50%) rotate(${angle}rad)`;
      }
      for (let i = 1; i < COUNT; i++) {
        const el = bodyRefs.current[i - 1];
        if (el) {
          el.style.transform = `translate3d(${pts[i].x}px, ${pts[i].y}px, 0) translate(-50%, -50%)`;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] hidden lg:block" aria-hidden>
      {/* Body — tapering metallic segments (rendered back-to-front). */}
      {Array.from({ length: COUNT - 1 }).map((_, idx) => {
        const i = idx + 1; // 1..COUNT-1
        const t = i / COUNT;
        const size = 15 * (1 - t) + 2; // taper from ~15px to ~2px
        const light = Math.round(210 - t * 110);
        return (
          <div
            key={i}
            ref={(el) => {
              bodyRefs.current[idx] = el;
            }}
            className="absolute left-0 top-0 rounded-full"
            style={{
              width: size,
              height: size,
              background: `radial-gradient(circle at 35% 30%, rgb(${light + 30},${light + 30},${light + 34}), rgb(${light},${light},${light + 6}))`,
              opacity: 1 - t * 0.35,
            }}
          />
        );
      })}

      {/* Head */}
      <div
        ref={headRef}
        className="absolute left-0 top-0"
        style={{ width: 20, height: 16 }}
      >
        <div
          className="absolute inset-0 rounded-[50%]"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #f0f0f2, #b9b9c0 60%, #8d8d95)",
            boxShadow: "0 0 8px rgba(228,99,140,0.35)",
          }}
        />
        {/* eyes */}
        <span className="absolute h-[2.5px] w-[2.5px] rounded-full bg-black/80" style={{ left: 12, top: 4 }} />
        <span className="absolute h-[2.5px] w-[2.5px] rounded-full bg-black/80" style={{ left: 12, top: 9 }} />
        {/* forked tongue */}
        <span className="snake-tongue absolute" style={{ left: 19, top: 7 }}>
          <span className="absolute block h-[1.5px] w-[7px] origin-left -rotate-12 bg-brand" />
          <span className="absolute block h-[1.5px] w-[7px] origin-left rotate-12 bg-brand" />
        </span>
      </div>
    </div>
  );
}
