"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchStore } from "@/store/search";
import { newArrivals, featuredProducts, formatPrice, type Product } from "@/lib/products";
import { SearchIcon } from "./ui/Icons";

const CATEGORIES = [
  "Rings", "Earrings", "Chains", "Nose Pins", "Palm Cuffs", "Webbed Fingers",
  "Nail Rings", "Ear Cuffs", "Neckpieces", "Anklets", "Sunglasses", "Hair Accessories",
];
const COLLECTIONS = ["Gilga", "Naraka", "Ancient Aliens", "Jalebi", "Glarekillers", "Darlings", "HARMONY", "POISON"];
const POPULAR = ["Sunglasses", "Nail Rings", "Naraka", "Rings", "Palm Cuffs"];

const slug = (s: string) => "#" + s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Unique product catalogue for search (homepage placeholder data).
const CATALOGUE: Product[] = Array.from(
  new Map([...newArrivals, ...featuredProducts].map((p) => [p.id, p])).values()
);

export function SearchOverlay() {
  const isOpen = useSearchStore((s) => s.isOpen);
  const close = useSearchStore((s) => s.close);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setQuery("");
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!q) return null;
    return {
      products: CATALOGUE.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      ),
      categories: CATEGORIES.filter((c) => c.toLowerCase().includes(q)),
      collections: COLLECTIONS.filter((c) => c.toLowerCase().includes(q)),
    };
  }, [q]);

  const empty = results && !results.products.length && !results.categories.length && !results.collections.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[80] overflow-y-auto bg-black/90 backdrop-blur-xl"
        >
          <div className="mx-auto max-w-[900px] px-5 pb-24 pt-24 sm:px-8">
            {/* Search input */}
            <div className="flex items-center gap-4 border-b border-white/25 pb-4">
              <SearchIcon className="h-6 w-6 shrink-0 text-white/60" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for jewellery, collections…"
                className="min-w-0 flex-1 bg-transparent text-[22px] text-white placeholder:text-white/35 focus:outline-none sm:text-[28px]"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close search"
                className="shrink-0 text-[12px] uppercase tracking-widest text-white/50 transition-colors hover:text-brand"
              >
                Esc
              </button>
            </div>

            {/* Body */}
            <div className="mt-8">
              {!results ? (
                <div>
                  <p className="text-[12px] uppercase tracking-[0.25em] text-white/45">Popular searches</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {POPULAR.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setQuery(p)}
                        className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 transition-colors hover:border-brand hover:text-brand"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              ) : empty ? (
                <p className="text-sm text-white/55">
                  No results for <span className="text-white">“{query}”</span>. Try another search.
                </p>
              ) : (
                <div className="space-y-10">
                  {results.products.length > 0 && (
                    <div>
                      <p className="text-[12px] uppercase tracking-[0.25em] text-white/45">Products</p>
                      <ul className="mt-4 divide-y divide-white/10">
                        {results.products.map((p) => (
                          <li key={p.id}>
                            <Link href={slug(p.name)} onClick={close} className="group flex items-center gap-4 py-4">
                              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-white/[0.04]">
                                {p.image && (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={p.image} alt={p.name} className="h-full w-full object-contain" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[15px] font-semibold text-white transition-colors group-hover:text-brand">{p.name}</p>
                                <p className="truncate text-[13px] text-white/50">{p.description}</p>
                              </div>
                              <p className="shrink-0 text-[14px] text-white/70">{formatPrice(p.price)}</p>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(results.categories.length > 0 || results.collections.length > 0) && (
                    <div className="grid gap-8 sm:grid-cols-2">
                      {results.categories.length > 0 && (
                        <div>
                          <p className="text-[12px] uppercase tracking-[0.25em] text-white/45">Categories</p>
                          <ul className="mt-4 space-y-2.5">
                            {results.categories.map((c) => (
                              <li key={c}>
                                <Link href={slug(c)} onClick={close} className="text-[15px] text-white/85 transition-colors hover:text-brand">
                                  {c}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {results.collections.length > 0 && (
                        <div>
                          <p className="text-[12px] uppercase tracking-[0.25em] text-white/45">Collections</p>
                          <ul className="mt-4 space-y-2.5">
                            {results.collections.map((c) => (
                              <li key={c}>
                                <Link href={slug(c)} onClick={close} className="text-[15px] text-white/85 transition-colors hover:text-brand">
                                  {c}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
