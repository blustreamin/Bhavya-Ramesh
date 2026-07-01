"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { type Product } from "@/lib/products";
import { ProductCard } from "../ProductCard";
import { ChevronDown } from "../ui/Icons";

/** Horizontal rail of product cards: desktop side-arrows, mobile dot pagination. */
export function ProductRail({ title, products }: { title: string; products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };
  const goTo = (n: number) => {
    const el = trackRef.current;
    if (!el) return;
    const idx = Math.max(0, Math.min(products.length - 1, n));
    const c = el.children[idx] as HTMLElement;
    el.scrollTo({ left: el.scrollLeft + (c.getBoundingClientRect().left - el.getBoundingClientRect().left), behavior: "smooth" });
  };
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const base = el.getBoundingClientRect().left;
    let best = 0, bd = Infinity;
    Array.from(el.children).forEach((c, i) => {
      const d = Math.abs((c as HTMLElement).getBoundingClientRect().left - base);
      if (d < bd) { bd = d; best = i; }
    });
    setActive(best);
  };

  return (
    <section className="relative px-5 py-16 sm:px-12">
      <div className="mx-auto max-w-[1360px]">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] uppercase tracking-[0.2em] text-white/90">{title}</h2>
          <Link href="/#new-arrivals" className="text-sm tracking-wide text-white/80 underline underline-offset-4 transition-colors hover:text-brand sm:no-underline sm:hover:underline">
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

          <div ref={trackRef} onScroll={onScroll} className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto">
            {products.map((p, i) => (
              <div key={`${p.id}-${i}`} className="w-[85%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]">
                <ProductCard product={p} control="toggle" />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile pagination */}
        <div className="mt-6 flex items-center justify-center gap-4 lg:hidden">
          <button type="button" aria-label="Previous" onClick={() => goTo(active - 1)} className="text-brand transition-opacity hover:opacity-70">
            <ChevronDown className="h-5 w-5 rotate-90" />
          </button>
          <div className="flex items-center gap-1.5">
            {products.map((p, i) => (
              <button key={`${p.id}-${i}`} type="button" aria-label={`Go to ${i + 1}`} onClick={() => goTo(i)} className={`h-1.5 rounded-full transition-all ${i === active ? "w-4 bg-brand" : "w-1.5 bg-white/30"}`} />
            ))}
          </div>
          <button type="button" aria-label="Next" onClick={() => goTo(active + 1)} className="text-brand transition-opacity hover:opacity-70">
            <ChevronDown className="h-5 w-5 -rotate-90" />
          </button>
        </div>
      </div>
    </section>
  );
}
