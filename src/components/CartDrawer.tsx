"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/products";

/**
 * Slide-in cart drawer. Reads the local cart store (placeholder commerce) and
 * lets the user review line items, change quantities, remove items, and head to
 * checkout. Wire `checkoutUrl` to the Shopify cart in the commerce milestone.
 */
export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const lines = useCartStore((s) => s.lines);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeLine = useCartStore((s) => s.removeLine);

  const subtotal = lines.reduce((sum, l) => sum + Number(l.price.amount) * l.quantity, 0);
  const count = lines.reduce((n, l) => n + l.quantity, 0);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            aria-hidden
          />

          {/* Panel */}
          <motion.aside
            key="cart-panel"
            role="dialog"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-y-0 right-0 z-[71] flex h-full w-full max-w-[420px] flex-col bg-[#0c0b0d] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <h2 className="text-[15px] uppercase tracking-[0.2em] text-white">
                Cart{count > 0 && <span className="text-brand"> ({count})</span>}
              </h2>
              <button type="button" aria-label="Close cart" onClick={close} className="text-white/80 transition-colors hover:text-brand">
                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Lines */}
            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-sm text-white/60">Your cart is empty.</p>
                <button type="button" onClick={close} className="rounded-md border border-white/30 px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:border-brand hover:text-brand">
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <ul className="no-scrollbar flex-1 divide-y divide-white/8 overflow-y-auto px-6">
                  {lines.map((l) => (
                    <li key={l.id} className="flex gap-4 py-5">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-white/[0.04]">
                        {l.image?.url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={l.image.url} alt={l.title} className="h-full w-full object-contain" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[14px] font-semibold text-white">{l.title}</p>
                          <button type="button" aria-label="Remove" onClick={() => removeLine(l.id)} className="text-white/40 transition-colors hover:text-brand">
                            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                          </button>
                        </div>
                        <p className="mt-1 text-[13px] text-white/60">{formatPrice(Number(l.price.amount))}</p>
                        <div className="mt-auto flex items-center gap-3 pt-3">
                          <div className="flex items-center rounded-full border border-white/20">
                            <button type="button" aria-label="Decrease" onClick={() => updateQuantity(l.id, l.quantity - 1)} className="px-2.5 py-1 text-white/80 transition-colors hover:text-brand">−</button>
                            <span className="min-w-[20px] text-center text-[13px] text-white">{l.quantity}</span>
                            <button type="button" aria-label="Increase" onClick={() => updateQuantity(l.id, l.quantity + 1)} className="px-2.5 py-1 text-white/80 transition-colors hover:text-brand">+</button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Footer */}
                <div className="border-t border-white/10 px-6 py-5">
                  <div className="flex items-center justify-between text-[15px] text-white">
                    <span className="uppercase tracking-wide text-white/70">Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-white/45">Taxes &amp; shipping calculated at checkout.</p>
                  <Link
                    href="/checkout"
                    onClick={close}
                    className="mt-4 block w-full rounded-md bg-brand-soft py-3.5 text-center text-[12px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-brand"
                  >
                    Checkout
                  </Link>
                  <Link
                    href="/cart"
                    onClick={close}
                    className="mt-3 block text-center text-[12px] uppercase tracking-widest text-white/50 transition-colors hover:text-brand"
                  >
                    View Cart
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
