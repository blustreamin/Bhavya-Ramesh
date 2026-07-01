"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/products";
import { Tilt } from "@/components/ui/Tilt";

function Icon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
const P = {
  lock: "M6 10V8a6 6 0 1 1 12 0v2M5 10h14v10H5zM12 14v3",
  truck: "M3 6h11v9H3zM14 9h4l3 3v3h-7M6.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  refresh: "M3 12a9 9 0 1 0 3-6.7M3 4v3.5h3.5",
  arrow: "M5 12h14M13 6l6 6-6 6",
  tag: "M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z",
  bag: "M6 8h12l-1 12H7L6 8ZM9 8V6a3 3 0 0 1 6 0v2",
};

const TRUST = [
  { d: P.lock, label: "Secure checkout" },
  { d: P.truck, label: "Free shipping" },
  { d: P.refresh, label: "7-day returns" },
];

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const lines = useCartStore((s) => s.lines);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeLine = useCartStore((s) => s.removeLine);

  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState(false);
  const subtotal = lines.reduce((s, l) => s + Number(l.price.amount) * l.quantity, 0);
  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const discount = applied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;

  return (
    <>
      <Header />
      <main className="relative min-h-screen overflow-hidden bg-black px-5 pb-28 pt-[130px] sm:px-8">
        {/* Ambient glows */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 40% at 85% 10%, rgba(120,122,145,0.14) 0%, transparent 60%), radial-gradient(50% 45% at 5% 90%, rgba(228,99,140,0.12) 0%, transparent 62%)" }} />

        <div className="relative mx-auto max-w-[1280px]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-[12px] uppercase tracking-[0.4em] text-brand">Shopping Bag</p>
            <h1 className="mt-3 font-serif text-[48px] leading-[0.95] text-white sm:text-[64px]">
              Your Bag{mounted && count > 0 && <span className="text-white/30"> / {count}</span>}
            </h1>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-brand/60 via-white/15 to-transparent" />
          </motion.div>

          {!mounted ? (
            <div className="mt-16 h-40" />
          ) : lines.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 flex flex-col items-center rounded-3xl border border-white/10 bg-white/[0.02] py-24 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/15 text-white/40">
                <Icon d={P.bag} className="h-9 w-9" />
              </div>
              <p className="mt-6 font-serif text-[28px] text-white">Your bag is empty</p>
              <p className="mt-2 max-w-sm text-sm text-white/50">Discover sculptural pieces made to be lived in — and worn like nobody&apos;s watching.</p>
              <Link href="/#new-arrivals" className="group mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-soft px-8 py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:shadow-[0_0_30px_-6px_rgba(228,99,140,0.6)]">
                Start Shopping <Icon d={P.arrow} className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]">
              {/* Items */}
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {lines.map((l, idx) => (
                    <motion.div
                      key={l.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.04 }}
                      className="group relative flex gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20 sm:gap-5 sm:p-5"
                    >
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-white/[0.08] to-transparent sm:h-32 sm:w-32">
                        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(70% 70% at 50% 30%, rgba(228,99,140,0.25) 0%, transparent 70%)" }} />
                        {l.image?.url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={l.image.url} alt={l.title} className="relative h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-serif text-[17px] leading-tight text-white sm:text-[20px]">{l.title}</h3>
                            <p className="mt-1 text-[11px] uppercase tracking-widest text-white/40">In stock</p>
                          </div>
                          <button type="button" aria-label="Remove" onClick={() => removeLine(l.id)} className="text-white/30 transition-colors hover:text-brand">
                            <Icon d="M6 6l12 12M18 6 6 18" className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-end justify-between pt-4">
                          <div className="flex items-center rounded-full border border-white/20 bg-black/40">
                            <button type="button" aria-label="Decrease" onClick={() => updateQuantity(l.id, l.quantity - 1)} className="px-3.5 py-2 text-white/70 transition-colors hover:text-brand">−</button>
                            <span className="min-w-[24px] text-center text-[14px] text-white">{l.quantity}</span>
                            <button type="button" aria-label="Increase" onClick={() => updateQuantity(l.id, l.quantity + 1)} className="px-3.5 py-2 text-white/70 transition-colors hover:text-brand">+</button>
                          </div>
                          <p className="shrink-0 font-serif text-[18px] text-white sm:text-[22px]">{formatPrice(Number(l.price.amount) * l.quantity)}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Summary */}
              <motion.aside initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="h-fit lg:sticky lg:top-[118px]">
                <Tilt max={6} className="rounded-3xl">
                <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.03] p-7 backdrop-blur-sm">
                  <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/70 to-transparent" />
                  <h2 className="font-serif text-[26px] text-white">Order Summary</h2>

                  {/* Promo */}
                  <div className="mt-6 flex gap-2">
                    <div className="flex flex-1 items-center gap-2 rounded-full border border-white/20 px-4">
                      <Icon d={P.tag} className="h-4 w-4 text-brand" />
                      <input value={promo} onChange={(e) => { setPromo(e.target.value); setApplied(false); }} placeholder="Promo code" className="h-11 w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none" />
                    </div>
                    <button type="button" onClick={() => setApplied(promo.trim().length > 0)} className="rounded-full border border-white/25 px-5 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:border-brand hover:text-brand">
                      Apply
                    </button>
                  </div>
                  {applied && <p className="mt-2 text-[12px] text-emerald-400">Promo applied — 10% off</p>}

                  <dl className="mt-6 space-y-3.5 text-[14px]">
                    <div className="flex justify-between text-white/60"><dt>Subtotal</dt><dd className="text-white">{formatPrice(subtotal)}</dd></div>
                    {discount > 0 && <div className="flex justify-between text-emerald-400"><dt>Discount</dt><dd>−{formatPrice(discount)}</dd></div>}
                    <div className="flex justify-between text-white/60"><dt>Shipping</dt><dd className="text-emerald-400">Complimentary</dd></div>
                  </dl>
                  <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-5">
                    <span className="text-[13px] uppercase tracking-widest text-white/50">Total</span>
                    <span className="font-serif text-[30px] text-white">{formatPrice(total)}</span>
                  </div>

                  <Link href="/checkout" className="group mt-6 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-soft py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:shadow-[0_0_34px_-6px_rgba(228,99,140,0.65)]">
                    Proceed to Checkout <Icon d={P.arrow} className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link href="/#new-arrivals" className="mt-4 block text-center text-[12px] uppercase tracking-widest text-white/45 transition-colors hover:text-brand">
                    Continue Shopping
                  </Link>

                  <div className="mt-7 grid grid-cols-3 gap-2 border-t border-white/10 pt-6">
                    {TRUST.map((t) => (
                      <div key={t.label} className="flex flex-col items-center gap-2 text-center">
                        <Icon d={t.d} className="h-5 w-5 text-white/70" />
                        <span className="text-[10px] uppercase tracking-wider text-white/45">{t.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                </Tilt>
              </motion.aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
