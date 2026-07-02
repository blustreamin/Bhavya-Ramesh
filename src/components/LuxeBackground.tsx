"use client";

import { useEffect, useRef } from "react";

type Gem = {
  x: number;
  y: number;
  size: number;
  depth: number; // 0 far … 1 near
  rot: number;
  rotSpeed: number;
  spin: number;
  spinSpeed: number;
  drift: number; // upward px/sec
  sway: number;
  swayAmp: number;
  tint: [number, number, number];
};

type Sparkle = { x: number; y: number; r: number; phase: number; speed: number };
type Orb = { x: number; y: number; r: number; vx: number; vy: number; tint: string };

const SILVER: [number, number, number] = [214, 217, 230];
const ROSE: [number, number, number] = [228, 99, 140];
const GOLD: [number, number, number] = [230, 214, 176];

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

/**
 * Classy, on-theme motion backdrop for empty pages: faceted gemstones tumble
 * slowly through 3D-ish space (fake perspective spin via horizontal scale) at
 * varied depths, with metallic facet shading, glints and twinkling sparkle
 * dust over soft drifting light orbs. Decorative, pointer-none, honours
 * prefers-reduced-motion.
 */
export function LuxeBackground({ className = "" }: { className?: string }) {
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
    let gems: Gem[] = [];
    let sparkles: Sparkle[] = [];
    let orbs: Orb[] = [];

    const build = () => {
      const area = w * h;
      const gemCount = Math.max(5, Math.min(11, Math.round(area / 150000)));
      gems = Array.from({ length: gemCount }, () => {
        const depth = Math.random();
        const tint = Math.random() < 0.18 ? ROSE : Math.random() < 0.12 ? GOLD : SILVER;
        return {
          x: rand(0, w),
          y: rand(0, h),
          size: rand(16, 40) * (0.5 + depth),
          depth,
          rot: rand(0, Math.PI * 2),
          rotSpeed: rand(-0.25, 0.25) * (0.4 + depth),
          spin: rand(0, Math.PI * 2),
          spinSpeed: rand(0.3, 0.8) * (0.5 + depth),
          drift: rand(6, 16) * (0.4 + depth),
          sway: rand(0, Math.PI * 2),
          swayAmp: rand(10, 34),
          tint,
        };
      });
      sparkles = Array.from({ length: Math.round(area / 70000) }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(0.5, 1.4),
        phase: rand(0, Math.PI * 2),
        speed: rand(0.5, 1.4),
      }));
      orbs = [
        { x: w * 0.82, y: h * 0.14, r: Math.max(w, h) * 0.28, vx: rand(-4, 4), vy: rand(-3, 3), tint: "rgba(140,142,165,0.10)" },
        { x: w * 0.1, y: h * 0.78, r: Math.max(w, h) * 0.3, vx: rand(-4, 4), vy: rand(-3, 3), tint: "rgba(228,99,140,0.08)" },
        { x: w * 0.5, y: h * 0.5, r: Math.max(w, h) * 0.24, vx: rand(-3, 3), vy: rand(-3, 3), tint: "rgba(150,152,172,0.07)" },
      ];
    };

    const resize = () => {
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = Math.max(1, w * dpr);
      canvas.height = Math.max(1, h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const drawGem = (g: Gem) => {
      const s = g.size;
      // Fake perspective spin around the vertical axis.
      const spinScale = Math.cos(g.spin);
      const edgeOn = 1 - Math.min(1, Math.abs(spinScale)); // ~1 when turned edge-on
      const [r, gr, b] = g.tint;
      const alpha = 0.16 + 0.5 * g.depth;

      // Brilliant-cut silhouette (crown + pavilion), pointing down.
      const tw = s * 0.5; // table half-width
      const gw = s * 0.82; // girdle half-width
      const crownY = -s * 0.62;
      const girdleY = -s * 0.24;
      const culetY = s * 0.78;

      ctx.save();
      ctx.translate(g.x, g.y);
      ctx.rotate(g.rot);
      ctx.scale(Math.sign(spinScale) * (0.18 + 0.82 * Math.abs(spinScale)), 1);

      const outline = () => {
        ctx.beginPath();
        ctx.moveTo(-tw, crownY);
        ctx.lineTo(tw, crownY);
        ctx.lineTo(gw, girdleY);
        ctx.lineTo(0, culetY);
        ctx.lineTo(-gw, girdleY);
        ctx.closePath();
      };

      // Body — metallic vertical gradient.
      const grad = ctx.createLinearGradient(0, crownY, 0, culetY);
      grad.addColorStop(0, `rgba(${r},${gr},${b},${alpha * 1.15})`);
      grad.addColorStop(0.45, `rgba(${r},${gr},${b},${alpha * 0.55})`);
      grad.addColorStop(1, `rgba(${Math.round(r * 0.5)},${Math.round(gr * 0.5)},${Math.round(b * 0.55)},${alpha * 0.9})`);
      outline();
      ctx.fillStyle = grad;
      ctx.shadowBlur = 22 * g.depth;
      ctx.shadowColor = `rgba(${r},${gr},${b},${0.5 * g.depth})`;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Facets — table + pavilion cut lines.
      ctx.strokeStyle = `rgba(255,255,255,${0.1 + 0.22 * g.depth})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-tw, crownY);
      ctx.lineTo(-gw, girdleY);
      ctx.moveTo(tw, crownY);
      ctx.lineTo(gw, girdleY);
      ctx.moveTo(-gw, girdleY);
      ctx.lineTo(0, crownY);
      ctx.lineTo(gw, girdleY);
      ctx.moveTo(-gw, girdleY);
      ctx.lineTo(0, culetY);
      ctx.moveTo(gw, girdleY);
      ctx.lineTo(0, culetY);
      ctx.moveTo(0, crownY);
      ctx.lineTo(0, culetY);
      ctx.stroke();

      // Table rim highlight.
      ctx.strokeStyle = `rgba(255,255,255,${0.22 + 0.4 * g.depth})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-tw, crownY);
      ctx.lineTo(tw, crownY);
      ctx.stroke();

      ctx.restore();

      // Glint flash when the gem turns edge-on.
      if (edgeOn > 0.6) {
        const gl = (edgeOn - 0.6) / 0.4;
        ctx.save();
        ctx.translate(g.x, g.y);
        ctx.rotate(g.rot);
        ctx.globalAlpha = gl * (0.35 + 0.5 * g.depth);
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.shadowBlur = 16;
        ctx.shadowColor = "rgba(255,255,255,0.9)";
        ctx.beginPath();
        ctx.arc(0, crownY * 0.3, s * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }
    };

    const drawSparkle = (sp: Sparkle, t: number) => {
      const tw = (Math.sin(t * sp.speed + sp.phase) + 1) / 2; // 0..1
      ctx.save();
      ctx.translate(sp.x, sp.y);

      // Soft glowing dot — the main body of the sparkle.
      const dot = ctx.createRadialGradient(0, 0, 0, 0, 0, sp.r * 4);
      dot.addColorStop(0, `rgba(255,255,255,${(0.15 + 0.55 * tw).toFixed(3)})`);
      dot.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = dot;
      ctx.beginPath();
      ctx.arc(0, 0, sp.r * 4, 0, Math.PI * 2);
      ctx.fill();

      // Faint four-point star glint only near peak twinkle.
      if (tw > 0.72) {
        const g = (tw - 0.72) / 0.28;
        const len = sp.r * (1.6 + g * 2);
        ctx.globalAlpha = g * 0.6;
        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(-len, 0);
        ctx.lineTo(len, 0);
        ctx.moveTo(0, -len);
        ctx.lineTo(0, len);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      ctx.restore();
    };

    let raf = 0;
    let last = 0;
    let startT = 0;

    const frame = (now: number) => {
      if (!startT) { startT = now; last = now; }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = (now - startT) / 1000;

      ctx.clearRect(0, 0, w, h);

      // Soft drifting light orbs.
      for (const o of orbs) {
        o.x += o.vx * dt;
        o.y += o.vy * dt;
        if (o.x < -o.r) o.x = w + o.r;
        if (o.x > w + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = h + o.r;
        if (o.y > h + o.r) o.y = -o.r;
        const rg = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        rg.addColorStop(0, o.tint);
        rg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, w, h);
      }

      // Sparkle dust.
      for (const sp of sparkles) drawSparkle(sp, t);

      // Gems — far ones first for depth layering.
      const sorted = [...gems].sort((a, b) => a.depth - b.depth);
      for (const g of sorted) {
        g.y -= g.drift * dt;
        g.sway += dt * 0.6;
        g.rot += g.rotSpeed * dt;
        g.spin += g.spinSpeed * dt;
        const drawX = g.x + Math.sin(g.sway) * g.swayAmp;
        if (g.y < -g.size * 2) {
          g.y = h + g.size * 2;
          g.x = rand(0, w);
        }
        drawGem({ ...g, x: drawX });
      }

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
