"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { type Product, formatPrice } from "@/lib/products";
import { useCartStore } from "@/store/cart";
import { StarRating } from "../ui/StarRating";

const MODELS = [
  "/figma/9b227545e2a9637a4f88dad021a60a3613e290f8.png",
  "/figma/3a16c9835bee6dfe6169e1bb8ec0509a3fc6b6ee.png",
];

type Tile = { src: string; kind: "photo" | "product" };

function Icon({ path, className = "h-5 w-5" }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d={path} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
const ICONS = {
  returns: "M3 12a9 9 0 1 0 3-6.7M3 4v3.5h3.5",
  tracking: "M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  box: "M21 8 12 3 3 8l9 5 9-5ZM3 8v8l9 5 9-5V8M12 13v8",
  gift: "M20 12v8H4v-8M2 7h20v5H2zM12 22V7M12 7S9 3 6.5 4.5 8 7 12 7Zm0 0s3-4 5.5-2.5S16 7 12 7Z",
  tag: "M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z",
  check: "m5 13 4 4L19 7",
  chev: "m6 9 6 6 6-6",
};

const ACCORDION = [
  { icon: ICONS.returns, title: "Easy Returns & Exchange", sub: "Hassle-free returns within 7 days" },
  { icon: ICONS.tracking, title: "Real-Time Order Tracking", sub: "Track your order from dispatch to delivery" },
  { icon: ICONS.box, title: "Limited Stock", sub: "Only 3 left", body: "Sculptural artifacts designed to be lived in. Forget the rules of gender; embrace the weight of identity." },
];

export function ProductDetail({ product }: { product: Product }) {
  const { name, description, price, rating, image, goldImage } = product;
  const addLocal = useCartStore((s) => s.addLocal);
  const openCart = useCartStore((s) => s.open);

  const [finish, setFinish] = useState<"silver" | "gold">("silver");
  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(2);

  const gallery: Tile[] = [
    { src: MODELS[0], kind: "photo" },
    { src: image ?? "", kind: "product" },
    { src: goldImage ?? image ?? "", kind: "product" },
    { src: MODELS[1], kind: "photo" },
    { src: image ?? "", kind: "product" },
    { src: goldImage ?? image ?? "", kind: "product" },
  ];

  const add = () => {
    for (let n = 0; n < qty; n++) addLocal({ id: product.id, name, price, image: finish === "gold" ? goldImage ?? image : image }, finish);
    openCart();
  };

  return (
    <section className="bg-black pt-[96px]">
      <div className="grid lg:grid-cols-2">
        {/* Gallery — full-bleed on the left */}
        <div className="relative grid grid-cols-2 gap-2 sm:gap-3">
          {gallery.map((t, i) => (
            <div key={i} className={`relative aspect-[4/5] overflow-hidden rounded-xl ${t.kind === "product" ? "bg-white" : "bg-white/[0.04]"}`}>
              {t.src && (
                <Image
                  src={t.src}
                  alt={name}
                  fill
                  sizes="(min-width:1024px) 340px, 50vw"
                  className={t.kind === "product" ? "object-contain p-6" : "object-cover"}
                />
              )}
            </div>
          ))}
          {/* decorative sparkles at the gap intersections */}
          {[33, 66].map((y) => (
            <svg key={y} viewBox="0 0 24 24" className="pointer-events-none absolute left-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-black/70" style={{ top: `${y}%` }} aria-hidden>
              <path d="M12 2c.4 5 4.6 9.6 10 10-5.4.4-9.6 5-10 10-.4-5-4.6-9.6-10-10 5.4-.4 9.6-5 10-10Z" fill="currentColor" />
            </svg>
          ))}
        </div>

        {/* Info panel */}
        <div className="px-5 pt-9 sm:px-8 lg:sticky lg:top-[96px] lg:h-fit lg:pl-12 lg:pr-14 lg:pt-4">
          <Link href="/#new-arrivals" className="inline-flex items-center gap-1.5 text-[13px] text-white/70 transition-colors hover:text-brand">
            <span aria-hidden>↖</span> Back
          </Link>

          <h1 className="mt-4 font-serif text-[44px] leading-[1.02] text-brand sm:text-[56px]">{name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <StarRating value={rating} />
            <span className="text-[13px] text-white/55">4.8 (126 reviews)</span>
          </div>

          <p className="mt-4 text-[26px] font-semibold text-white">{formatPrice(price)}</p>

          {/* Payment options */}
          <p className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] text-white/55">
            EMI starts at ₹{Math.round(price / 34)}/month or pay later with
            <span className="font-semibold text-[#7bc043]">zest</span> or
            <span className="font-semibold text-[#4fd1c5]">Simpl</span>
          </p>

          {/* Coupon */}
          <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-[#7a6a3a]/40 px-4 py-3.5"
            style={{ background: "linear-gradient(105deg, #4a3e26 0%, #2c2718 48%, #423923 100%)" }}>
            <Icon path={ICONS.gift} className="h-6 w-6 shrink-0 text-[#e6c877]" />
            <p className="flex-1 text-[13px] leading-tight text-white/90">
              Get <span className="font-semibold text-[#e6c877]">10% OFF</span> on your first order
              <br />
              Use code: <span className="font-semibold text-white">WELCOME10</span>
            </p>
            <Icon path={ICONS.tag} className="h-6 w-6 shrink-0 text-[#e6c877]" />
          </div>

          {/* Finish swatches */}
          <div className="mt-6 flex gap-5">
            {product.swatches.map((s) => {
              const value = s.label.toLowerCase() === "gold" ? "gold" : "silver";
              const selected = finish === value;
              return (
                <button key={s.label} type="button" onClick={() => setFinish(value)} className="flex flex-col items-center gap-1.5">
                  <span className={`h-9 w-9 rounded-full ring-1 transition-shadow ${selected ? "ring-2 ring-white ring-offset-2 ring-offset-black" : "ring-white/25"}`} style={{ backgroundColor: s.color }} />
                  <span className={`text-[11px] ${selected ? "text-white" : "text-white/50"}`}>{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Stock */}
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2 text-[13px]">
            <span className="flex items-center gap-2 text-white/85"><Icon path={ICONS.check} className="h-4 w-4 text-emerald-400" /> In Stock</span>
            <span className="flex items-center gap-2 text-white/85"><Icon path={ICONS.check} className="h-4 w-4 text-emerald-400" /> Ship in 1-2 Business Days</span>
          </div>

          {/* Quantity + wishlist */}
          <div className="mt-6 flex gap-3">
            <div className="flex items-center rounded-md bg-white/[0.06]">
              <button type="button" aria-label="Decrease" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-3.5 text-white/80 transition-colors hover:text-brand">−</button>
              <span className="min-w-[28px] text-center text-[15px] text-white">{qty}</span>
              <button type="button" aria-label="Increase" onClick={() => setQty((q) => q + 1)} className="px-4 py-3.5 text-white/80 transition-colors hover:text-brand">+</button>
            </div>
            <button type="button" onClick={() => setWished((w) => !w)} className={`flex-1 rounded-md border py-3 text-[12px] font-bold uppercase tracking-widest transition-colors ${wished ? "border-brand text-brand" : "border-white/25 text-white hover:border-brand hover:text-brand"}`}>
              {wished ? "♥ Wishlisted" : "Wishlist"}
            </button>
          </div>

          {/* Add to cart */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={add}
            className="mt-3 w-full rounded-md py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(180deg, #47252f 0%, #2c1820 100%)" }}
          >
            Add to Cart
          </motion.button>

          {/* Accordions */}
          <div className="mt-8 divide-y divide-white/10 border-t border-white/10">
            {ACCORDION.map((a, i) => {
              const open = openIdx === i;
              return (
                <div key={a.title}>
                  <button type="button" onClick={() => setOpenIdx(open ? null : i)} className="flex w-full items-center gap-4 py-4 text-left">
                    <Icon path={a.icon} className="h-5 w-5 shrink-0 text-white/80" />
                    <span className="flex-1">
                      <span className="block text-[15px] text-white">{a.title}</span>
                      <span className="block text-[12px] text-white/50">{a.sub}</span>
                    </span>
                    <Icon path={ICONS.chev} className={`h-5 w-5 shrink-0 text-brand transition-transform ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open && a.body && <p className="pb-4 pl-9 text-[13px] leading-relaxed text-white/60">{a.body}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
