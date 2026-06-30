"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion";

/**
 * HeroStory — scroll-driven hero sequence from Figma "Component 61"
 * (node 521:4818). All four states share one 1440×664 coordinate space, so
 * we render a single pinned stage and simply cross-fade the scene elements as
 * the user scrolls:
 *
 *   1. jewellery scatter (silver, gold on hover)
 *   2. the title alone over a maroon glow
 *   3. lotus flower + "Wear your Subversion" (right)
 *   4. lotus bud + "Wear your Subversion" (left) + CTA
 *
 * The faint "Bhavya Ramesh" title persists across every scene and drifts
 * gently upward, anchoring the sequence while the scenery changes behind it.
 */

const STAGE_W = 1440;
const STAGE_H = 664;
const ASSET = (h: string) => `/figma/${h}`;

/* Lotus scroll-scrub — 35 frames (open flower → closed bud), drawn to a
   canvas so the open→closed morph scrubs smoothly with scroll. */
const LOTUS_FRAMES = 35;
const LOTUS_SRC = (i: number) => `/lotus/f${String(i).padStart(2, "0")}.webp`;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/* The three story frames revealed as the lotus scrubs open → closed. */
const FRAMES = [
  { l1: "Wear your", l2: "Rebellion.", body: "Crafted for people who express themselves before they ever explain themselves." },
  { l1: "Bloom like", l2: "nobody's watching.", body: "The best transformations happen without applause, permission, or anyone else's expectations attached." },
  { l1: "Stay", l2: "Unexpected.", body: "Find pieces strange enough to remember and beautiful enough never to forget.", cta: "Start Turning Heads" },
] as const;

/* State 1 — jewellery cut-outs (silver; gold on hover) ------------------- */

type Variant = { src: string; imgClass: string };
type Piece = {
  left: number; top: number; width: number; height: number; rotate: number;
  silver: Variant; gold?: Variant; goldFilter?: boolean; delay: number;
};

const PIECES: Piece[] = [
  { left: 49, top: 62, width: 210, height: 122, rotate: 0,
    silver: { src: "95beb547aaa54910ead91e1a68155105422f32ed.png", imgClass: "h-[200.75%] left-0 top-[-46.79%] w-full" },
    gold: { src: "caddd41f91522c9bccca2f032c557f1827533177.png", imgClass: "h-[219.09%] left-[-0.07%] top-[-54.55%] w-[100.14%]" }, delay: 0 },
  { left: 515, top: 86, width: 172, height: 197, rotate: 0,
    silver: { src: "0ac665a7b31c1af331d3a4b60fcc2f206b879fe6.png", imgClass: "h-[354.43%] left-[-92.22%] top-[-108.62%] w-[279.07%]" },
    gold: { src: "7984d4b313728d13da8d454c336b438c671fa723.png", imgClass: "h-[354.43%] left-[-93.39%] top-[-108.62%] w-[303.04%]" }, delay: 1.1 },
  { left: 822.55, top: -56.15, width: 243, height: 300, rotate: 13.94,
    silver: { src: "57e6f4884472d2402cc592f515f5361bbfdd54fd.png", imgClass: "inset-0 size-full object-bottom" },
    goldFilter: true, delay: 0.6 },
  { left: 1197.82, top: -212.31, width: 231, height: 444, rotate: -7.17,
    silver: { src: "21a0dd581cc789481ac99ca16744ccf7c1ecb7c4.png", imgClass: "h-[126.04%] left-[-34.91%] top-[-14.29%] w-[166.67%]" },
    goldFilter: true, delay: 1.6 },
  { left: 768, top: 373.57, width: 157, height: 282, rotate: 15.09,
    silver: { src: "4d2690035c1b9050885ab73c610776d928674a24.png", imgClass: "h-[163.56%] left-[-50.95%] top-[-21.72%] w-[201.52%]" },
    gold: { src: "ffd0a2fb8ad4f3f5f79fab19ba8ab6e7e14ea5d6.png", imgClass: "h-[153.48%] left-[-46.98%] top-[-25.45%] w-[200%]" }, delay: 0.9 },
  { left: 1271.06, top: 385.2, width: 78, height: 238, rotate: 16.99,
    silver: { src: "1f474d211aff17d1dedca3194dfbb8c53fc87608.png", imgClass: "h-[169.03%] left-[-128.12%] top-[-36.39%] w-[354.17%]" },
    gold: { src: "2e78e9da92e032cfa2ddab3251a428c5f2779077.png", imgClass: "h-[176.9%] left-[-133.57%] top-[-37.66%] w-[362.14%]" }, delay: 2 },
  { left: 57, top: 458.4, width: 329, height: 130, rotate: 8.8,
    silver: { src: "2a355c7498cf8b92e7a6ac3c9ece1bd727aa71eb.png", imgClass: "h-[338.26%] left-0 top-[-121.13%] w-full" },
    gold: { src: "441b861038e6780b5653c72cc927d58f67794f63.png", imgClass: "inset-0 size-full object-cover" }, delay: 0.3 },
];

