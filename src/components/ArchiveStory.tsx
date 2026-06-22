"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion";

/**
 * "THE ARCHIVE" — Figma Component 48 (node 361:4567): a horizontal three-panel
 * story rebuilt as a pinned, scroll-driven sequence (the same treatment as the
 * hero):
 *
 *   1. jewellery scatter (silver, gold on hover)
 *   2. jewellery + the "THE ARCHIVE" intro copy
 *   3. the archive collection cards (Jalebi, Sunglasses, Ancient Aliens,
 *      Naraka, Harmony, Poison)
 */

const STAGE_W = 1440;
const STAGE_H = 621;
const ASSET = (h: string) => `/figma/${h}`;

type Variant = { src: string; imgClass: string };
type Piece = {
  left: number; top: number; width: number; height: number; rotate: number;
  silver: Variant; gold?: Variant; goldFilter?: boolean; delay: number;
};

// Same silver jewellery cut-outs as the hero (silver → gold on hover).
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

const ARCHIVE = [
  { name: "Jalebi", image: "3a69dfea0f9b65b9f138b000294aa2cbcb11a293.png", desc: "Inspired by iconic curves. Designed to turn indulgence into expression." },
  { name: "Sunglasses", image: "39f14933293dfcfa8f185a4329ccf903b29121f6.png", desc: "Sharp frames. Sharper presence. See differently. Be seen instantly." },
  { name: "Ancient Aliens", image: "8429e765d9ec2450d8c6a9e4fefc431db100b199.png", desc: "Otherworldly forms. Earth-bound impact. Made for beings who don't belong." },
  { name: "Naraka", image: "8f2d288d3b09ffbf69b2e079a79da6da9032b888.png", desc: "A moment of crisis turned into a lifetime. In Yamaloka I now reside, in Naraka I have arrived." },
];

export function ArchiveStory() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageScale, setStageScale] = useState(1);
  const [cardsActive, setCardsActive] = useState(false);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => setStageScale(el.clientWidth / STAGE_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.5 });

  useMotionValueEvent(p, "change", (v) => setCardsActive(v > 0.66));

  const jewelry = useTransform(p, [0, 0.55, 0.66], [1, 1, 0]);
  const intro = useTransform(p, [0.28, 0.4, 0.55, 0.64], [0, 1, 1, 0]);
  const introY = useTransform(p, [0.28, 0.4], [30, 0]);
  const cards = useTransform(p, [0.64, 0.74, 1], [0, 1, 1]);
  const cardsY = useTransform(p, [0.64, 0.74], [40, 0]);
  // Grid + glow belong only to the "THE ARCHIVE" intro scene; the jewellery
  // and cards scenes stay pure black.
  const bgFade = useTransform(p, [0.24, 0.4, 0.55, 0.66], [0, 1, 1, 0]);

  return (
    <section ref={wrapRef} className="relative bg-black" style={{ height: "320vh" }}>
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-black">
        <div ref={stageRef} className="absolute inset-0" aria-hidden />

        {/* Subtle grid + maroon glow (fade out for the cards scene) */}
        <motion.div style={{ opacity: bgFade }} className="pointer-events-none absolute inset-0" aria-hidden>
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "72px 72px",
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(60% 80% at 50% 60%, rgba(120,20,55,0.3) 0%, rgba(5,5,5,0) 70%)" }}
          />
        </motion.div>

        {/* Scenes 1 & 2 — jewellery scatter (scaled 1440 stage) */}
        <motion.div
          style={{ opacity: jewelry }}
          className={`absolute inset-0 flex items-center justify-center ${cardsActive ? "pointer-events-none" : ""}`}
        >
          <div className="relative origin-center" style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${stageScale})` }}>
            {PIECES.map((pc, i) => (
              <div key={i} className="absolute" style={{ left: pc.left, top: pc.top, width: pc.width, height: pc.height }}>
                <div className="floaty h-full w-full" style={{ animationDelay: `${pc.delay}s` }}>
                  <div className="group h-full w-full" style={{ transform: `rotate(${pc.rotate}deg)` }}>
                    <div className="relative h-full w-full overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ASSET(pc.silver.src)} alt="" aria-hidden draggable={false}
                        className={`absolute max-w-none transition-all duration-300 ${pc.silver.imgClass} ${pc.gold ? "group-hover:opacity-0" : ""} ${pc.goldFilter ? "gold-on-hover" : ""}`} />
                      {pc.gold && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={ASSET(pc.gold.src)} alt="" aria-hidden draggable={false}
                          className={`absolute max-w-none opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${pc.gold.imgClass}`} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scene 2 — intro copy */}
        <motion.div style={{ opacity: intro, y: introY }} className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="text-[13px] uppercase tracking-[0.35em] text-white/90">The Archive</p>
          <p className="mt-6 max-w-[540px] text-[15px] leading-relaxed text-white">
            Not just collections. Different states of{" "}
            <span className="text-brand">expression</span>. Each drop explores a{" "}
            <span className="text-brand">new identity</span> shaped by{" "}
            <span className="text-brand">myth</span>,{" "}
            <span className="text-brand">movement</span>, and{" "}
            <span className="text-brand">rebellion</span>. Find the one that feels
            like you.
          </p>
        </motion.div>

        {/* Scene 3 — archive cards */}
        <motion.div
          style={{ opacity: cards, y: cardsY }}
          className={`absolute inset-0 flex items-center ${cardsActive ? "" : "pointer-events-none"}`}
        >
          <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8">
            {/* Carousel arrows */}
            <div className="mb-6 flex items-center gap-5 text-white/80">
              <button type="button" aria-label="Previous" className="transition-colors hover:text-brand">
                <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden><path d="M8 1 1 8l7 7M1 8h21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button type="button" aria-label="Next" className="transition-colors hover:text-brand">
                <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden><path d="M14 1l7 7-7 7M21 8H0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {ARCHIVE.map((c) => (
                <article key={c.name}>
                  <div className="group relative aspect-[292/165] w-full overflow-hidden rounded-[6px]">
                    <Image src={ASSET(c.image)} alt={c.name} fill sizes="(min-width:1024px) 320px, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <h3 className="mt-4 font-serif text-[22px] text-brand">{c.name}</h3>
                  <p className="mt-2 text-[12px] leading-relaxed text-white/80">{c.desc}</p>
                  <Link href="#archive" className="mt-4 inline-block text-[12px] text-white/90 underline underline-offset-4 transition-colors hover:text-brand">
                    View More
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
