"use client";

import { useEffect, useRef } from "react";

type Snake = {
  ax: number; // horizontal amplitude (fraction of width)
  ay: number; // vertical amplitude (px, clamped)
  a: number; // horizontal angular speed
  b: number; // vertical angular speed
  px: number; // horizontal phase
  py: number; // vertical phase
  segments: number;
  gap: number; // time (ms) between body samples
  head: number; // head radius
  color: string; // "rgba(r,g,b," — alpha appended per segment
  glow: string;
  opacity: number;
  logoHead?: boolean; // draw the logo image as the head
};

const SNAKES: Snake[] = [
  { ax: 0.4, ay: 300, a: 0.00024, b: 0.00033, px: 0, py: 1.6, segments: 52, gap: 22, head: 15, color: "rgba(214,216,228,", glow: "rgba(185,190,214,0.55)", opacity: 0.55, logoHead: true },
  { ax: 0.46, ay: 250, a: 0.00019, b: 0.00028, px: 2.3, py: 0.5, segments: 42, gap: 28, head: 11, color: "rgba(228,99,140,", glow: "rgba(228,99,140,0.5)", opacity: 0.32 },
  { ax: 0.36, ay: 340, a: 0.00028, b: 0.00022, px: 4.2, py: 3.1, segments: 34, gap: 24, head: 8, color: "rgba(150,152,172,", glow: "rgba(150,152,172,0.45)", opacity: 0.24 },
];

const LOGO_SRC = "/figma/53ecebb32436c8fc102ad0fc85bfbdb3477402ba.png";

/**
 * Animated serpent field for empty page backgrounds. Metallic snakes slither
 * across the canvas following Lissajous paths; the primary snake wears the
 * Bhavya Ramesh logo as its running head. Purely decorative, pointer-none, and
 * respects prefers-reduced-motion.
 */
export function SnakeBackground({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const resize = () => {
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = Math.max(1, w * dpr);
      canvas.height = Math.max(1, h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const logo = new Image();
    let logoReady = false;
    logo.onload = () => { logoReady = true; };
    logo.src = LOGO_SRC;

    const at = (s: Snake, t: number) => ({
      x: w / 2 + Math.sin(s.a * t + s.px) * s.ax * w,
      y: h / 2 + Math.sin(s.b * t + s.py) * Math.min(s.ay, h * 0.42),
    });

    let raf = 0;
    let startT = 0;

    const frame = (now: number) => {
      if (!startT) startT = now;
      const t = now - startT;
      ctx.clearRect(0, 0, w, h);

      for (const s of SNAKES) {
        // Body: tapering trail of soft glowing beads, tail first.
        for (let i = s.segments - 1; i >= 0; i--) {
          const p = at(s, t - i * s.gap);
          const f = 1 - i / s.segments; // 0 tail -> 1 head
          const r = Math.max(0.8, s.head * (0.2 + 0.8 * f));
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = `${s.color}${(s.opacity * (0.2 + 0.8 * f)).toFixed(3)})`;
          ctx.shadowBlur = 16;
          ctx.shadowColor = s.glow;
          ctx.fill();
        }

        // Head: logo image, rotated toward the direction of travel.
        if (s.logoHead && logoReady) {
          const p0 = at(s, t);
          const p1 = at(s, t - 40);
          const angle = Math.atan2(p0.y - p1.y, p0.x - p1.x);
          const size = s.head * 4.4;
          const ratio = logo.height ? logo.width / logo.height : 1;
          ctx.save();
          ctx.translate(p0.x, p0.y);
          ctx.rotate(angle);
          ctx.globalAlpha = Math.min(1, s.opacity + 0.35);
          ctx.shadowBlur = 22;
          ctx.shadowColor = s.glow;
          ctx.drawImage(logo, -size * ratio * 0.5, -size * 0.5, size * ratio, size);
          ctx.restore();
          ctx.globalAlpha = 1;
        }
      }

      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
