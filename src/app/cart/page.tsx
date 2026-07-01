"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/products";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const lines = useCartStore((s) => s.lines);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeLine = useCartStore((s) => s.removeLine);

  const subtotal = lines.reduce((s, l) => s + Number(l.price.amount) * l.quantity, 0);
  const count = lines.reduce((n, l) => n + l.quantity, 0);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black px-5 pb-24 pt-[130px] sm:px-8">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-[13px] uppercase tracking-[0.3em] text-brand">Your Bag</p>
          <h1 className="mt-3 font-serif text-[40px] leading-tight text-white sm:text-[52px]">
            Shopping Cart{mounted && count > 0 && <span className="text-white/40"> ({count})</span>}
          </h1>

          {!mounted ? (
            <div className="mt-16 h-40" />
          ) : lines.length === 0 ? (
            <div className="mt-16 flex flex-col items-center py-16 text-center">
              <p className="text-sm text-white/60">Your cart is empty.</p>
              <Link href="/#new-arrivals" className="mt-6 rounded-md bg-brand-soft px-8 py-3.5 text-[12px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-brand">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
              {/* Line items */}
              <div className="divide-y divide-white/10 border-y border-white/10">
                {lines.map((l) => (
                  <div key={l.id} className="flex gap-5 py-6">
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-white/[0.04]">
                      {l.image?.url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={l.image.url} alt={l.title} className="h-full w-full object-contain p-2" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-[16px] font-semibold text-white">{l.title}</h3>
                        <p className="shrink-0 text-[15px] font-semibold text-white">{formatPrice(Number(l.price.amount) * l.quantity)}</p>
                      </div>
                      <p className="mt-1 text-[13px] text-white/50">{formatPrice(Number(l.price.amount))} each</p>
                      <div className="mt-auto flex items-center justify-between pt-4">
                        <div className="flex items-center rounded-md border border-white/25">
                          <button type="button" aria-label="Decrease" onClick={() => updateQuantity(l.id, l.quantity - 1)} className="px-3.5 py-2 text-white/80 transition-colors hover:text-brand">−</button>
                          <span className="min-w-[26px] text-center text-[14px] text-white">{l.quantity}</span>
                          <button type="button" aria-label="Increase" onClick={() => updateQuantity(l.id, l.quantity + 1)} className="px-3.5 py-2 text-white/80 transition-colors hover:text-brand">+</button>
                        </div>
                        <button type="button" onClick={() => removeLine(l.id)} className="text-[12px] uppercase tracking-widest text-white/50 transition-colors hover:text-brand">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <aside className="h-fit rounded-xl border border-white/10 bg-white/[0.03] p-6 lg:sticky lg:top-[120px]">
                <h2 className="text-[15px] uppercase tracking-[0.15em] text-white">Order Summary</h2>
                <dl className="mt-5 space-y-3 text-[14px]">
                  <div className="flex justify-between text-white/70"><dt>Subtotal</dt><dd className="text-white">{formatPrice(subtotal)}</dd></div>
                  <div className="flex justify-between text-white/70"><dt>Shipping</dt><dd className="text-emerald-400">Free</dd></div>
                </dl>
                <div className="mt-5 flex justify-between border-t border-white/10 pt-5 text-[16px] font-semibold text-white">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <Link href="/checkout" className="mt-6 block rounded-md bg-brand-soft py-3.5 text-center text-[12px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-brand">
                  Proceed to Checkout
                </Link>
                <Link href="/#new-arrivals" className="mt-4 block text-center text-[12px] uppercase tracking-widest text-white/50 transition-colors hover:text-brand">
                  Continue Shopping
                </Link>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
