"use client";

import Link from "next/link";
import { newArrivals } from "@/lib/products";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ProductCard } from "./ProductCard";

export function NewArrivals() {
  const containerRef = useScrollReveal<HTMLDivElement>({
    childSelector: "[data-reveal]",
  });

  return (
    <section
      id="new-arrivals"
      className="relative bg-black px-5 py-20 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-[1400px]" ref={containerRef}>
        <h2
          data-reveal
          className="text-sm tracking-[0.3em] text-white/80"
        >
          NEW ARRIVALS
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {newArrivals.map((product) => (
            <div data-reveal key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
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
