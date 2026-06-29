"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { type Product, formatPrice } from "@/lib/products";
import { StarRating } from "./ui/StarRating";
import { PlusIcon } from "./ui/Icons";

type ProductCardProps = {
  product: Product;
  /** Finish control style: colour swatches (default) or a silver/gold toggle. */
  control?: "swatches" | "toggle";
};

export function ProductCard({ product, control = "swatches" }: ProductCardProps) {
  const { name, description, price, rating, swatches, image, goldImage, glow } = product;

  // Selected finish, driven by the colour swatches.
  const [finish, setFinish] = useState<"silver" | "gold">("silver");

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group/card relative flex h-full flex-col overflow-hidden rounded-[10px] bg-black p-5"
    >
      {/* Rose/maroon gradient that drops in on hover. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        style={{
          background:
            "radial-gradient(110% 85% at 50% 18%, #b56a82 0%, #7d4257 30%, #3a1825 58%, #120209 82%)",
        }}
      />

      {/* Optional maroon glow accent behind the card content. */}
      {glow === "maroon" && (
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(120% 90% at 70% 30%, rgba(120,20,55,0.5) 0%, rgba(10,10,10,0) 60%)",
          }}
        />
      )}

      {/* Add-to-cart */}
      <button
        type="button"
        aria-label={`Add ${name} to cart`}
        className="absolute right-4 top-4 z-10 text-white/80 transition-colors hover:text-brand"
      >
        <PlusIcon className="h-5 w-5" />
      </button>

      {/* Product image — silver base with a gold finish that cross-fades in
          only while hovering the image itself. */}
      <div className="group relative z-[1] flex h-[230px] shrink-0 items-center justify-center">
        {image ? (
          <>
            <Image
              src={image}
              alt={name}
              width={320}
              height={320}
              className={`max-h-full w-auto object-contain transition-opacity duration-300 ${
                finish === "gold" ? "opacity-0" : "opacity-100"
              } ${goldImage ? "group-hover:opacity-0" : ""}`}
            />
            {goldImage && (
              <Image
                src={goldImage}
                alt=""
                aria-hidden
                width={320}
                height={320}
                className={`absolute inset-0 m-auto max-h-full w-auto object-contain transition-opacity duration-300 group-hover:opacity-100 ${
                  finish === "gold" ? "opacity-100" : "opacity-0"
                }`}
              />
            )}
          </>
        ) : (
          <div className="flex h-3/4 w-3/4 items-center justify-center rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_70%)]">
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">
              {name}
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="relative z-[1] mt-auto pt-6">
        <StarRating value={rating} />

        <div className="mt-3 flex items-start justify-between gap-3">
          <h3 className="font-sans text-[24px] font-bold leading-tight text-brand">
            {name}
          </h3>

          {/* Finish control — toggle (featured) or colour swatches. */}
          {control === "toggle" ? (
            <button
              type="button"
              role="switch"
              aria-checked={finish === "gold"}
              aria-label="Toggle gold finish"
              onClick={() => setFinish(finish === "gold" ? "silver" : "gold")}
              className={`mt-1 flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                finish === "gold" ? "bg-brand" : "bg-white/25"
              }`}
            >
              <span
                className={`h-4 w-4 rounded-full bg-white transition-transform ${
                  finish === "gold" ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          ) : (
          <div className="mt-1 flex shrink-0 items-center gap-1.5">
            {swatches.map((s) => {
              const value = s.label.toLowerCase() === "gold" ? "gold" : "silver";
              const selected = finish === value;
              return (
                <button
                  key={s.label}
                  type="button"
                  title={s.label}
                  aria-label={`${s.label} finish`}
                  aria-pressed={selected}
                  onClick={() => setFinish(value)}
                  className={`h-3.5 w-3.5 rounded-full ring-1 transition-shadow ${
                    selected ? "ring-2 ring-white" : "ring-white/20"
                  }`}
                  style={{ backgroundColor: s.color }}
                />
              );
            })}
          </div>
          )}
        </div>

        <div className="mt-2 flex items-end justify-between gap-3">
          <p className="max-w-[62%] text-[12px] leading-relaxed text-ink">
            {description}
          </p>
          <p className="shrink-0 text-[14px] text-ink">{formatPrice(price)}</p>
        </div>
      </div>
    </motion.article>
  );
}
