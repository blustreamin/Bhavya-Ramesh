"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion";

/**
 * Mobile hero — the scroll-driven story (Figma "Mobile Home" hero, 402×818),
 * matching the desktop HeroStory:
 *   1. vertical jewellery scatter + "Bhavya / Ramesh" wordmark
 *   2. the lotus scrubs open → closed (35 frames) with "Wear your Subversion"
 *      copy + CTA.
 * Rendered only below lg (desktop uses HeroStory).
 */

const STAGE_W = 402;
const STAGE_H = 818;
const ASSET = (h: string) => `/figma/${h}`;

const LOTUS_FRAMES = 35;
const LOTUS_SRC = (i: number) => `/lotus/f${String(i).padStart(2, "0")}.webp`;
// The lotus occupies this region of the 1440×664 frame (union of all frames).
const CROP = { x: 410, y: 80, w: 620, h: 510 };
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/* The three story frames revealed as the lotus scrubs open → closed. */
const FRAMES = [
  { l1: "Wear your", l2: "Rebellion.", body: "Crafted for people who express themselves before they ever explain themselves." },
  { l1: "Bloom like", l2: "nobody's watching.", body: "The best transformations happen without applause, permission, or anyone else's expectations attached." },
  { l1: "Stay", l2: "Unexpected.", body: "Find pieces strange enough to remember and beautiful enough never to forget.", cta: "Start Turning Heads" },
] as const;

type Piece = {
  left: number; top: number; width: number; height: number; rotate: number;
  cw: number; ch: number; src: string; imgClass: string;
};

const PIECES: Piece[] = [
  { left: 1, top: 23, width: 152.4, height: 162.1, rotate: 21.2, cw: 113, ch: 130,
    src: "0ac665a7b31c1af331d3a4b60fcc2f206b879fe6.png",
    imgClass: "h-[354.43%] left-[-92.22%] top-[-108.62%] w-[279.07%]" },
  { left: 150.59, top: -0.58, width: 221.9, height: 244.6, rotate: 19.98, cw: 163, ch: 201,
    src: "57e6f4884472d2402cc592f515f5361bbfdd54fd.png",
    imgClass: "inset-0 size-full object-bottom" },
  { left: 16, top: 206, width: 143, height: 83, rotate: 0, cw: 143, ch: 83,
    src: "95beb547aaa54910ead91e1a68155105422f32ed.png",
    imgClass: "h-[200.75%] left-0 top-[-46.79%] w-full" },
  { left: 147, top: 192, width: 230.8, height: 127.7, rotate: -11.5, cw: 218, ch: 86,
    src: "2a355c7498cf8b92e7a6ac3c9ece1bd727aa71eb.png",
    imgClass: "h-[338.26%] left-0 top-[-121.13%] w-full" },
  { left: 1, top: 526, width: 193.1, height: 291.5, rotate: 12.36, cw: 139, ch: 268,
    src: "21a0dd581cc789481ac99ca16744ccf7c1ecb7c4.png",
    imgClass: "h-[126.04%] left-[-34.91%] top-[-14.29%] w-[166.67%]" },
  { left: 184, top: 530, width: 140.3, height: 209.9, rotate: -10.07, cw: 108, ch: 194,
    src: "4d2690035c1b9050885ab73c610776d928674a24.png",
    imgClass: "h-[163.56%] left-[-50.95%] top-[-21.72%] w-[201.52%]" },
  { left: -110.24, top: 644, width: 804.9, height: 1260.6, rotate: 21.47, cw: 393, ch: 1200,
    src: "1f474d211aff17d1dedca3194dfbb8c53fc87608.png",
    imgClass: "h-[169.03%] left-[-128.12%] top-[-36.39%] w-[354.17%]" },
];

