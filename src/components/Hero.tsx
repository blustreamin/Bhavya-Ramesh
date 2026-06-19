"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// The WebGL scene is client-only and lazily loaded so it never blocks the
// initial paint or runs during SSR.
const HeroCanvas = dynamic(() => import("./three/HeroCanvas"), {
  ssr: false,
  loading: () => null,
});

export function Hero() {
  return (
    <section className="relative flex h-[100svh] min-h-[640px] w-full items-center justify-center overflow-hidden bg-black">
      {/* 3D floating jewellery */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <HeroCanvas />
      </div>

      {/* Deep maroon glow rising from the bottom (matches screenshot). */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        aria-hidden
        style={{
          background:
            "radial-gradient(60% 80% at 50% 100%, rgba(120,20,55,0.45) 0%, rgba(5,5,5,0) 70%)",
        }}
      />

      {/* Title overlay */}
      <div className="pointer-events-none relative z-10 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="font-serif font-light leading-none tracking-tight text-white/95 text-[15vw] sm:text-[13vw] lg:text-[10rem]"
        >
          Bhavya Ramesh
        </motion.h1>
      </div>

      {/* Section label anchored to the bottom of the fold. */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-5 z-10 text-xs tracking-[0.3em] text-white/80 sm:left-8 sm:text-sm"
      >
        NEW ARRIVALS
      </motion.p>
    </section>
  );
}
