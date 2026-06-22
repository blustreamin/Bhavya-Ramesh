"use client";

import Image from "next/image";
import { newArrivals } from "@/lib/products";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ProductCard } from "./ProductCard";

/**
 * "Built from mythology. Designed for now." — the brand / Why We Exist
 * section (Figma node 541:4116–541:4141). A two-column layout: the brand
 * statement, founder portrait and copy on the left; a featured product on
 * the right.
 */
export function BrandStory() {
  const ref = useScrollReveal<HTMLDivElement>({ childSelector: "[data-reveal]" });
  const featured = newArrivals[0];

  return (
    <section className="relative overflow-hidden bg-black px-5 py-24 sm:px-8">
      {/* Cool grey gradient backdrop (Figma mask-group background). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 80% at 62% 8%, #2e2f35 0%, #141519 55%, #0a0a0c 100%)",
        }}
      />

      <div
        ref={ref}
        className="relative mx-auto grid max-w-[1400px] gap-14 lg:grid-cols-[1.5fr_1fr]"
      >
        {/* Left — brand statement + founder */}
        <div>
          <p
            data-reveal
            className="text-[16px] uppercase tracking-[0.18em] text-white"
          >
            Why We Exist
          </p>

          <h2
            data-reveal
            className="mt-6 max-w-[640px] font-serif text-[40px] leading-[1.05] text-white sm:text-[56px] lg:text-[65px]"
          >
            Built from mythology. Designed for now.
          </h2>

          <div className="mt-12 grid items-start gap-8 sm:grid-cols-[300px_1fr]">
            <div
              data-reveal
              className="relative aspect-[300/360] w-full overflow-hidden"
            >
              <Image
                src="/figma/a84d74e88d85a896816c92501c398023d08a065d.png"
                alt="Bhavya Ramesh, founder"
                fill
                sizes="300px"
                className="object-cover grayscale"
              />
            </div>

            <div data-reveal className="space-y-5 text-[14px] leading-relaxed text-white">
              <p>
                Established in 2018, Bhavya Ramesh is dedicated to the artistry of
                traditional jewelry making. Led by founder Bhavya Ramesh, we
                prioritize the human touch, supporting local artisans who craft
                each piece with meticulous attention to detail, ensuring that our
                jewelry is not only desirable but also meant to be cherished and
                passed down through generations.
              </p>
              <p className="text-white/80">
                Rooted in the values of Indian culture, we foster a sense of
                community and craftsmanship while continuously pushing the
                boundaries of fashion.
              </p>
              <span className="block h-px w-full bg-brand/70" />
            </div>
          </div>
        </div>

        {/* Right — featured product */}
        <div>
          <p
            data-reveal
            className="text-[16px] uppercase tracking-[0.18em] text-white"
          >
            Featured Products
          </p>
          <div data-reveal className="mt-6">
            <ProductCard product={featured} control="toggle" />
          </div>
        </div>
      </div>
    </section>
  );
}
