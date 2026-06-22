"use client";

import Image from "next/image";
import { featuredProducts } from "@/lib/products";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ProductCard } from "./ProductCard";

/**
 * "Built from mythology. Designed for now." — the brand / Why We Exist
 * section (Figma node 541:4116–541:4141).
 *
 * Two columns, each a vertical slider:
 *  - left: the heading, then a scroll-snap slider of founder image + copy
 *    slides (scroll to read more / see the next slide);
 *  - right: FEATURED PRODUCTS, a scroll-snap slider of product cards
 *    (scroll to the next product).
 */

const FOUNDER_SLIDES = [
  {
    image: "/figma/a84d74e88d85a896816c92501c398023d08a065d.png",
    text: "Established in 2018, Bhavya Ramesh is dedicated to the artistry of traditional jewelry making. Led by founder Bhavya Ramesh, we prioritize the human touch, supporting local artisans who craft each piece with meticulous attention to detail, ensuring that our jewelry is not only desirable but also meant to be cherished and passed down through generations.",
  },
  {
    image: "/figma/75b4b285ea05ee7517093a2a44d08a3ec095aedf.png",
    text: "Rooted in the values of Indian culture, we foster a sense of community and craftsmanship while continuously pushing the boundaries of fashion. Bhavya Ramesh is a distinguished Indian retail brand specializing in the design, development, manufacturing, and distribution of jewelry and body accessories.",
  },
  {
    image: "/figma/6738c5a74801a038f077ee91e9bff23876ac38c7.png",
    text: "Operating from our warehouse in Jaipur, we proudly employ a team of 40 skilled artisans and 10 dedicated workers who contribute to our production processes. Additionally, our business is supported by a proficient team of 30 employees based in Mumbai, focusing on forefront operations.",
  },
];

export function BrandStory() {
  const ref = useScrollReveal<HTMLDivElement>({ childSelector: "[data-reveal]" });

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
        {/* Left — brand statement + founder slider */}
        <div className="flex flex-col">
          <p data-reveal className="text-[16px] uppercase tracking-[0.18em] text-white">
            Why We Exist
          </p>
          <h2
            data-reveal
            className="mt-6 max-w-[640px] font-serif text-[40px] leading-[1.05] text-white sm:text-[56px] lg:text-[65px]"
          >
            Built from mythology. Designed for now.
          </h2>

          {/* Vertical slider — founder image on top, copy below, with a left
              line accent. Scroll to read more / see the next slide. */}
          <div
            data-reveal
            className="no-scrollbar mt-12 h-[500px] snap-y snap-mandatory overflow-y-auto"
          >
            {FOUNDER_SLIDES.map((slide, i) => (
              <article key={i} className="flex snap-start gap-6 pb-12">
                <span aria-hidden className="w-px shrink-0 self-stretch bg-white/30" />
                <div className="max-w-[380px]">
                  <div className="relative aspect-[7/5] w-[280px] max-w-full overflow-hidden">
                    <Image
                      src={slide.image}
                      alt="Bhavya Ramesh atelier"
                      fill
                      sizes="280px"
                      className="object-cover grayscale"
                    />
                  </div>
                  <p className="mt-5 text-[14px] leading-relaxed text-white">
                    {slide.text}
                  </p>
                  <span className="mt-6 block h-px w-full bg-brand/70" />
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Right — featured products slider with a left line accent. */}
        <div className="flex flex-col">
          <p data-reveal className="text-[16px] uppercase tracking-[0.18em] text-white">
            Featured Products
          </p>
          <div data-reveal className="mt-6 flex gap-6">
            <span aria-hidden className="w-px shrink-0 self-stretch bg-white/30" />
            <div className="no-scrollbar h-[520px] flex-1 snap-y snap-mandatory space-y-6 overflow-y-auto">
              {featuredProducts.map((product) => (
                <div key={product.id} className="h-[500px] snap-start">
                  <ProductCard product={product} control="toggle" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
