"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { allProducts } from "@/lib/products";

const CATEGORIES = ["Shop All", "Everyday Essential", "Statement Jewellery", "Occasion Wear", "Accessories & Add-ons"];
const PAGE_SIZE = 12;
const TOTAL_PAGES = 4;

// Cycle the placeholder catalogue to fill the grid (Shopify feeds this later).
const CATALOG = Array.from({ length: PAGE_SIZE * TOTAL_PAGES }, (_, i) => allProducts[i % allProducts.length]);

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ShopPage() {
  const [category, setCategory] = useState("Shop All");
  const [page, setPage] = useState(1);

  const items = CATALOG.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const goPage = (p: number) => {
    setPage(Math.max(1, Math.min(TOTAL_PAGES, p)));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header />
      <main className="relative min-h-screen overflow-hidden bg-black px-5 pb-24 pt-[120px] sm:px-8">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(80% 40% at 50% 0%, rgba(120,122,145,0.12) 0%, transparent 55%), radial-gradient(60% 40% at 100% 100%, rgba(228,99,140,0.08) 0%, transparent 60%)" }} />

        <div className="relative mx-auto max-w-[1360px]">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-[12px] uppercase tracking-[0.4em] text-brand">The Collection</p>
            <h1 className="mt-3 font-serif text-[44px] leading-[0.95] text-white sm:text-[60px]">{category}</h1>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-brand/60 via-white/15 to-transparent" />
          </motion.div>

          {/* Category filters */}
          <div className="no-scrollbar mt-8 flex gap-3 overflow-x-auto pb-1">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => { setCategory(c); setPage(1); }}
                className={`shrink-0 rounded-full border px-6 py-3 text-[12px] font-semibold uppercase tracking-widest transition-all ${
                  category === c ? "border-brand bg-brand/10 text-white" : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Product grid */}
          <motion.div key={`${category}-${page}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {items.map((p, i) => (
              <ProductCard key={`${p.id}-${i}`} product={p} />
            ))}
          </motion.div>

          {/* Pagination */}
          <div className="mt-14 flex items-center justify-center gap-2">
            <button type="button" aria-label="Previous" onClick={() => goPage(page - 1)} disabled={page === 1} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-brand hover:text-brand disabled:opacity-30">
              <Chevron className="h-4 w-4 rotate-90" />
            </button>
            {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => goPage(p)}
                className={`h-10 w-10 rounded-full text-[14px] transition-all ${
                  page === p ? "bg-gradient-to-r from-brand to-brand-soft font-bold text-white" : "border border-white/20 text-white/70 hover:border-brand hover:text-brand"
                }`}
              >
                {p}
              </button>
            ))}
            <button type="button" aria-label="Next" onClick={() => goPage(page + 1)} disabled={page === TOTAL_PAGES} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-brand hover:text-brand disabled:opacity-30">
              <Chevron className="h-4 w-4 -rotate-90" />
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
