"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { type Product, formatPrice } from "@/lib/products";
import { useCartStore } from "@/store/cart";
import { StarRating } from "./ui/StarRating";
import { PlusIcon } from "./ui/Icons";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { id, name, description, price, rating, swatches, image, goldImage, glow } = product;

  // Selected finish, driven by the colour swatches.
  const [finish, setFinish] = useState<"silver" | "gold">("silver");
  const addLocal = useCartStore((s) => s.addLocal);
  const imageRef = useRef<HTMLAnchorElement>(null);

  const handleAdd = () => {
    const flyImage = finish === "gold" ? goldImage ?? image : image;
    addLocal({ id, name, price, image: flyImage }, finish);

    // Launch a flying clone of the product image into the header cart icon.
    if (flyImage && imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      window.dispatchEvent(
        new CustomEvent("fly-to-cart", { detail: { image: flyImage, rect } }),
      );
    }
  };

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group/card relative flex h-full flex-col overflow-hidden rounded-[10px] bg-gradient-to-b from-[#2a2a30] to-[#1b1b1f] p-4 sm:p-5"
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
      <motion.button
        type="button"
        aria-label={`Add ${name} to cart`}
        onClick={handleAdd}
        whileTap={{ scale: 0.8 }}
        className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-brand"
      >
        <PlusIcon className="h-5 w-5" />
      </motion.button>

      {/* Product image — silver base with a gold finish that cross-fades in
          only while hovering the image itself. Links to the product page. */}
      <Link ref={imageRef} href={`/products/${id}`} className="group relative z-[1] flex aspect-[5/4] shrink-0 items-center justify-center sm:aspect-auto sm:h-[300px]">
        {image ? (
          <>
            <Image
              src={image}
              alt={name}
              width={400}
              height={400}
              className={`h-full w-full object-contain transition-opacity duration-300 ${
                finish === "gold" ? "opacity-0" : "opacity-100"
              } ${goldImage ? "group-hover:opacity-0" : ""}`}
            />
            {goldImage && (
              <Image
                src={goldImage}
                alt=""
                aria-hidden
                width={400}
                height={400}
                className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 group-hover:opacity-100 ${
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
      </Link>

      {/* Details */}
      <div className="relative z-[1] mt-auto pt-4 sm:pt-6">
        <StarRating value={rating} />

        <div className="mt-3 flex items-start justify-between gap-3">
          <h3 className="font-sans text-[17px] font-bold leading-tight text-brand sm:text-[24px]">
            <Link href={`/products/${id}`} className="transition-opacity hover:opacity-80">{name}</Link>
          </h3>

          {/* Finish control — colour swatches. */}
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
        </div>

        <div className="mt-2 flex items-end justify-between gap-3">
          <p className="line-clamp-2 max-w-[60%] text-[11px] leading-relaxed text-ink sm:text-[12px]">
            {description}
          </p>
          <p className="shrink-0 text-[13px] text-ink sm:text-[14px]">{formatPrice(price)}</p>
        </div>
      </div>
    </motion.article>
  );
}
