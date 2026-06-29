"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion";
import { ChevronDown } from "./ui/Icons";

/**
 * Mobile "THE ARCHIVE" — the same scroll-driven story as the desktop
 * ArchiveStory, but using the Figma mobile portrait layout (node 628:4756):
 *   1. portrait jewellery scatter on a faint grid
 *   2. + the "THE ARCHIVE" intro copy
 *   3. the archive collection cards (carousel)
 */

const STAGE_W = 402;
const STAGE_H = 818;
const ASSET = (h: string) => `/figma/${h}`;

type Piece = {
  l: number; t: number; w: number; h: number; r: number;
  cw: number; ch: number; src: string; cls: string;
};

const PIECES: Piece[] = [
  { l: 19, t: 13, w: 148.947, h: 159.541, r: -18.85, cw: 113, ch: 130,
    src: "0ac665a7b31c1af331d3a4b60fcc2f206b879fe6.png",
    cls: "h-[354.43%] left-[-92.22%] top-[-108.62%] w-[279.07%]" },
  { l: 214, t: 22, w: 173.193, h: 284.017, r: 7.59, cw: 139, ch: 268,
    src: "21a0dd581cc789481ac99ca16744ccf7c1ecb7c4.png",
    cls: "h-[126.04%] left-[-34.91%] top-[-14.29%] w-[166.67%]" },
  { l: 37, t: 181, w: 153.044, h: 214.83, r: 14.47, cw: 108, ch: 194,
    src: "4d2690035c1b9050885ab73c610776d928674a24.png",
    cls: "h-[163.56%] left-[-50.95%] top-[-21.72%] w-[201.52%]" },
  { l: 142, t: 369, w: 143, h: 83, r: 0, cw: 143, ch: 83,
    src: "95beb547aaa54910ead91e1a68155105422f32ed.png",
    cls: "h-[200.75%] left-0 top-[-46.79%] w-full" },
  { l: 10, t: 460, w: 204.469, h: 233.824, r: -11.89, cw: 166, ch: 204,
    src: "57e6f4884472d2402cc592f515f5361bbfdd54fd.png",
    cls: "inset-0 size-full object-bottom" },
  { l: 270, t: 460, w: 91.876, h: 157.793, r: -17.52, cw: 49, ch: 150,
    src: "1f474d211aff17d1dedca3194dfbb8c53fc87608.png",
    cls: "h-[169.03%] left-[-128.12%] top-[-36.39%] w-[354.17%]" },
  { l: 154, t: 660, w: 232.594, h: 137.877, r: 14.51, cw: 218, ch: 86,
    src: "2a355c7498cf8b92e7a6ac3c9ece1bd727aa71eb.png",
    cls: "h-[338.26%] left-0 top-[-121.13%] w-full" },
];

const ARCHIVE = [
  { name: "Jalebi", image: "3a69dfea0f9b65b9f138b000294aa2cbcb11a293.png", desc: "Inspired by iconic curves. Designed to turn indulgence into expression." },
  { name: "Sunglasses", image: "39f14933293dfcfa8f185a4329ccf903b29121f6.png", desc: "Sharp frames. Sharper presence. See differently. Be seen instantly." },
  { name: "Ancient Aliens", image: "8429e765d9ec2450d8c6a9e4fefc431db100b199.png", desc: "Otherworldly forms. Earth-bound impact. Made for beings who don't belong." },
  { name: "Naraka", image: "8f2d288d3b09ffbf69b2e079a79da6da9032b888.png", desc: "A moment of crisis turned into a lifetime. In Yamaloka I now reside, in Naraka I have arrived." },
];

