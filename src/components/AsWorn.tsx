"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Brand social logos exported from the Figma As Worn card (YouTube Shorts icon).
const SHARE = [
  { label: "Facebook", src: "/figma/29dd339e761f88e065da7b770f8c81f674f552d0.png" },
  { label: "YouTube", src: "/figma/656c17645bd86c7700f2dd9929db3d6a4e0ba690.png" },
  { label: "Instagram", src: "/figma/10806ffd4d8a9a2fa24d855216da029270da4a75.png" },
];

/**
 * "Jewellery, lived in and made your own." — the AS WORN editorial section
 * (Figma node 427:3769–427:3776): four lifestyle/testimonial cards, each a
 * full-bleed portrait with the wearer's name and a short quote.
 */

type Look = { image: string; name: string; quote: string };

const LOOKS: Look[] = [
  {
    image: "/figma/9b227545e2a9637a4f88dad021a60a3613e290f8.png",
    name: "Aanya S",
    quote:
      "Didn’t think I was a jewellery person until this. Now it’s the first thing I reach for before stepping out…",
  },
  {
    image: "/figma/3a16c9835bee6dfe6169e1bb8ec0509a3fc6b6ee.png",
    name: "Ritvik Kumar",
    quote:
      "Wore this once and suddenly every outfit started making more sense. It just hits different…",
  },
  {
    image: "/figma/d4affb9ba67d82589175eba4ecee2ecbe554baa3.png",
    name: "Meher Dhall",
    quote:
      "Love how it feels rooted but still so unexpected. It’s not traditional, but it still feels like home…",
  },
  {
    image: "/figma/67c28554bb035bb434d67d022a26e5401d67f847.png",
    name: "Ishaan R",
    quote:
      "People keep asking where it’s from—and honestly, I like gatekeeping it a little…",
  },
];

/**
 * `alwaysOn` shows the hovered state permanently (maroon gradient, white
 * name, visible share icons) — used on mobile/touch where there is no hover.
 */
function LookCard({ look, alwaysOn }: { look: Look; alwaysOn?: boolean }) {
  return (
    <article className="group relative aspect-[291/518] overflow-hidden rounded-[6px]">
      <Image
        src={look.image}
        alt={look.name}
        fill
        sizes="(min-width: 1024px) 320px, 80vw"
        className={`object-cover transition-transform duration-500 ${alwaysOn ? "" : "group-hover:scale-105"}`}
      />
      {/* Legibility gradient (always on) */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%)" }}
      />
      {/* Maroon gradient that rises from the bottom on hover (always on for touch) */}
      <div
        aria-hidden
        className={`absolute inset-0 transition-opacity duration-500 ${alwaysOn ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(120,20,55,0.55) 78%, rgba(10,2,6,0.95) 100%)" }}
      />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
        <div>
          <h3 className={`font-sans text-[18px] font-bold transition-colors duration-300 ${alwaysOn ? "text-white" : "text-brand group-hover:text-white"}`}>
            {look.name}
          </h3>
          <p className="mt-1.5 text-[11px] leading-snug text-white/85">{look.quote}</p>
        </div>
        <div className={`flex shrink-0 flex-col gap-2.5 transition-all duration-300 ${alwaysOn ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"}`}>
          {SHARE.map(({ label, src }) => (
            <button key={label} type="button" aria-label={`Share on ${label}`} className="transition-transform hover:scale-110">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={label} className="h-9 w-9 object-contain drop-shadow-lg" />
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}

export function AsWorn({
  eyebrow = "As Worn",
  intro = true,
  id = "as-worn",
}: { eyebrow?: string; intro?: boolean; id?: string } = {}) {
  const ref = useScrollReveal<HTMLDivElement>({ childSelector: "[data-reveal]" });
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const base = el.getBoundingClientRect().left;
    let best = 0, bestD = Infinity;
    Array.from(el.children).forEach((c, i) => {
      const d = Math.abs((c as HTMLElement).getBoundingClientRect().left - base);
      if (d < bestD) { bestD = d; best = i; }
    });
    setActive(best);
  };
  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const n = Math.max(0, Math.min(LOOKS.length - 1, i));
    const c = el.children[n] as HTMLElement;
    const delta = c.getBoundingClientRect().left - el.getBoundingClientRect().left;
    el.scrollTo({ left: el.scrollLeft + delta, behavior: "smooth" });
  };

  return (
    <section id={id} className={intro ? "relative bg-black px-5 py-20 sm:px-8 sm:py-24" : "relative px-5 py-16 sm:px-12"}>
      <div ref={ref} className={`mx-auto ${intro ? "max-w-[1400px]" : "max-w-[1360px]"}`}>
        {intro ? (
          <>
            <p data-reveal className="text-[16px] uppercase tracking-[0.18em] text-white/90">
              {eyebrow}
            </p>
            <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <h2
                data-reveal
                className="max-w-[700px] font-serif text-[40px] leading-[1.05] text-white sm:text-[56px] lg:text-[65px]"
              >
                Jewellery, lived in and made your own.
              </h2>
              <div data-reveal className="lg:max-w-[340px]">
                <p className="text-[14px] leading-relaxed text-white/70">
                  From everyday moments to standout fits—this is how the pieces come
                  alive.
                </p>
                <p className="mt-4 text-right text-[14px] leading-relaxed text-white/90 lg:text-left">
                  <span className="font-semibold text-brand">Tag @bhavyaramesh</span>{" "}
                  and show us how you wear it.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <h2 data-reveal className="text-[15px] uppercase tracking-[0.2em] text-white/90">{eyebrow}</h2>
            <Link href="#as-worn" className="text-sm tracking-wide text-white/80 underline-offset-4 transition-colors hover:text-brand hover:underline">
              View More
            </Link>
          </div>
        )}

        {/* Tablet / desktop grid */}
        <div className="mt-12 hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-4">
          {LOOKS.map((look) => (
            <div data-reveal key={look.name} className="h-full">
              <LookCard look={look} />
            </div>
          ))}
        </div>

        {/* Mobile carousel — one card + peek, dot pagination */}
        <div className="mt-10 sm:hidden" data-reveal>
          <div
            ref={trackRef}
            onScroll={onScroll}
            className="no-scrollbar -mr-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pr-5"
          >
            {LOOKS.map((look) => (
              <div key={look.name} className="w-[80%] shrink-0 snap-start">
                <LookCard look={look} alwaysOn />
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {LOOKS.map((look, i) => (
              <button
                key={look.name}
                type="button"
                aria-label={`Go to ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-brand" : "w-1.5 bg-white/30"}`}
              />
            ))}
          </div>
        </div>

        {intro && (
          <div className="mt-8 flex justify-center sm:justify-end" data-reveal>
            <Link
              href="#as-worn"
              className="text-sm tracking-wide text-white/90 underline underline-offset-4 transition-colors hover:text-brand sm:no-underline sm:hover:underline"
            >
              View More
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
