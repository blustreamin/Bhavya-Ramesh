"use client";

import { useEffect, useRef } from "react";

/**
 * Lotus petals that drop from the pointer, drifting down and fading out.
 * On a mouse they trail the cursor; on touch they burst from each tap.
 * Pointer events are disabled; skipped entirely for reduced motion.
 */

const COUNT = 36; // pool of reusable petal elements

type Petal = {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vrot: number;
  life: number;
  size: number;
};

export function PetalCursor() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const petals: Petal[] = Array.from({ length: COUNT }, () => ({
      active: false, x: 0, y: 0, vx: 0, vy: 0, rot: 0, vrot: 0, life: 0, size: 1,
    }));
    const mouse = { x: -100, y: -100 };
    let cursor = 0;
    let lastSpawn = 0;

    /** `spread` widens the scatter for the tap burst. */
    const spawn = (spread = 1) => {
      const p = petals[cursor % COUNT];
      cursor++;
      p.active = true;
      p.x = mouse.x + (Math.random() - 0.5) * 14 * spread;
      p.y = mouse.y + (Math.random() - 0.5) * 6 * spread;
      p.vx = (Math.random() - 0.5) * 1.1 * spread;
      p.vy = 0.5 + Math.random() * 1.3;
      p.rot = Math.random() * 360;
      p.vrot = (Math.random() - 0.5) * 7;
      p.life = 1;
      p.size = 0.5 + Math.random() * 0.5; // small + minimal: ~12–24px rendered
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const now = e.timeStamp;
      if (now - lastSpawn > 60) {
        spawn();
        lastSpawn = now;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // Touch: no hover to trail, so each tap releases a small burst.
    const onTap = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const burst = 6;
      for (let n = 0; n < burst; n++) spawn(2.4);
    };
    window.addEventListener("pointerdown", onTap, { passive: true });

    let raf = 0;
    const loop = () => {
      for (let i = 0; i < COUNT; i++) {
        const p = petals[i];
        const el = refs.current[i];
        if (!el) continue;
        if (!p.active) {
          if (el.style.opacity !== "0") el.style.opacity = "0";
          continue;
        }
        p.vy += 0.018; // gravity
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;
        p.life -= 0.0125;
        if (p.life <= 0) {
          p.active = false;
          el.style.opacity = "0";
          continue;
        }
        el.style.opacity = String(Math.min(1, p.life * 1.4));
        el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) rotate(${p.rot}deg) scale(${p.size})`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("pointerdown", onTap);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      {Array.from({ length: COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="absolute left-0 top-0 opacity-0 will-change-transform"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/cursor-lotus.webp"
            alt=""
            draggable={false}
            className="block w-[24px] max-w-none select-none"
            style={{ filter: "drop-shadow(0 1px 3px rgba(192,171,121,0.25))" }}
          />
        </div>
      ))}
    </div>
  );
}
