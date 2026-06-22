"use client";

import Link from "next/link";
import { newArrivals } from "@/lib/products";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ProductCard } from "./ProductCard";
import { ChevronDown } from "./ui/Icons";

export function NewArrivals() {
  const containerRef = useScrollReveal<HTMLDivElement>({
    childSelector: "[data-reveal]",
  });

  return (
    <section
      id="new-arrivals"
      className="relative overflow-hidden bg-black px-5 py-20 sm:px-8 sm:py-24"
    >
      {/* Soft maroon glow behind the row (Figma mask background). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/3 h-2/3"
        style={{
          background:
            "radial-gradient(50% 60% at 70% 40%, rgba(120,20,55,0.28) 0%, rgba(5,5,5,0) 70%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px]" ref={containerRef}>
        <h2 data-reveal className="text-[16px] tracking-[0.2em] text-white/90">
          NEW ARRIVALS
        </h2>

        <div className="relative mt-8">
          {/* Carousel arrows (flank the row, as in Figma). */}
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

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newArrivals.map((product) => (
              <div data-reveal key={product.id} className="h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end" data-reveal>
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