function JewelleryPiece({ p }: { p: Piece }) {
  return (
    <div className="absolute" style={{ left: p.left, top: p.top, width: p.width, height: p.height }}>
      <div className="floaty h-full w-full" style={{ animationDelay: `${p.delay}s` }}>
        <div className="group h-full w-full" style={{ transform: `rotate(${p.rotate}deg)` }}>
          <div className="relative h-full w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ASSET(p.silver.src)} alt="" aria-hidden draggable={false}
              className={`absolute max-w-none transition-all duration-300 ${p.silver.imgClass} ${p.gold ? "group-hover:opacity-0" : ""} ${p.goldFilter ? "gold-on-hover" : ""}`} />
            {p.gold && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ASSET(p.gold.src)} alt="" aria-hidden draggable={false}
                className={`absolute max-w-none opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${p.gold.imgClass}`} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type FrameCopy = { l1: string; l2: string; body: string; cta?: string };

function WearCopy({ side, frame }: { side: "left" | "right"; frame: FrameCopy }) {
  const left = side === "right" ? 1040 : 95;
  const top = side === "right" ? 296 : 282;
  return (
    <div className="absolute flex flex-col" style={{ left, top }}>
      <p className="whitespace-nowrap font-serif text-[#e4638c]" style={{ fontSize: "56px", lineHeight: "58px" }}>
        {frame.l1}
        <br />
        {frame.l2}
      </p>
      <p className="mt-5 font-sans text-[14px] leading-normal text-white" style={{ width: 320 }}>
        {frame.body}
      </p>
      {frame.cta && (
        <button type="button"
          className="mt-7 flex w-fit items-center justify-between gap-3 rounded-[10px] border-2 border-white/90 px-4 py-3 font-sans text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-[2px] transition-colors hover:border-brand hover:text-brand">
          {frame.cta}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function HeroStory() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const lastFrame = useRef<number>(-1);
  const [stageScale, setStageScale] = useState(1);
  const [hoverable, setHoverable] = useState(true);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => setStageScale(el.clientWidth / STAGE_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Preload every lotus frame, then paint the first one.
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
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    lastFrame.current = frame;
  };

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  // Gentle spring smoothing — slow, effortless, cinematic scrubbing.
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.5 });

  useMotionValueEvent(p, "change", (v) => {
    setHoverable(v < 0.24);
    // Scrub the lotus open→closed across the second half of the story.
    const t = clamp01((v - 0.52) / (0.98 - 0.52));
    drawLotus(Math.round(t * (LOTUS_FRAMES - 1)));
  });

  // Scroll cue fades away as soon as the story begins.
  const cue = useTransform(p, [0, 0.04], [1, 0]);

  // Title persists across all scenes — drifts up and eases back as the story
  // takes over, keeping a single calm anchor through the sequence.
  const titleY = useTransform(p, [0, 0.5], [170, 0]);
  const titleScale = useTransform(p, [0, 0.5], [1, 0.94]);

  // Scenes hold one-at-a-time with slow, clean cross-fades.
  const jewelry = useTransform(p, [0, 0.16, 0.24], [1, 1, 0]);
  const glowBottom = useTransform(p, [0, 0.4, 0.48], [1, 1, 0]);
  const glowCenter = useTransform(p, [0.44, 0.52, 1], [0, 1, 1]);

  // The lotus canvas fades in once, then scrubs open→closed (see drawLotus).
  const lotusOpacity = useTransform(p, [0.44, 0.54], [0, 1]);
  const lotusScale = useTransform(p, [0.44, 0.6], [0.92, 1]);
  // Three story frames cross-fade as the lotus scrubs open → closed.
  const f1 = useTransform(p, [0.5, 0.57, 0.66, 0.72], [0, 1, 1, 0]);
  const f1Y = useTransform(p, [0.5, 0.57], [40, 0]);
  const f2 = useTransform(p, [0.71, 0.78, 0.85, 0.9], [0, 1, 1, 0]);
  const f2Y = useTransform(p, [0.71, 0.78], [40, 0]);
  const f3 = useTransform(p, [0.88, 0.94, 1], [0, 1, 1]);
  const f3Y = useTransform(p, [0.88, 0.94], [40, 0]);

  return (
    <section ref={wrapRef} className="relative bg-black" style={{ height: "400vh" }}>
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-black">
        <div ref={stageRef} className="absolute inset-0" aria-hidden />
        {/* Single 1440×664 stage, scaled to the viewport width, centred vertically. */}
        <div className="relative shrink-0 origin-center" style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${stageScale})` }}>
          {/* Glows — soft, minimal */}
          <motion.div style={{ opacity: glowBottom }} className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute inset-0" style={{ background: "radial-gradient(60% 90% at 50% 100%, rgba(120,20,55,0.32) 0%, rgba(5,5,5,0) 72%)" }} />
          </motion.div>
          <motion.div style={{ opacity: glowCenter }} className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute inset-0" style={{ background: "radial-gradient(68% 78% at 58% 56%, rgba(150,28,72,0.4) 0%, rgba(5,5,5,0) 68%)" }} />
          </motion.div>

          {/* Scene 1 — jewellery */}
          <motion.div style={{ opacity: jewelry }} className={hoverable ? "" : "pointer-events-none"}>
            {PIECES.map((piece, i) => <JewelleryPiece key={i} p={piece} />)}
          </motion.div>

          {/* Persistent title — Poppins wordmark. Sits BEHIND the lotus (drawn
              after it) and at 50% opacity so it reads as a soft backdrop. */}
          <motion.div style={{ y: titleY, scale: titleScale }} className="pointer-events-none absolute left-0 top-0 flex h-[267px] w-[1440px] items-center justify-center px-[87px]">
            <h1
              className="whitespace-nowrap text-center font-bold leading-none text-white/50"
              style={{ fontFamily: "var(--font-poppins)", fontSize: "150px" }}
            >
              Bhavya Ramesh
            </h1>
          </motion.div>

          {/* Scenes 3 & 4 — lotus open→closed, scrubbed frame-by-frame */}
          <motion.canvas
            ref={canvasRef}
            width={STAGE_W}
            height={STAGE_H}
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{ opacity: lotusOpacity, scale: lotusScale }}
          />
          {/* Frame 01 — open lotus (right) */}
          <motion.div style={{ opacity: f1, y: f1Y }} className="pointer-events-none">
            <WearCopy side="right" frame={FRAMES[0]} />
          </motion.div>
          {/* Frame 02 — closing lotus (left) */}
          <motion.div style={{ opacity: f2, y: f2Y }} className="pointer-events-none">
            <WearCopy side="left" frame={FRAMES[1]} />
          </motion.div>
          {/* Frame 03 — closed bud (left) + CTA */}
          <motion.div style={{ opacity: f3, y: f3Y }}>
            <WearCopy side="left" frame={FRAMES[2]} />
          </motion.div>

        </div>

        {/* Minimal scroll cue */}
        <motion.div
          style={{ opacity: cue }}
          className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
          aria-hidden
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-white/50">Scroll</span>
          <span className="floaty block h-8 w-px bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
