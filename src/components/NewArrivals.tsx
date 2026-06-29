"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { newArrivals } from "@/lib/products";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ProductCard } from "./ProductCard";
import { ChevronDown } from "./ui/Icons";

export function NewArrivals() {
  const containerRef = useScrollReveal<HTMLDivElement>({
    childSelector: "[data-reveal]",
  });
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  };
  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const idx = Math.max(0, Math.min(newArrivals.length - 1, i));
    el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" });
  };

  return (
    <section
      id="new-arrivals"
      className="relative overflow-hidden bg-black px-5 py-20 sm:px-8 sm:py-24"
    >
      {/* Cool grey gradient backdrop (Figma mask-group background). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(85% 70% at 55% 18%, #34353c 0%, #17181c 52%, #0a0a0c 100%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px]" ref={containerRef}>
        <div className="flex items-center justify-between">
          <h2 data-reveal className="text-[16px] tracking-[0.2em] text-white/90">
            NEW ARRIVALS
          </h2>
          {/* View More — top-right on mobile */}
          <Link
            href="#new-arrivals"
            className="text-sm tracking-wide text-white/90 underline underline-offset-4 transition-colors hover:text-brand sm:hidden"
          >
            View More
          </Link>
        </div>

        {/* Tablet / desktop grid */}
        <div className="relative mt-8 hidden sm:block">
          <button
            type="button"
            aria-label="Previous"
            className="absolute -left-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-brand hover:text-brand lg:flex"
          >
            <ChevronDown className="h-4 w-4 rotate-90" />
          </button>
          <button
            type="button"
            aria-label="Next"
            className="absolute -right-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-brand hover:text-brand lg:flex"
          >
            <ChevronDown className="h-4 w-4 -rotate-90" />
          </button>

          <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
            {newArrivals.map((product) => (
              <div data-reveal key={product.id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile carousel — one card per view + pagination */}
        <div className="mt-8 sm:hidden" data-reveal>
          <div
            ref={trackRef}
            onScroll={onScroll}
            className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          >
            {newArrivals.map((product) => (
              <div key={product.id} className="w-full shrink-0 snap-start">
                <ProductCard product={product} control="toggle" />
              </div>
            ))}
          </div>

          {/* Prev / dots / Next */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => goTo(active - 1)}
              className="text-brand transition-opacity hover:opacity-70"
            >
              <ChevronDown className="h-5 w-5 rotate-90" />
            </button>
            <div className="flex items-center gap-2">
              {newArrivals.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? "w-5 bg-brand" : "w-1.5 bg-white/30"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next"
              onClick={() => goTo(active + 1)}
              className="text-brand transition-opacity hover:opacity-70"
            >
              <ChevronDown className="h-5 w-5 -rotate-90" />
            </button>
          </div>
        </div>

        {/* View More — bottom-right on desktop */}
        <div className="mt-8 hidden justify-end sm:flex" data-reveal>
          <Link
            href="#new-arrivals"
            className="text-sm tracking-wide text-white/90 underline-offset-4 transition-colors hover:text-brand hover:underline"
          >
            View More
          </Link>
        </div>
      </div>
    </section>
  );
}