export function MobileHero() {
  const wrapRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const lastFrame = useRef(-1);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / STAGE_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < LOTUS_FRAMES; i++) {
      const img = new window.Image();
      img.src = LOTUS_SRC(i);
      imgs.push(img);
    }
    framesRef.current = imgs;
    const paintFirst = () => drawLotus(0);
    if (imgs[0].complete) paintFirst();
    else imgs[0].onload = paintFirst;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawLotus = (frame: number) => {
    if (frame === lastFrame.current) return;
    const canvas = canvasRef.current;
    const img = framesRef.current[frame];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, CROP.x, CROP.y, CROP.w, CROP.h, 0, 0, canvas.width, canvas.height);
    lastFrame.current = frame;
  };

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.5 });
  useMotionValueEvent(p, "change", (v) => {
    const t = clamp01((v - 0.32) / (0.92 - 0.32));
    drawLotus(Math.round(t * (LOTUS_FRAMES - 1)));
  });

  const hero = useTransform(p, [0, 0.18, 0.27], [1, 1, 0]);
  // The wordmark drifts upward and fades as the story takes over (like desktop).
  const titleY = useTransform(p, [0, 0.27], [0, -90]);
  const titleOpacity = useTransform(p, [0, 0.15, 0.27], [1, 1, 0]);
  const glow = useTransform(p, [0.26, 0.4, 1], [0, 1, 1]);
  const lotusOpacity = useTransform(p, [0.26, 0.36], [0, 1]);
  const lotusScale = useTransform(p, [0.26, 0.42], [0.92, 1]);
  // Three story frames cross-fade as the lotus scrubs open → closed.
  const mf1 = useTransform(p, [0.34, 0.42, 0.5, 0.56], [0, 1, 1, 0]);
  const mf2 = useTransform(p, [0.55, 0.62, 0.7, 0.76], [0, 1, 1, 0]);
  const mf3 = useTransform(p, [0.74, 0.82, 1], [0, 1, 1]);
  const my1 = useTransform(p, [0.34, 0.42], [20, 0]);
  const my2 = useTransform(p, [0.55, 0.62], [20, 0]);
  const my3 = useTransform(p, [0.74, 0.82], [20, 0]);
  const frameOps = [mf1, mf2, mf3];
  const frameYs = [my1, my2, my3];

  return (
    <section ref={wrapRef} aria-label="Bhavya Ramesh" className="relative bg-black lg:hidden" style={{ height: "360vh" }}>
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-black">
        <div ref={stageRef} className="absolute inset-0" aria-hidden />

        {/* maroon glow behind the lotus */}
        <motion.div
          aria-hidden
          style={{ opacity: glow }}
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute inset-0" style={{ background: "radial-gradient(60% 50% at 50% 48%, rgba(150,28,72,0.4) 0%, rgba(5,5,5,0) 70%)" }} />
        </motion.div>

        {/* Wordmark — drifts up and fades on scroll */}
        <motion.div style={{ opacity: titleOpacity, y: titleY }} className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative origin-center" style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}>
            <div className="absolute left-0 top-[276px] flex h-[267px] w-[387px] items-center justify-center px-[20px]">
              <h1 className="text-center font-bold leading-none text-white" style={{ fontFamily: "var(--font-poppins)", fontSize: "66px", lineHeight: "74px" }}>
                Bhavya
                <br />
                Ramesh
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Scene 1 — jewellery scatter */}
        <motion.div style={{ opacity: hero }} className="absolute inset-0 flex items-center justify-center">
          <div className="relative origin-center" style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}>
            {PIECES.map((pc, i) => (
              <div key={i} className="absolute flex items-center justify-center" style={{ left: pc.left, top: pc.top, width: pc.width, height: pc.height }}>
                <div style={{ transform: `rotate(${pc.rotate}deg)` }}>
                  <div className="relative overflow-hidden" style={{ width: pc.cw, height: pc.ch }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ASSET(pc.src)} alt="" aria-hidden draggable={false} className={`absolute max-w-none ${pc.imgClass}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scene 2 — lotus scrub + copy + CTA */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <motion.canvas
            ref={canvasRef}
            width={CROP.w}
            height={CROP.h}
            aria-hidden
            style={{ opacity: lotusOpacity, scale: lotusScale }}
            className="h-auto w-[80vw] max-w-[360px]"
          />
          <div className="relative mt-6 h-[250px] w-full max-w-[340px]">
            {FRAMES.map((fr, i) => (
              <motion.div
                key={i}
                style={{ opacity: frameOps[i], y: frameYs[i] }}
                className="absolute inset-x-0 top-0 flex flex-col items-center"
              >
                <h2 className="font-serif text-[34px] leading-[1.05] text-brand">
                  {fr.l1}
                  <br />
                  {fr.l2}
                </h2>
                <p className="mt-4 max-w-[320px] text-[13px] leading-relaxed text-white">
                  {fr.body}
                </p>
                {fr.cta && (
                  <button
                    type="button"
                    className="mt-6 flex items-center gap-2 rounded-[10px] border-2 border-white/90 px-4 py-3 font-sans text-[11px] font-bold uppercase tracking-wide text-white transition-colors hover:border-brand hover:text-brand"
                  >
                    {fr.cta}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
