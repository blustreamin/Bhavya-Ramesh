"use client";

import { useEffect, useRef } from "react";

/**
 * Pink lotus petals that drop from the cursor as it moves, drifting down and
 * fading out — a soft, on-brand replacement for the snake cursor. Pointer
 * events are disabled; skipped on touch devices and for reduced motion.
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
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const petals: Petal[] = Array.from({ length: COUNT }, () => ({
      active: false, x: 0, y: 0, vx: 0, vy: 0, rot: 0, vrot: 0, life: 0, size: 1,
    }));
    const mouse = { x: -100, y: -100 };
    let cursor = 0;
    let lastSpawn = 0;

    const spawn = () => {
      const p = petals[cursor % COUNT];
      cursor++;
      p.active = true;
      p.x = mouse.x + (Math.random() - 0.5) * 14;
      p.y = mouse.y + (Math.random() - 0.5) * 6;
      p.vx = (Math.random() - 0.5) * 1.1;
      p.vy = 0.5 + Math.random() * 1.3;
      p.rot = Math.random() * 360;
      p.vrot = (Math.random() - 0.5) * 7;
      p.life = 1;
      p.size = 0.6 + Math.random() * 0.7;
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
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] hidden overflow-hidden lg:block" aria-hidden>
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
            src="/figma/841430c5006d3cbfa0c65d75eba5f4ded9c3d78b.png"
            alt=""
            draggable={false}
            className="block w-[44px] max-w-none select-none"
            style={{ filter: "drop-shadow(0 2px 6px rgba(214,67,122,0.35))" }}
          />
        </div>
      ))}
    </div>
  );
}
