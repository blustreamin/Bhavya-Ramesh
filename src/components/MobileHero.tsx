"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mobile hero — Figma "Mobile Home" hero (node 628:4313, 402×818): a static
 * vertical jewellery scatter with the two-line "Bhavya / Ramesh" wordmark.
 * Rendered only below the lg breakpoint (desktop uses the scroll-driven
 * HeroStory). The fixed 402px stage is scaled to the viewport width.
 */

const STAGE_W = 402;
const STAGE_H = 818;
const ASSET = (h: string) => `/figma/${h}`;

type Piece = {
  left: number; top: number; width: number; height: number; rotate: number;
  cw: number; ch: number; src: string; imgClass: string;
};

const PIECES: Piece[] = [
  // skull (top-left)
  { left: 1, top: 23, width: 152.4, height: 162.1, rotate: 21.2, cw: 113, ch: 130,
    src: "0ac665a7b31c1af331d3a4b60fcc2f206b879fe6.png",
    imgClass: "h-[354.43%] left-[-92.22%] top-[-108.62%] w-[279.07%]" },
  // hoop figure (top-right)
  { left: 150.59, top: -0.58, width: 221.9, height: 244.6, rotate: 19.98, cw: 163, ch: 201,
    src: "57e6f4884472d2402cc592f515f5361bbfdd54fd.png",
    imgClass: "inset-0 size-full object-bottom" },
  // bracelet (left)
  { left: 16, top: 206, width: 143, height: 83, rotate: 0, cw: 143, ch: 83,
    src: "95beb547aaa54910ead91e1a68155105422f32ed.png",
    imgClass: "h-[200.75%] left-0 top-[-46.79%] w-full" },
  // sunglasses (right)
  { left: 147, top: 192, width: 230.8, height: 127.7, rotate: -11.5, cw: 218, ch: 86,
    src: "2a355c7498cf8b92e7a6ac3c9ece1bd727aa71eb.png",
    imgClass: "h-[338.26%] left-0 top-[-121.13%] w-full" },
  // long necklace (bottom-left)
  { left: 1, top: 526, width: 193.1, height: 291.5, rotate: 12.36, cw: 139, ch: 268,
    src: "21a0dd581cc789481ac99ca16744ccf7c1ecb7c4.png",
    imgClass: "h-[126.04%] left-[-34.91%] top-[-14.29%] w-[166.67%]" },
  // earrings (bottom-right)
  { left: 184, top: 530, width: 140.3, height: 209.9, rotate: -10.07, cw: 108, ch: 194,
    src: "4d2690035c1b9050885ab73c610776d928674a24.png",
    imgClass: "h-[163.56%] left-[-50.95%] top-[-21.72%] w-[201.52%]" },
  // pendant (large, bottom — mostly clipped)
  { left: -110.24, top: 644, width: 804.9, height: 1260.6, rotate: 21.47, cw: 393, ch: 1200,
    src: "1f474d211aff17d1dedca3194dfbb8c53fc87608.png",
    imgClass: "h-[169.03%] left-[-128.12%] top-[-36.39%] w-[354.17%]" },
];

export function MobileHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scale, setScale] = useState(1);

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
      className="relative w-full overflow-hidden bg-black lg:hidden"
      style={{ height: STAGE_H * scale }}
    >
      {/* maroon glow at the base */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        style={{ background: "radial-gradient(70% 80% at 50% 100%, rgba(120,20,55,0.4) 0%, rgba(5,5,5,0) 70%)" }}
      />

      <div className="absolute left-0 top-0 origin-top-left" style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}>
        {/* Title */}
        <div className="absolute left-0 top-[276px] flex h-[267px] w-[387px] items-center justify-center px-[20px]">
          <h1
            className="text-center font-bold leading-none text-white"
            style={{ fontFamily: "var(--font-poppins)", fontSize: "66px", lineHeight: "74px" }}
          >
            Bhavya
            <br />
            Ramesh
          </h1>
        </div>

        {/* Jewellery */}
        {PIECES.map((p, i) => (
          <div key={i} className="absolute flex items-center justify-center" style={{ left: p.left, top: p.top, width: p.width, height: p.height }}>
            <div style={{ transform: `rotate(${p.rotate}deg)` }}>
              <div className="relative overflow-hidden" style={{ width: p.cw, height: p.ch }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ASSET(p.src)} alt="" aria-hidden draggable={false} className={`absolute max-w-none ${p.imgClass}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
