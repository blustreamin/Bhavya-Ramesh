"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useWishlistStore } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/products";

function Icon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
const P = {
  heart: "M12 20.3 4.6 13a4.7 4.7 0 0 1 0-6.7 4.7 4.7 0 0 1 6.7 0l.7.7.7-.7a4.7 4.7 0 0 1 6.7 0 4.7 4.7 0 0 1 0 6.7Z",
  close: "M6 6l12 12M18 6 6 18",
  arrow: "M5 12h14M13 6l6 6-6 6",
  bag: "M6 8h12l-1 12H7L6 8ZM9 8V6a3 3 0 0 1 6 0v2",
};

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  const clear = useWishlistStore((s) => s.clear);
  const addLocal = useCartStore((s) => s.addLocal);

  const moveToBag = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    addLocal({ id: item.id, name: item.name, price: item.price, image: item.image }, item.finish);
    remove(id);
  };

  return (
    <>
      <Header />
      <main className="relative min-h-screen overflow-hidden bg-black px-5 pb-28 pt-[130px] sm:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 40% at 85% 10%, rgba(120,122,145,0.14) 0%, transparent 60%), radial-gradient(50% 45% at 5% 90%, rgba(192,171,121,0.12) 0%, transparent 62%)",
          }}
        />

        <div className="relative mx-auto max-w-[1280px]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-[12px] uppercase tracking-[0.4em] text-brand">Saved Pieces</p>
            <h1 className="mt-3 font-serif text-[48px] leading-[0.95] text-white sm:text-[64px]">
              Wishlist{mounted && items.length > 0 && <span className="text-white/30"> / {items.length}</span>}
            </h1>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-brand/60 via-white/15 to-transparent" />
          </motion.div>

          {!mounted ? (
            <div className="mt-16 h-40" />
          ) : items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-10 flex flex-col items-center rounded-3xl border border-white/10 bg-white/[0.02] py-24 text-center"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/15 text-white/40">
                <Icon d={P.heart} className="h-9 w-9" />
              </div>
              <p className="mt-6 font-serif text-[28px] text-white">Nothing saved yet</p>
              <p className="mt-2 max-w-sm text-sm text-white/50">
                Tap “Add to Wishlist” on a piece and it will wait for you here.
              </p>
              <Link
                href="/shop"
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-soft px-8 py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:shadow-[0_0_30px_-6px_rgba(192,171,121,0.6)]"
              >
                Explore the Collection
                <Icon d={P.arrow} className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence initial={false}>
                  {items.map((item, idx) => (
                    <motion.article
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.4, delay: idx * 0.04 }}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/20"
                    >
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/40">
                        {item.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
                          />
                        )}
                        <button
                          type="button"
                          aria-label={`Remove ${item.name} from wishlist`}
                          onClick={() => remove(item.id)}
                          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/70 backdrop-blur-sm transition-colors hover:border-brand hover:text-brand"
                        >
                          <Icon d={P.close} className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="p-5">
                        <h3 className="font-serif text-[20px] leading-tight text-white">{item.name}</h3>
                        <p className="mt-1 text-[13px] text-white/50">
                          {formatPrice(item.price)}
                          {item.finish && <span className="ml-2 uppercase tracking-widest text-white/35">{item.finish}</span>}
                        </p>
                        <button
                          type="button"
                          onClick={() => moveToBag(item.id)}
                          className="group/btn mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-soft py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:shadow-[0_0_28px_-8px_rgba(192,171,121,0.7)]"
                        >
                          <Icon d={P.bag} className="h-4 w-4" />
                          Move to Bag
                        </button>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>

              <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={clear}
                  className="text-[12px] uppercase tracking-widest text-white/45 transition-colors hover:text-brand"
                >
                  Clear wishlist
                </button>
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-2 text-[12px] uppercase tracking-widest text-white transition-colors hover:text-brand"
                >
                  Continue shopping
                  <Icon d={P.arrow} className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
