"use client";

import { useRef } from "react";
import Link from "next/link";
import { type Product } from "@/lib/products";
import { ProductCard } from "../ProductCard";
import { ChevronDown } from "../ui/Icons";

/** Horizontal rail of product cards with a title, side arrows and View More. */
export function ProductRail({ title, products }: { title: string; products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section className="relative px-5 py-16 sm:px-12">
      <div className="mx-auto max-w-[1360px]">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] uppercase tracking-[0.2em] text-white/90">{title}</h2>
          <Link href="/#new-arrivals" className="text-sm tracking-wide text-white/80 underline-offset-4 transition-colors hover:text-brand hover:underline">
            View More
          </Link>
        </div>

        <div className="relative mt-8">
          <button type="button" aria-label="Previous" onClick={() => scrollBy(-1)} className="absolute left-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:border-brand hover:text-brand lg:flex">
            <ChevronDown className="h-4 w-4 rotate-90" />
          </button>
          <button type="button" aria-label="Next" onClick={() => scrollBy(1)} className="absolute right-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:border-brand hover:text-brand lg:flex">
            <ChevronDown className="h-4 w-4 -rotate-90" />
          </button>

          <div ref={trackRef} className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto">
            {products.map((p, i) => (
              <div key={`${p.id}-${i}`} className="w-[85%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
