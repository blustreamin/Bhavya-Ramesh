"use client";

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

export function AsWorn() {
  const ref = useScrollReveal<HTMLDivElement>({ childSelector: "[data-reveal]" });

  return (
    <section className="relative bg-black px-5 py-24 sm:px-8">
      <div ref={ref} className="mx-auto max-w-[1400px]">
        <p data-reveal className="text-[16px] uppercase tracking-[0.18em] text-white/90">
          As Worn
        </p>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2
            data-reveal
            className="max-w-[700px] font-serif text-[40px] leading-[1.05] text-white sm:text-[56px] lg:text-[65px]"
          >
            Jewellery, lived in and made your own.
          </h2>
          <div data-reveal className="max-w-[340px]">
            <p className="text-[14px] leading-relaxed text-white/70">
              From everyday moments to standout fits—this is how the pieces come
              alive.
            </p>
            <p className="mt-4 text-[14px] leading-relaxed text-white/90">
              <span className="font-semibold text-brand">Tag @bhavyaramesh</span>{" "}
              and show us how you wear it.
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {LOOKS.map((look) => (
            <article
              key={look.name}
              data-reveal
              className="group relative aspect-[291/518] overflow-hidden rounded-[6px]"
            >
              <Image
                src={look.image}
                alt={look.name}
                fill
                sizes="(min-width: 1024px) 320px, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Legibility gradient (always on) */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%)",
                }}
              />
              {/* Maroon gradient that rises from the bottom on hover */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(120,20,55,0.55) 78%, rgba(10,2,6,0.95) 100%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                <div>
                  <h3 className="font-sans text-[18px] font-bold text-brand transition-colors duration-300 group-hover:text-white">
                    {look.name}
                  </h3>
                  <p className="mt-1.5 text-[11px] leading-snug text-white/85">
                    {look.quote}
                  </p>
                </div>
                {/* Share icons reveal on hover */}
                <div className="flex shrink-0 translate-y-1 flex-col gap-2.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {SHARE.map(({ label, src }) => (
                    <button
                      key={label}
                      type="button"
                      aria-label={`Share on ${label}`}
                      className="transition-transform hover:scale-110"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={label} className="h-9 w-9 object-contain drop-shadow-lg" />
                    </button>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-end" data-reveal>
          <Link
            href="#as-worn"
            className="text-sm tracking-wide text-white/90 underline-offset-4 transition-colors hover:text-brand hover:underline"
          >
            View More
          </Link>
        </div>
      </div>
    </section>
  );
}
