"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { featuredProducts } from "@/lib/products";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ProductCard } from "./ProductCard";
import { PlusIcon, ChevronDown } from "./ui/Icons";

/**
 * "Built from mythology. Designed for now." — the brand / Why We Exist
 * section (Figma 541:4116–541:4141).
 *
 *  - Desktop (lg): two columns, each a vertical scroll-snap slider.
 *  - Mobile: the founder image+copy as a horizontal carousel (with a ↗ next
 *    arrow) and the featured products as a one-card carousel with dot/arrow
 *    pagination.
 */

const FOUNDER_SLIDES = [
  {
    image: "/figma/a84d74e88d85a896816c92501c398023d08a065d.png",
    title: "The Beginning",
    text: "Founded in 2018 by Bhavna Ramesh, the brand reimagines sterling silver through sculptural design, cultural storytelling, and uncompromising craftsmanship. Every piece is created with the belief that jewellery should outlive trends, becoming cherished across generations.",
  },
  {
    image: "/figma/75b4b285ea05ee7517093a2a44d08a3ec095aedf.png",
    title: "The Craft",
    text: "Every piece begins with an idea, brought to life by skilled Indian artisans who shape, refine, and honour every detail. Craftsmanship isn't our process—it's the language every collection speaks.",
  },
  {
    image: "/figma/6738c5a74801a038f077ee91e9bff23876ac38c7.png",
    title: "The Making",
    text: "From Jaipur's ateliers to our studio, every creation is shaped with intention, precision, and patience. Because extraordinary jewellery isn't rushed—it evolves, one meticulous detail at a time.",
  },
];

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BrandStory() {
  const ref = useScrollReveal<HTMLDivElement>({ childSelector: "[data-reveal]" });
  const founderRef = useRef<HTMLDivElement>(null);
  const featRef = useRef<HTMLDivElement>(null);
  const [founderIdx, setFounderIdx] = useState(0);
  const [featIdx, setFeatIdx] = useState(0);

  const scrollTo = (el: HTMLDivElement | null, idx: number, len: number) => {
    if (!el) return;
    const i = Math.max(0, Math.min(len - 1, idx));
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };
  const onScroll = (el: HTMLDivElement | null, set: (n: number) => void) => {
    if (!el) return;
    set(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <section className="relative overflow-hidden bg-black px-5 py-20 sm:px-8 sm:py-24">
      {/* Cool grey gradient backdrop (Figma mask-group background). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(125% 105% at 50% -22%, #7b7c8e 0%, #55565f 20%, #26262c 44%, #050506 72%)",
        }}
      />

      <div ref={ref} className="relative mx-auto max-w-[1400px]">
        {/* ===================== DESKTOP ===================== */}
        <div className="hidden gap-14 lg:grid lg:grid-cols-[1.5fr_1fr]">
          {/* Left — brand statement + founder slider */}
          <div className="flex flex-col">
            <p className="text-[16px] uppercase tracking-[0.18em] text-white">Why We Exist</p>
            <h2 className="mt-6 max-w-[640px] font-serif text-[65px] leading-[1.05] text-white">
              Built from mythology. Designed for now.
            </h2>
            <div className="no-scrollbar mt-12 h-[500px] snap-y snap-mandatory overflow-y-auto">
              {FOUNDER_SLIDES.map((slide, i) => (
                <article key={i} className="flex snap-start gap-6 pb-12">
                  <span aria-hidden className="mt-1 h-[88px] w-px shrink-0 bg-white/40" />
                  <div className="w-full max-w-[460px]">
                    <div className="relative aspect-[12/7] w-full overflow-hidden">
                      <Image src={slide.image} alt="Bhavya Ramesh atelier" fill sizes="460px" className="object-cover grayscale" />
                    </div>
                    <p className="mt-6 text-[13px] uppercase tracking-[0.22em] text-brand">{slide.title}</p>
                    <p className="mt-3 text-[14px] leading-relaxed text-white">{slide.text}</p>
                    <span className="mt-6 block h-px w-full bg-brand/70" />
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right — featured products slider */}
          <div className="flex flex-col">
            <p className="text-[16px] uppercase tracking-[0.18em] text-white">Featured Products</p>
            <div className="mt-6 flex gap-6">
              <span aria-hidden className="mt-1 h-[88px] w-px shrink-0 bg-white/40" />
              <div className="flex-1">
                <div className="no-scrollbar h-[520px] snap-y snap-mandatory space-y-6 overflow-y-auto">
                  {featuredProducts.map((product) => (
                    <div key={product.id} className="h-[500px] snap-start">
                      <ProductCard product={product} control="toggle" />
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end pr-4">
                  <PlusIcon className="h-6 w-6 text-white/80" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== MOBILE ===================== */}
        <div className="lg:hidden">
          <p data-reveal className="text-[16px] uppercase tracking-[0.18em] text-white">Why We Exist</p>
          <h2 data-reveal className="mt-5 font-serif text-[40px] leading-[1.05] text-white sm:text-[56px]">
            Built from mythology. Designed for now.
          </h2>

          {/* Founder carousel */}
          <div
            ref={founderRef}
            onScroll={() => onScroll(founderRef.current, setFounderIdx)}
            className="no-scrollbar mt-10 flex snap-x snap-mandatory overflow-x-auto"
          >
            {FOUNDER_SLIDES.map((slide, i) => (
              <div key={i} className="flex w-full shrink-0 snap-start gap-5 pr-px">
                <span aria-hidden className="mt-1 h-[80px] w-px shrink-0 bg-white/40" />
                <div className="flex-1">
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image src={slide.image} alt="Bhavya Ramesh atelier" fill sizes="100vw" className="object-cover grayscale" />
                  </div>
                  <div className="mt-5 flex items-start gap-4">
                    <button
                      type="button"
                      aria-label="Next"
                      onClick={() => scrollTo(founderRef.current, (i + 1) % FOUNDER_SLIDES.length, FOUNDER_SLIDES.length)}
                      className="shrink-0 text-white transition-colors hover:text-brand"
                    >
                      <ArrowUpRight className="h-12 w-12" />
                    </button>
                    <div>
                      <p className="text-[12px] uppercase tracking-[0.22em] text-brand">{slide.title}</p>
                      <p className="mt-2 text-[13px] leading-relaxed text-white">{slide.text}</p>
                    </div>
                  </div>
                  <span className="mt-5 block h-px w-full bg-brand/70" />
                </div>
              </div>
            ))}
          </div>

          {/* Founder pagination dots */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {FOUNDER_SLIDES.map((slide, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => scrollTo(founderRef.current, i, FOUNDER_SLIDES.length)}
                className={`h-1.5 rounded-full transition-all ${i === founderIdx ? "w-5 bg-brand" : "w-1.5 bg-white/30"}`}
              />
            ))}
          </div>

          {/* Featured products */}
          <div className="mt-12 flex items-center justify-between">
            <p data-reveal className="text-[16px] uppercase tracking-[0.18em] text-white">Featured Products</p>
            <Link href="#featured" className="text-sm tracking-wide text-white/90 underline underline-offset-4 transition-colors hover:text-brand">
              View More
            </Link>
          </div>
          <div
            ref={featRef}
            onScroll={() => onScroll(featRef.current, setFeatIdx)}
            className="no-scrollbar mt-6 flex snap-x snap-mandatory overflow-x-auto"
          >
            {featuredProducts.map((product) => (
              <div key={product.id} className="w-full shrink-0 snap-start">
                <ProductCard product={product} control="toggle" />
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-4">
            <button type="button" aria-label="Previous" onClick={() => scrollTo(featRef.current, featIdx - 1, featuredProducts.length)} className="text-brand transition-opacity hover:opacity-70">
              <ChevronDown className="h-5 w-5 rotate-90" />
            </button>
            <div className="flex items-center gap-2">
              {featuredProducts.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => scrollTo(featRef.current, i, featuredProducts.length)}
                  className={`h-1.5 rounded-full transition-all ${i === featIdx ? "w-5 bg-brand" : "w-1.5 bg-white/30"}`}
                />
              ))}
            </div>
            <button type="button" aria-label="Next" onClick={() => scrollTo(featRef.current, featIdx + 1, featuredProducts.length)} className="text-brand transition-opacity hover:opacity-70">
              <ChevronDown className="h-5 w-5 -rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
