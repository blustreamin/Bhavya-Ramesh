"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/* ------------------------------------------------------------------ *
 * Primitives
 * ------------------------------------------------------------------ */

const SHELL = "mx-auto w-full max-w-[1440px] px-6 lg:px-[100px]";
const EASE = [0.22, 1, 0.36, 1] as const;

function ArrowUpRight({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Subtle fade-up used across the page. */
function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Small letter-spaced section eyebrow. */
function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-ui text-[11px] uppercase tracking-[0.28em] text-white/55 ${className}`}>{children}</p>
  );
}

/** Underlined text link with a sliding arrow. */
function TextLink({ href = "#", children, className = "" }: { href?: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 font-ui text-[12px] uppercase tracking-[0.22em] text-white transition-colors hover:text-gold ${className}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
    </Link>
  );
}

/* ------------------------------------------------------------------ *
 * Hero — 3-slide video slider
 * Drop the campaign films in as `video` and they take over from the
 * poster automatically.
 * ------------------------------------------------------------------ */

const SLIDE_MS = 7000;

const HERO_SLIDES: { poster: string; video?: string }[] = [
  { poster: "/v2/hero1.png", video: "/v2/hero1.mp4" },
  { poster: "/campaign/hero.png", video: "/v2/hero2.mp4" },
  { poster: "/v2/house.png", video: "/v2/hero3.mp4" },
];

function Hero() {
  const [i, setI] = useState(0);
  const n = HERO_SLIDES.length;

  useEffect(() => {
    const t = setTimeout(() => setI((v) => (v + 1) % n), SLIDE_MS);
    return () => clearTimeout(t);
  }, [i, n]);

  return (
    <section className="relative h-[92svh] min-h-[600px] w-full overflow-hidden bg-night">
      {/* slides */}
      <AnimatePresence initial={false}>
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <motion.div
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: SLIDE_MS / 1000 + 1.2, ease: "linear" }}
            className="h-full w-full"
          >
            {HERO_SLIDES[i].video ? (
              <video
                src={HERO_SLIDES[i].video}
                poster={HERO_SLIDES[i].poster}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={HERO_SLIDES[i].poster} alt="" className="h-full w-full object-cover" />
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* legibility washes */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 38%, rgba(0,0,0,0) 68%)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(1,1,0,0.9) 0%, rgba(0,0,0,0) 32%)" }} />

      {/* copy */}
      <div className={`relative flex h-full flex-col justify-center ${SHELL}`}>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
          className="font-display text-[52px] font-medium uppercase leading-[0.98] tracking-[0.01em] text-gold sm:text-[68px] lg:text-[76px]"
        >
          Bhavya
          <br />
          Ramesh
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.38 }}
          className="mt-7 max-w-[330px] font-ui text-[13px] leading-relaxed text-white/80"
        >
          A silverware house fostering love &amp; oneness — cast in 925, worn without apology.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.52 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2.5 border border-white/70 px-6 py-3 font-ui text-[11px] uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:border-gold hover:text-gold"
          >
            Shop Now
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            href="/campaign"
            className="group inline-flex items-center gap-2.5 border border-white/70 px-6 py-3 font-ui text-[11px] uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:border-gold hover:text-gold"
          >
            View Campaign
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
      </div>

      {/* slide indicators */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2.5">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Slide ${idx + 1}`}
            onClick={() => setI(idx)}
            className="h-[2px] w-[54px] bg-white/25 sm:w-[76px]"
          >
            {idx === i && (
              <motion.span
                key={`fill-${i}`}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                className="block h-full bg-gold"
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Ticker
 * ------------------------------------------------------------------ */

const TICKER = [
  "Handcrafted, not manufactured",
  "Worldwide shipping",
  "Supporting traditional silversmithing",
  "925 Sterling Silver",
];

function Ticker() {
  const row = (
    <div className="flex shrink-0 items-center">
      {TICKER.map((t) => (
        <span key={t} className="flex items-center">
          <span className="mx-8 h-1.5 w-1.5 rounded-full bg-brand" />
          <span className="whitespace-nowrap font-ui text-[11px] uppercase tracking-[0.3em] text-white/65">{t}</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="overflow-hidden border-y border-white/10 bg-[#0b0b0b] py-3.5">
      <motion.div
        className="flex w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 38, ease: "linear", repeat: Infinity }}
      >
        {row}
        {row}
        {row}
        {row}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Featured collection — GILGA
 * ------------------------------------------------------------------ */

function Featured() {
  return (
    <section className={`${SHELL} py-20 lg:py-28`}>
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.62fr] lg:gap-20">
        <Reveal>
          <div className="group overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/v2/gilga.png"
              alt="GilGa collection"
              className="h-[300px] w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04] sm:h-[420px]"
            />
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <Eyebrow>Featured Collection</Eyebrow>
          <h2 className="mt-5 font-display text-[54px] font-medium uppercase leading-[1] tracking-[0.02em] text-gold lg:text-[64px]">
            GilGa
          </h2>
          <p className="mt-6 max-w-[300px] font-ui text-[13px] leading-[1.85] text-white/60">
            Named for the oldest story ever carved. GilGa reimagines ancient myth as wearable silver — half relic, half
            rebellion. Serpents, thrones, and eyes that don&apos;t blink.
          </p>
          <Link
            href="/shop"
            className="group mt-9 inline-flex items-center gap-2.5 border border-white/40 px-5 py-2.5 font-ui text-[11px] uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:border-gold hover:text-gold"
          >
            Shop GilGa
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * The Collection — signature product cards
 * ------------------------------------------------------------------ */

const SIGNATURE = [
  { name: "Dinero Sunglass", price: "₹25,000", image: "/v2/col1.png" },
  { name: "Chameli Earrings", price: "₹25,000", image: "/v2/col2.png" },
  { name: "Noir Grillz", price: "₹25,000", image: "/v2/col3.png" },
];

function Collection() {
  return (
    <section className={`${SHELL} border-t border-white/10 py-20 lg:py-28`}>
      <Reveal>
        <Eyebrow>The Collection</Eyebrow>
        <h2 className="mt-5 max-w-[1100px] font-display text-[40px] font-medium leading-[1.1] text-white sm:text-[54px] lg:text-[62px]">
          Signature pieces, crafted to be timeless
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
        {SIGNATURE.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08}>
            <article className="group">
              <div className="relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-[300px] w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05] sm:h-[340px]"
                />
                <button
                  type="button"
                  aria-label={`Add ${p.name}`}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center text-[22px] font-light leading-none text-white/80 transition-colors hover:text-gold"
                >
                  +
                </button>
              </div>

              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-ui text-[12px] uppercase tracking-[0.16em] text-white">{p.name}</h3>
                  <p className="mt-1.5 font-ui text-[12px] tracking-[0.06em] text-white/55">{p.price}</p>
                  <button
                    type="button"
                    className="mt-4 font-ui text-[10px] uppercase tracking-[0.24em] text-white/45 underline-offset-4 transition-colors hover:text-gold hover:underline"
                  >
                    Add to Wishlist
                  </button>
                </div>
                <div className="mt-1 flex shrink-0 items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#d9d9d9]" />
                  <span className="h-3 w-3 rounded-full bg-[#c0ab79]" />
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14 flex justify-center">
        <TextLink href="/shop">View All Collection</TextLink>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Bestsellers — editorial grid
 * ------------------------------------------------------------------ */

function Caption({ index, title }: { index: string; title: string }) {
  return (
    <div className="mt-5">
      <p className="font-ui text-[10px] uppercase tracking-[0.28em] text-gold">{index}</p>
      <h3 className="mt-2 font-display text-[26px] font-medium uppercase leading-[1.1] tracking-[0.02em] text-white lg:text-[32px]">
        {title}
      </h3>
    </div>
  );
}

function Bestsellers() {
  const frame =
    "group relative overflow-hidden bg-[#0a0a0a]";
  const img =
    "h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]";

  return (
    <section className={`${SHELL} border-t border-white/10 py-20 lg:py-28`}>
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <Reveal>
          <Eyebrow>Bestsellers</Eyebrow>
          <h2 className="mt-5 max-w-[420px] font-display text-[40px] font-medium leading-[1.08] text-white sm:text-[52px] lg:text-[58px]">
            Ten worlds,
            <br />
            One vault.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex max-w-[360px] items-start gap-5">
            <span className="mt-1 h-14 w-px bg-white/20" />
            <p className="font-ui text-[13px] leading-[1.8] text-white/55">
              Every piece cast, cut and polished by hand.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:gap-8">
        {/* left — tall feature */}
        <Reveal>
          <div className="flex h-full flex-col">
            <div className={`${frame} h-[420px] lg:h-[576px]`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/v2/best1.png" alt="Dinero Sun Glass" className={img} />
            </div>
            <Caption index="01 — Featured" title="Dinero Sun Glass" />
          </div>
        </Reveal>

        {/* right — stacked */}
        <div className="flex flex-col gap-6 lg:gap-8">
          <Reveal delay={0.08}>
            <div className={`${frame} h-[240px] lg:h-[328px]`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/v2/best2.png" alt="Agni Nail Ring" className={img} />
            </div>
            <Caption index="02" title="Agni Nail Ring" />
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-[1.6fr_1fr] lg:gap-8">
            <Reveal delay={0.14}>
              <div className={`${frame} h-[240px] lg:h-[300px]`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/v2/best3.png" alt="Chameli Earrings" className={img} />
              </div>
              <Caption index="03" title="Chameli Earrings" />
            </Reveal>
            <Reveal delay={0.2}>
              <div className={`${frame} h-[240px] lg:h-[300px]`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/v2/best4.png" alt="GilGa Ring" className={img} />
              </div>
              <Caption index="04" title="GilGa Ring" />
            </Reveal>
          </div>
        </div>
      </div>

      <Reveal className="mt-16 flex justify-center">
        <TextLink href="/shop">View All Collection</TextLink>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * The Studio
 * ------------------------------------------------------------------ */

const STATS = [
  { value: "2018", label: "Year Founded" },
  { value: "40+", label: "Artisans, Jaipur Atelier" },
  { value: "30", label: "Studio & Ops Team, Mumbai" },
  { value: "925", label: "Sterling Silver, Always" },
];

function Studio() {
  return (
    <section className={`${SHELL} border-t border-white/10 py-20 lg:py-28`}>
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <Reveal>
          <h2 className="font-display text-[46px] font-medium leading-[1.05] text-white sm:text-[60px] lg:text-[68px]">
            The Studio
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-[330px] font-ui text-[13px] leading-[1.8] text-white/55">
            Founded 2018 — design out of Mumbai, made by hand in Jaipur.
          </p>
        </Reveal>
      </div>

      <div className="mt-10 h-px w-full bg-white/12" />

      <div className="mt-12 grid gap-12 lg:grid-cols-[0.44fr_1fr] lg:gap-20">
        <Reveal>
          <div className="group overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/v2/studio.png"
              alt="Bhavya Ramesh studio"
              className="h-[440px] w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04] lg:h-[640px]"
            />
          </div>
        </Reveal>

        <div className="flex flex-col">
          <Reveal delay={0.1}>
            <p className="font-ui text-[13px] leading-[2] text-white/60">
              Bhavya Ramesh trained as an engineer, not a designer — and it shows in the work. Structure, form, and
              function came first; the silver came after, chosen because it was honest, valuable, and built to outlast
              trends. What began as a one-person label sketching pieces on the road, inspired by the ornament traditions
              of Rajasthan and northern Karnataka, has grown into a full studio without losing that original instinct:
              nothing mediocre leaves the workshop. The brand is built around self-expression and a fluid,
              gender-unifying community — jewelry as identity rather than decoration. Every collection is still
              hand-finished, still rooted in the artisan traditions the label started with, and still made to be worn
              until it earns its own patina.
            </p>
          </Reveal>

          <Reveal delay={0.16} className="mt-auto">
            <dl className="mt-14 grid grid-cols-2 gap-y-10 sm:grid-cols-4">
              {STATS.map((s, i) => (
                <div key={s.label} className={i > 0 ? "sm:border-l sm:border-white/15 sm:pl-6" : ""}>
                  <dt className="font-display text-[40px] font-medium leading-none text-white lg:text-[46px]">
                    {s.value}
                  </dt>
                  <dd className="mt-3 max-w-[130px] font-ui text-[11px] leading-[1.6] text-white/45">{s.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Silver band — product marquee
 * ------------------------------------------------------------------ */

const PIECES = [
  "/figma/0ac665a7b31c1af331d3a4b60fcc2f206b879fe6.png",
  "/figma/2a355c7498cf8b92e7a6ac3c9ece1bd727aa71eb.png",
  "/figma/1f474d211aff17d1dedca3194dfbb8c53fc87608.png",
  "/figma/95beb547aaa54910ead91e1a68155105422f32ed.png",
  "/figma/21a0dd581cc789481ac99ca16744ccf7c1ecb7c4.png",
  "/figma/caddd41f91522c9bccca2f032c557f1827533177.png",
  "/figma/2e78e9da92e032cfa2ddab3251a428c5f2779077.png",
  "/figma/7984d4b313728d13da8d454c336b438c671fa723.png",
];

function SilverBand() {
  const row = (
    <div className="flex shrink-0 items-center">
      {PIECES.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${src}-${i}`}
          src={src}
          alt=""
          aria-hidden
          className="mx-10 h-[150px] w-auto object-contain opacity-90 lg:h-[200px]"
        />
      ))}
    </div>
  );
  return (
    <section className="overflow-hidden border-y border-white/10 bg-night py-16 lg:py-20">
      <motion.div
        className="flex w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 55, ease: "linear", repeat: Infinity }}
      >
        {row}
        {row}
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * As Worn
 * ------------------------------------------------------------------ */

const WORN = [
  { name: "Aanya S", image: "/v2/worn1.png", quote: "Didn't think I was a jewellery person until this. Now it's the first thing I reach for before stepping out." },
  { name: "Ritvik Kumar", image: "/v2/worn2.png", quote: "Wore this once and suddenly every outfit started making more sense. It just hits different." },
  { name: "Meher Dhall", image: "/v2/worn3.png", quote: "Love how it feels rooted but still so unexpected. It's not traditional, but it still feels like home." },
  { name: "Ishaan R", image: "/v2/worn4.png", quote: "People keep asking where it's from — and honestly, I like gatekeeping it a little." },
];

function AsWorn() {
  return (
    <section className={`${SHELL} py-20 lg:py-28`}>
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <Reveal>
          <Eyebrow>As Worn</Eyebrow>
          <h2 className="mt-5 max-w-[620px] font-display text-[40px] font-medium leading-[1.08] text-gold sm:text-[54px] lg:text-[60px]">
            Jewellery, lived in and made your own.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="max-w-[400px]">
            <p className="font-ui text-[13px] leading-[1.85] text-white/60">
              From everyday moments to standout fits — this is how the pieces come alive.
            </p>
            <p className="mt-4 font-ui text-[13px] leading-[1.85] text-white/60">
              <span className="text-gold">Tag @bhavyaramesh</span> and show us how you wear it.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {WORN.map((w, i) => (
          <Reveal key={w.name} delay={i * 0.07}>
            <figure className="group relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={w.image}
                alt={w.name}
                className="h-[420px] w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05] lg:h-[500px]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-ui text-[13px] font-semibold tracking-[0.04em] text-gold">{w.name}</p>
                <p className="mt-2 font-ui text-[11px] leading-[1.6] text-white/70">{w.quote}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12 flex justify-end">
        <Link href="/campaign" className="font-ui text-[13px] text-white underline underline-offset-[6px] transition-colors hover:text-gold">
          View More
        </Link>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * The House
 * ------------------------------------------------------------------ */

function House() {
  return (
    <section className={`${SHELL} border-t border-white/10 py-20 lg:py-28`}>
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.36fr] lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow>The House</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-8 max-w-[780px] font-display text-[26px] leading-[1.45] text-white sm:text-[32px]">
              A conscious silverware brand, fostering <span className="text-gold">love &amp; oneness</span> to create a
              fluid community that wholeheartedly expresses itself.
            </p>
            <p className="mt-7 max-w-[780px] font-display text-[26px] leading-[1.45] text-white sm:text-[32px]">
              We believe in the power of being <span className="text-gold">sensitive and sublime.</span>
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-14 flex max-w-[643px] items-center justify-between gap-6 border-b border-white/25 pb-4"
            >
              <input
                type="email"
                required
                placeholder="Sign up for new collection notifications"
                className="w-full bg-transparent font-ui text-[13px] text-white placeholder:text-white/40 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 font-ui text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:text-gold"
              >
                Notify Me
              </button>
            </form>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="group overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/v2/house.png"
              alt="Serpent sculpture"
              className="h-[320px] w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04] lg:h-[400px]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export default function V2Page() {
  return (
    <>
      <Header />
      <main className="bg-night font-ui text-white">
        <Hero />
        <Ticker />
        <Featured />
        <Collection />
        <Bestsellers />
        <Studio />
        <SilverBand />
        <AsWorn />
        <House />
      </main>
      <Footer />
    </>
  );
}
