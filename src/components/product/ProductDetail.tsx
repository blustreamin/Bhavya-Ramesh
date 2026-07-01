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

const ACCORDION = [
  { title: "Easy Returns & Exchange", body: "Hassle-free returns and exchanges within 7 days of delivery." },
  { title: "Real-Time Order Tracking", body: "Track your order from dispatch to delivery, every step of the way." },
  { title: "Limited Stock", body: "Sculptural artifacts designed to be lived in. Forget the rules of gender; embrace the weight of identity." },
];

function TagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M20.59 13.41 12 22l-9-9V3h10l7.59 7.59a2 2 0 0 1 0 2.82Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="7.5" cy="7.5" r="1.4" fill="currentColor" />
    </svg>
  );
}
function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function Chevron({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`h-5 w-5 shrink-0 text-white/60 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
    <section className="bg-black px-5 pt-[130px] sm:px-12">
      <div className="mx-auto grid max-w-[1360px] gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <div className="grid grid-cols-2 gap-4">
          {gallery.map((t, i) => (
            <div key={i} className={`relative aspect-[4/5] overflow-hidden rounded-xl ${t.kind === "product" ? "bg-[#f2f2f2]" : "bg-white/[0.04]"}`}>
              {t.src && (
                <Image
                  src={t.src}
                  alt={name}
                  fill
                  sizes="(min-width:1024px) 320px, 50vw"
                  className={t.kind === "product" ? "object-contain p-6" : "object-cover"}
                />
              )}
            </div>
          ))}
        </div>

        {/* Info panel */}
        <div className="lg:sticky lg:top-[120px] lg:h-fit">
          <Link href="/#new-arrivals" className="inline-flex items-center gap-1.5 text-[13px] text-white/60 transition-colors hover:text-brand">
            <span aria-hidden>↖</span> Back
          </Link>

          <h1 className="mt-4 font-serif text-[40px] leading-[1.05] text-brand sm:text-[52px]">{name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <StarRating value={rating} />
            <span className="text-[13px] text-white/55">4.8 (124 reviews)</span>
          </div>

          <p className="mt-4 text-[24px] font-semibold text-white">{formatPrice(price)}</p>

          {/* Payment options */}
          <p className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-white/55">
            EMI starts at ₹{Math.round(price / 36)}/month · pay later with
            <span className="rounded bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white">G Pay</span>
            <span className="rounded bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white">Simpl</span>
          </p>

          {/* Coupon */}
          <div className="mt-5 flex items-center gap-3 rounded-lg border border-white/10 bg-gradient-to-r from-[#2a1520] to-[#140a10] px-4 py-3">
            <TagIcon className="h-5 w-5 shrink-0 text-brand" />
            <p className="text-[13px] text-white/85">
              Get <span className="font-semibold text-brand">10% Off</span> on your first order · Use code{" "}
              <span className="font-semibold text-white">WELCOME10</span>
            </p>
          </div>

          {/* Finish swatches */}
          <div className="mt-6 flex gap-4">
            {product.swatches.map((s) => {
              const value = s.label.toLowerCase() === "gold" ? "gold" : "silver";
              const selected = finish === value;
              return (
                <button key={s.label} type="button" onClick={() => setFinish(value)} className="flex flex-col items-center gap-1.5">
                  <span
                    className={`h-9 w-9 rounded-full ring-1 transition-shadow ${selected ? "ring-2 ring-white" : "ring-white/25"}`}
                    style={{ backgroundColor: s.color }}
                  />
                  <span className={`text-[11px] ${selected ? "text-white" : "text-white/50"}`}>{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Stock */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]">
            <span className="flex items-center gap-1.5 text-emerald-400"><Check className="h-4 w-4" /> In Stock</span>
            <span className="flex items-center gap-1.5 text-white/70"><Check className="h-4 w-4 text-emerald-400" /> Ships in 1–2 business days</span>
          </div>

          {/* Quantity + wishlist */}
          <div className="mt-6 flex gap-3">
            <div className="flex items-center rounded-md border border-white/25">
              <button type="button" aria-label="Decrease" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-3 text-white/80 transition-colors hover:text-brand">−</button>
              <span className="min-w-[28px] text-center text-[15px] text-white">{qty}</span>
              <button type="button" aria-label="Increase" onClick={() => setQty((q) => q + 1)} className="px-4 py-3 text-white/80 transition-colors hover:text-brand">+</button>
            </div>
            <button
              type="button"
              onClick={() => setWished((w) => !w)}
              className={`flex-1 rounded-md border py-3 text-[12px] font-bold uppercase tracking-widest transition-colors ${wished ? "border-brand text-brand" : "border-white/25 text-white hover:border-brand hover:text-brand"}`}
            >
              {wished ? "♥ Wishlisted" : "♡ Wishlist"}
            </button>
          </div>

          {/* Add to cart */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={add}
            className="mt-3 w-full rounded-md bg-white py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-black transition-colors hover:bg-brand hover:text-white"
          >
            Add to Cart
          </motion.button>

          {/* Accordions */}
          <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {ACCORDION.map((a, i) => {
              const open = openIdx === i;
              return (
                <div key={a.title}>
                  <button type="button" onClick={() => setOpenIdx(open ? null : i)} className="flex w-full items-center justify-between gap-4 py-4 text-left">
                    <span className="text-[15px] text-white">{a.title}</span>
                    <Chevron open={open} />
                  </button>
                  {open && <p className="pb-4 text-[13px] leading-relaxed text-white/60">{a.body}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