export function MobileArchive() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [cardIdx, setCardIdx] = useState(0);
  const [cardsActive, setCardsActive] = useState(false);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / STAGE_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.5 });
  useMotionValueEvent(p, "change", (v) => setCardsActive(v > 0.72));

  // Scene 1: jewellery on black (no grid). It fades out before the intro.
  const jewelry = useTransform(p, [0, 0.2, 0.3], [1, 1, 0]);
  // Scene 2: the grid + intro copy appear together (no jewellery behind).
  const gridFade = useTransform(p, [0.3, 0.42, 0.64, 0.74], [0, 1, 1, 0]);
  const intro = useTransform(p, [0.34, 0.46, 0.64, 0.74], [0, 1, 1, 0]);
  const introY = useTransform(p, [0.34, 0.46], [24, 0]);
  // Scene 3: cards.
  const cards = useTransform(p, [0.7, 0.82, 1], [0, 1, 1]);
  const cardsY = useTransform(p, [0.7, 0.82], [30, 0]);

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const n = Math.max(0, Math.min(ARCHIVE.length - 1, i));
    el.scrollTo({ left: n * el.clientWidth, behavior: "smooth" });
  };

  return (
    <section ref={wrapRef} className="relative bg-black lg:hidden" style={{ height: "300vh" }}>
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-black">
        <div ref={stageRef} className="absolute inset-0" aria-hidden />

        {/* Grid — only behind the intro copy (scene 2), never with the jewellery */}
        <motion.div
          aria-hidden
          style={{ opacity: gridFade }}
          className="pointer-events-none absolute inset-0"
        >
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
        </motion.div>

        {/* Scene 1 — portrait jewellery scatter on black (no grid) */}
        <motion.div style={{ opacity: jewelry }} className="absolute inset-0 flex items-center justify-center">
          <div className="relative shrink-0 origin-center" style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}>
            {PIECES.map((pc, i) => (
              <div key={i} className="absolute flex items-center justify-center" style={{ left: pc.l, top: pc.t, width: pc.w, height: pc.h }}>
                <div style={{ transform: `rotate(${pc.r}deg)` }}>
                  <div className="relative overflow-hidden" style={{ width: pc.cw, height: pc.ch }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ASSET(pc.src)} alt="" aria-hidden draggable={false} className={`absolute max-w-none ${pc.cls}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scene 2 — intro copy */}
        <motion.div style={{ opacity: intro, y: introY }} className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
          <p className="text-[12px] uppercase tracking-[0.35em] text-white/90">The Archive</p>
          <p className="mt-5 max-w-[340px] text-[15px] leading-relaxed text-white">
            Not just collections. Different states of{" "}
            <span className="text-brand">expression</span>. Each drop explores a{" "}
            <span className="text-brand">new identity</span> shaped by{" "}
            <span className="text-brand">myth</span>,{" "}
            <span className="text-brand">movement</span>, and{" "}
            <span className="text-brand">rebellion</span>. Find the one that feels
            like you.
          </p>
        </motion.div>

        {/* Scene 3 — archive cards carousel */}
        <motion.div
          style={{ opacity: cards, y: cardsY }}
          className={`absolute inset-0 flex flex-col justify-center px-5 ${cardsActive ? "" : "pointer-events-none"}`}
        >
          <div
            ref={trackRef}
            onScroll={() => {
              const el = trackRef.current;
              if (el) setCardIdx(Math.round(el.scrollLeft / el.clientWidth));
            }}
            className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          >
            {ARCHIVE.map((c) => (
              <div key={c.name} className="w-full shrink-0 snap-start px-1">
                <div className="relative aspect-[292/200] w-full overflow-hidden rounded-[6px]">
                  <Image src={ASSET(c.image)} alt={c.name} fill sizes="100vw" className="object-cover" />
                </div>
                <h3 className="mt-4 font-serif text-[24px] text-brand">{c.name}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/80">{c.desc}</p>
                <Link href="#archive" className="mt-4 inline-block text-[13px] text-white/90 underline underline-offset-4 transition-colors hover:text-brand">
                  View More
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button type="button" aria-label="Previous" onClick={() => goTo(cardIdx - 1)} className="text-brand transition-opacity hover:opacity-70">
              <ChevronDown className="h-5 w-5 rotate-90" />
            </button>
            <div className="flex items-center gap-2">
              {ARCHIVE.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  aria-label={`Go to ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all ${i === cardIdx ? "w-5 bg-brand" : "w-1.5 bg-white/30"}`}
                />
              ))}
            </div>
            <button type="button" aria-label="Next" onClick={() => goTo(cardIdx + 1)} className="text-brand transition-opacity hover:opacity-70">
              <ChevronDown className="h-5 w-5 -rotate-90" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
