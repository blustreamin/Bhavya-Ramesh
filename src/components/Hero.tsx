"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * Hero — faithful recreation of the Figma "HOME PAGE 4" hero (node 491:4024).
 *
 * The design is a fixed 1440×664 stage with a giant faint "Bhavya Ramesh"
 * title and real jewellery cut-outs scattered around it at exact coordinates
 * and rotations. We render that stage at its native pixel positions and scale
 * the whole thing proportionally to the viewport width, so it stays
 * pixel-accurate to the design at every breakpoint.
 *
 * Each jewellery piece is a Figma component with two variants — a silver
 * resting finish and a gold "Default" finish shown while hovering. We
 * reproduce that interaction as a cross-fade from the silver to the gold
 * cut-out on hover.
 */

const STAGE_W = 1440;
const STAGE_H = 664;

const ASSET = (h: string) => `/figma/${h}`;

type Variant = {
  src: string;
  /** Inner <img> crop classes copied verbatim from the Figma export. */
  imgClass: string;
};

type Piece = {
  /** Visible image box, top-left, in stage px (centre-matched to the Figma rotation bbox). */
  left: number;
  top: number;
  width: number;
  height: number;
  rotate: number;
  /** Resting (silver) finish. */
  silver: Variant;
  /** Hover (gold) finish — omitted for pieces without a gold variant in Figma. */
  gold?: Variant;
  /** Float animation offset so the pieces don't bob in unison. */
  delay: number;
};

// Coordinates + per-variant crops derived directly from the Figma node 491:4024.
const PIECES: Piece[] = [
  {
    // image 20 — top-left necklace band
    left: 49,
    top: 62,
    width: 210,
    height: 122,
    rotate: 0,
    silver: {
      src: "95beb547aaa54910ead91e1a68155105422f32ed.png",
      imgClass: "h-[200.75%] left-0 top-[-46.79%] w-full",
    },
    gold: {
      src: "caddd41f91522c9bccca2f032c557f1827533177.png",
      imgClass: "h-[219.09%] left-[-0.07%] top-[-54.55%] w-[100.14%]",
    },
    delay: 0,
  },
  {
    // image 25 — skull ring, top centre
    left: 515,
    top: 86,
    width: 172,
    height: 197,
    rotate: 0,
    silver: {
      src: "0ac665a7b31c1af331d3a4b60fcc2f206b879fe6.png",
      imgClass: "h-[354.43%] left-[-92.22%] top-[-108.62%] w-[279.07%]",
    },
    gold: {
      src: "7984d4b313728d13da8d454c336b438c671fa723.png",
      imgClass: "h-[354.43%] left-[-93.39%] top-[-108.62%] w-[303.04%]",
    },
    delay: 1.1,
  },
  {
    // hoop figure (trapeze), upper centre-right — single variant, no hover swap
    left: 822.55,
    top: -56.15,
    width: 243,
    height: 300,
    rotate: 13.94,
    silver: {
      src: "57e6f4884472d2402cc592f515f5361bbfdd54fd.png",
      imgClass: "inset-0 size-full object-bottom",
    },
    delay: 0.6,
  },
  {
    // image (necklace) — top-right, bleeds above the fold — single variant
    left: 1197.82,
    top: -212.31,
    width: 231,
    height: 444,
    rotate: -7.17,
    silver: {
      src: "21a0dd581cc789481ac99ca16744ccf7c1ecb7c4.png",
      imgClass: "h-[126.04%] left-[-34.91%] top-[-14.29%] w-[166.67%]",
    },
    delay: 1.6,
  },
  {
    // image 32 — earrings, centre-right
    left: 768,
    top: 373.57,
    width: 157,
    height: 282,
    rotate: 15.09,
    silver: {
      src: "4d2690035c1b9050885ab73c610776d928674a24.png",
      imgClass: "h-[163.56%] left-[-50.95%] top-[-21.72%] w-[201.52%]",
    },
    gold: {
      src: "ffd0a2fb8ad4f3f5f79fab19ba8ab6e7e14ea5d6.png",
      imgClass: "h-[153.48%] left-[-46.98%] top-[-25.45%] w-[200%]",
    },
    delay: 0.9,
  },
  {
    // image 22 — pendant/spike, far right
    left: 1271.06,
    top: 385.2,
    width: 78,
    height: 238,
    rotate: 16.99,
    silver: {
      src: "1f474d211aff17d1dedca3194dfbb8c53fc87608.png",
      imgClass: "h-[169.03%] left-[-128.12%] top-[-36.39%] w-[354.17%]",
    },
    gold: {
      src: "2e78e9da92e032cfa2ddab3251a428c5f2779077.png",
      imgClass: "h-[176.9%] left-[-133.57%] top-[-37.66%] w-[362.14%]",
    },
    delay: 2,
  },
  {
    // image 19 — sunglasses, bottom-left
    left: 57,
    top: 458.4,
    width: 329,
    height: 130,
    rotate: 8.8,
    silver: {
      src: "2a355c7498cf8b92e7a6ac3c9ece1bd727aa71eb.png",
      imgClass: "h-[338.26%] left-0 top-[-121.13%] w-full",
    },
    gold: {
      src: "441b861038e6780b5653c72cc927d58f67794f63.png",
      imgClass: "inset-0 size-full object-cover",
    },
    delay: 0.3,
  },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scale, setScale] = useState(1);

  // Scale the fixed 1440px stage to the actual section width.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / STAGE_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Bhavya Ramesh"
      className="relative w-full overflow-hidden bg-black"
      style={{ aspectRatio: `${STAGE_W} / ${STAGE_H}` }}
    >
      {/* Fixed-dimension stage, scaled proportionally to the viewport. */}
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: STAGE_W,
          height: STAGE_H,
          transform: `scale(${scale})`,
        }}
      >
        {/* Giant faint title — flat Figma fill rgba(255,255,255,0.1). */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
          className="absolute left-0 top-[170px] flex h-[267px] w-[1440px] items-center justify-center px-[87px]"
        >
          <h1
            className="w-[1260px] text-center font-serif leading-none text-white/10"
            style={{ fontSize: "189px" }}
          >
            Bhavya Ramesh
          </h1>
        </motion.div>

        {/* Scattered jewellery pieces */}
        {PIECES.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 + i * 0.08 }}
            className="absolute"
            style={{ left: p.left, top: p.top, width: p.width, height: p.height }}
          >
            <div className="floaty h-full w-full" style={{ animationDelay: `${p.delay}s` }}>
              <div
                className="group h-full w-full"
                style={{ transform: `rotate(${p.rotate}deg)` }}
              >
                <div className="relative h-full w-full overflow-hidden">
                  {/* Silver (resting) finish */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ASSET(p.silver.src)}
                    alt=""
                    aria-hidden
                    draggable={false}
                    className={`absolute max-w-none transition-opacity duration-300 ${p.silver.imgClass} ${
                      p.gold ? "group-hover:opacity-0" : ""
                    }`}
                  />
                  {/* Gold (hover) finish — cross-fades in on hover */}
                  {p.gold && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ASSET(p.gold.src)}
                      alt=""
                      aria-hidden
                      draggable={false}
                      className={`absolute max-w-none opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${p.gold.imgClass}`}
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Deep maroon glow rising from the bottom of the fold. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        aria-hidden
        style={{
          background:
            "radial-gradient(60% 90% at 50% 100%, rgba(120,20,55,0.45) 0%, rgba(5,5,5,0) 70%)",
        }}
      />
    </section>
  );
}
