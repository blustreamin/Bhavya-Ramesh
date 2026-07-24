"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArchiveStory } from "@/components/ArchiveStory";
import { MobileArchive } from "@/components/MobileArchive";
import { AsWorn } from "@/components/AsWorn";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";

/* ------------------------------------------------------------------ *
 * Primitives
 * ------------------------------------------------------------------ */

/* Content sections sit in a 1440 box (1240 of content at the Figma margin) so
   they don't stretch on large displays. */
const SHELL = "mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-[100px]";

/* The hero runs edge to edge, so its copy tracks the nav instead. */
const SHELL_WIDE = "w-full px-6 md:px-12 lg:px-[100px]";
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

/** Section divider — spans the full viewport width, edge to edge. */
function Rule() {
  return <div aria-hidden className="h-px w-full bg-white/10" />;
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

/* Outlined hero buttons — 46px tall, 10px radius, solid white hairline. */
const HERO_BTN =
  "group inline-flex h-[46px] items-center gap-3 rounded-[10px] border border-white bg-white/[0.02] px-5 font-ui text-[11px] font-bold uppercase tracking-[0.1em] text-white backdrop-blur-[2px] transition-colors duration-300 hover:border-gold hover:text-gold";

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
      <div className={`relative flex h-full flex-col justify-center ${SHELL_WIDE}`}>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
          className="font-display text-[44px] font-medium uppercase leading-[1.32] tracking-[0.005em] text-gold sm:text-[58px] lg:text-[70px]"
        >
          Bhavya
          <br />
          Ramesh
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.38 }}
          className="mt-6 max-w-[321px] font-ui text-[14px] leading-[1.55] text-white"
        >
          A silverware house fostering love &amp; oneness — cast in 925, worn without apology.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.52 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <Link href="/shop" className={HERO_BTN}>
            Shop Now
            <ArrowUpRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link href="/campaign" className={HERO_BTN}>
            View Campaign
            <ArrowUpRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
  const ref = useRef<HTMLElement>(null);
  // Section-scoped scroll drives the parallax: the artwork drifts against the
  // copy as the section travels through the viewport.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["34px", "-34px"]);
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  return (
    <section ref={ref} className={`${SHELL} overflow-hidden py-24 lg:py-36`}>
      {/* 53 / 32 columns with a 15% gutter — the Figma proportions */}
      <div className="grid items-center gap-14 lg:grid-cols-[53fr_32fr] lg:gap-[15%]">
        {/* artwork — curtain reveal, parallax drift, slow zoom on hover */}
        <div className="group relative">
          {/* gold bloom that breathes as the section passes */}
          <motion.div
            aria-hidden
            style={{ opacity: glow }}
            className="pointer-events-none absolute -inset-16 -z-10 blur-3xl"
          >
            <div
              className="h-full w-full"
              style={{ background: "radial-gradient(50% 50% at 42% 50%, rgba(192,171,121,0.30), transparent 70%)" }}
            />
          </motion.div>

          <div className="relative aspect-[661/419] w-full overflow-hidden">
            <div className="h-full w-full transition-transform duration-[1.6s] ease-out group-hover:scale-[1.05]">
              <motion.img
                src="/v2/gilga.png"
                alt="GilGa collection"
                style={{ y: imageY, scale: 1.1 }}
                className="h-full w-full object-cover"
              />
            </div>
            {/* curtain wipes upward to uncover the artwork */}
            <motion.div
              aria-hidden
              initial={{ scaleY: 1 }}
              whileInView={{ scaleY: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 1.15, ease: EASE }}
              className="absolute inset-0 origin-top bg-night"
            />
          </div>
        </div>

        {/* copy — drifts the opposite way */}
        <motion.div style={{ y: copyY }}>
          {/* eyebrow: rule draws out, then the label fades in */}
          <div className="flex items-center gap-4">
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, ease: EASE }}
              className="h-px w-12 origin-left bg-gold"
            />
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              className="font-ui text-[16px] uppercase tracking-[0.05em] text-white"
            >
              Featured Collection
            </motion.p>
          </div>

          {/* GILGA — letters rise in, then a sheen sweeps across */}
          <motion.h2
            aria-label="GilGa"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ show: { transition: { staggerChildren: 0.075, delayChildren: 0.25 } } }}
            className="relative mt-6 overflow-hidden font-display text-[64px] font-medium uppercase leading-[0.97] tracking-[0.01em] text-gold sm:text-[80px] lg:text-[96px]"
          >
            {"GILGA".split("").map((ch, idx) => (
              <motion.span
                key={idx}
                className="inline-block"
                variants={{
                  hidden: { opacity: 0, y: "60%" },
                  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
                }}
              >
                {ch}
              </motion.span>
            ))}
            <motion.span
              aria-hidden
              initial={{ x: "-130%" }}
              whileInView={{ x: "150%" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.4, delay: 1.05, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(255,246,224,0.55), transparent)",
                mixBlendMode: "plus-lighter",
              }}
            />
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.85, delay: 0.45, ease: EASE }}
            className="mt-7 max-w-[300px] font-ui text-[14px] leading-[1.4] text-white"
          >
            Named for the oldest story ever carved. GilGa reimagines ancient myth as wearable silver — half relic, half
            rebellion. Serpents, thrones, and eyes that don&apos;t blink.
          </motion.p>

          {/* button fills with gold on hover */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
          >
            <Link
              href="/shop"
              className="group/btn relative mt-9 inline-flex h-[30px] w-[122px] items-center justify-center overflow-hidden rounded-full border border-[#f3f4f6] font-ui text-[12px] text-white transition-colors duration-300 hover:border-gold"
            >
              <span
                aria-hidden
                className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-out group-hover/btn:scale-x-100"
              />
              <span className="relative transition-colors duration-300 group-hover/btn:text-black">SHOP GILGA</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * The Collection — signature product cards
 * ------------------------------------------------------------------ */

/* Each finish swatch maps to its own photograph. */
const SIGNATURE_BASE = [
  {
    id: "dinero-sunglass",
    name: "DINERO SUNGLASS",
    price: 25000,
    finishes: [
      { label: "Silver", color: "#d9d9d9", image: "/v2/col1.png" },
      { label: "Gold", color: "#c0ab79", image: "/v2/best1.png" },
    ],
  },
  {
    id: "chameli-earrings",
    name: "CHAMELI EARRINGS",
    price: 25000,
    finishes: [
      { label: "Silver", color: "#d9d9d9", image: "/v2/col2.png" },
      { label: "Gold", color: "#c0ab79", image: "/v2/best3.png" },
    ],
  },
  {
    id: "noir-grillz",
    name: "NOIR GRILLZ",
    price: 25000,
    finishes: [
      { label: "Silver", color: "#d9d9d9", image: "/v2/col3.png" },
      { label: "Gold", color: "#c0ab79", image: "/v2/col3b.png" },
    ],
  },
];

/* Six slides for the carousel — the catalogue repeats until Shopify feeds it. */
const SIGNATURE = [
  ...SIGNATURE_BASE,
  ...SIGNATURE_BASE.map((p) => ({ ...p, id: `${p.id}-ii` })),
];

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function SignatureCard({ product }: { product: (typeof SIGNATURE)[number] }) {
  const [finish, setFinish] = useState(0);
  const addLocal = useCartStore((s) => s.addLocal);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const saved = useWishlistStore((s) => s.items.some((i) => i.id === product.id));
  const frameRef = useRef<HTMLDivElement>(null);
  const active = product.finishes[finish];

  /** Saves to the wishlist and flies the photo up to the header heart. */
  const handleWishlist = () => {
    const added = toggleWish({
      id: product.id,
      name: product.name,
      price: product.price,
      image: active.image,
      finish: active.label.toLowerCase() === "gold" ? "gold" : "silver",
    });
    if (added && frameRef.current) {
      window.dispatchEvent(
        new CustomEvent("fly-to-cart", {
          detail: {
            image: active.image,
            rect: frameRef.current.getBoundingClientRect(),
            target: "wishlist-fly-target",
          },
        }),
      );
    }
  };

  const handleAdd = () => {
    addLocal(
      { id: `${product.id}-${active.label.toLowerCase()}`, name: product.name, price: product.price, image: active.image },
      active.label.toLowerCase() === "gold" ? "gold" : "silver",
    );
    // Reuse the shared fly-to-cart layer from the root layout.
    if (frameRef.current) {
      window.dispatchEvent(
        new CustomEvent("fly-to-cart", {
          detail: { image: active.image, rect: frameRef.current.getBoundingClientRect() },
        }),
      );
    }
  };

  return (
    <article className="group relative overflow-hidden rounded-[3px] border border-[#2a2a29] bg-[#080707]">
      {/* a gold line traces the whole border on hover (pathLength keeps it
          exact at any card size) */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 h-full w-full overflow-visible"
        fill="none"
        preserveAspectRatio="none"
      >
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx="3"
          pathLength={1}
          stroke="#c0ab79"
          strokeWidth="1.5"
          className="[stroke-dasharray:1] [stroke-dashoffset:1] transition-[stroke-dashoffset] duration-[900ms] ease-out group-hover:[stroke-dashoffset:0]"
        />
      </svg>

      {/* portrait frame matched to the photography so it fills edge to edge */}
      <div ref={frameRef} className="relative aspect-[3/4] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={active.image}
            src={active.image}
            alt={`${product.name} — ${active.label}`}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        {/* legibility wash — deepens on hover so the copy stays crisp */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/20 transition-opacity duration-500 group-hover:opacity-90" />

        {/* curtain wipes up to uncover the piece as the card scrolls in */}
        <motion.div
          aria-hidden
          initial={{ scaleY: 1 }}
          whileInView={{ scaleY: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.95, ease: EASE }}
          className="absolute inset-0 z-10 origin-top bg-night"
        />
      </div>

      {/* add to cart — spins a quarter turn on hover */}
      <motion.button
        type="button"
        aria-label={`Add ${product.name} to cart`}
        onClick={handleAdd}
        whileHover={{ rotate: 90, scale: 1.15 }}
        whileTap={{ scale: 0.85 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="absolute right-4 top-1 z-20 font-ui text-[32px] font-light leading-none text-gold"
      >
        +
      </motion.button>

      {/* overlaid details */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 p-[18px]">
        <div>
          <h3 className="font-ui text-[16px] font-bold leading-[1.4] text-white">{product.name}</h3>
          <p className="mt-0.5 font-ui text-[14px] leading-[1.4] text-white">{inr(product.price)}</p>
          <button
            type="button"
            onClick={handleWishlist}
            aria-pressed={saved}
            className="mt-2 font-ui text-[12px] font-bold uppercase text-gold underline underline-offset-2 transition-opacity hover:opacity-75"
          >
            {saved ? "In Wishlist" : "Add to Wishlist"}
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-2 pb-1">
          {product.finishes.map((f, i) => (
            <button
              key={f.label}
              type="button"
              aria-label={`${f.label} finish`}
              aria-pressed={finish === i}
              onClick={() => setFinish(i)}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                finish === i ? "ring-2 ring-white ring-offset-1 ring-offset-black" : "opacity-70 hover:opacity-100"
              }`}
              style={{ backgroundColor: f.color }}
            />
          ))}
        </div>
      </div>
    </article>
  );
}

/** Circular slider control. */
function SlideBtn({ dir, onClick, disabled }: { dir: "prev" | "next"; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      aria-label={dir === "prev" ? "Previous products" : "Next products"}
      onClick={onClick}
      disabled={disabled}
      className={`absolute top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/45 bg-black/50 text-white backdrop-blur-sm transition-all duration-300 hover:border-gold hover:text-gold disabled:pointer-events-none disabled:opacity-0 sm:flex ${
        dir === "prev" ? "-left-3 lg:-left-6" : "-right-3 lg:-right-6"
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d={dir === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function Collection() {
  const scroller = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [active, setActive] = useState(0);

  /** One card + the 1rem gap — the slider's unit of travel. */
  const step = () => {
    const el = scroller.current;
    const card = el?.firstElementChild as HTMLElement | undefined;
    return card ? card.getBoundingClientRect().width + 16 : 0;
  };

  const update = () => {
    const el = scroller.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
    const s = step();
    if (s > 0) setActive(Math.round(el.scrollLeft / s));
  };

  const goToSlide = (i: number) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ left: i * step(), behavior: "smooth" });
  };
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Advance by exactly one card so the slider always lands on a card edge.
  const by = (dir: number) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className={`${SHELL} py-20 lg:py-28`}>
      <Reveal>
        <p className="font-ui text-[16px] uppercase tracking-[0.03em] text-white">The Collection</p>
        <h2 className="mt-5 max-w-[1146px] font-display text-[32px] font-medium leading-[1.25] text-gold sm:text-[40px]">
          Signature pieces, crafted to be timeless
        </h2>
      </Reveal>

      <div className="relative mt-14">
        <div
          ref={scroller}
          onScroll={update}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth"
        >
          {SIGNATURE.map((p) => (
            <div
              key={p.id}
              className="w-[78%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
            >
              {/* no entrance offset here — the cards must not shift while the
                  slider scrolls; the curtain wipe handles the reveal */}
              <SignatureCard product={p} />
            </div>
          ))}
        </div>

        <SlideBtn dir="prev" onClick={() => by(-1)} disabled={atStart} />
        <SlideBtn dir="next" onClick={() => by(1)} disabled={atEnd} />
      </div>

      {/* phones use dots instead of the side arrows */}
      <div className="mt-7 flex justify-center gap-2 sm:hidden">
        {SIGNATURE.map((p, i) => (
          <button
            key={p.id}
            type="button"
            aria-label={`Go to product ${i + 1}`}
            aria-current={active === i}
            onClick={() => goToSlide(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              active === i ? "w-6 bg-gold" : "w-1.5 bg-white/30"
            }`}
          />
        ))}
      </div>

      <Reveal className="mt-14 flex justify-center">
        <Link
          href="/shop"
          className="group inline-flex items-center gap-3 font-ui text-[16px] text-gold underline underline-offset-4 transition-opacity hover:opacity-80"
        >
          VIEW ALL COLLECTION
          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
        </Link>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Bestsellers — editorial grid
 * ------------------------------------------------------------------ */

/** Bestseller tile — photo with the index + name overlaid at the bottom. */
function BestTile({
  src,
  index,
  title,
  href,
  className = "",
}: {
  src: string;
  index: string;
  title: string;
  href: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={`${title} — view collection`}
      className={`group relative block overflow-hidden rounded-[3px] border border-[#2a2a29] bg-[#0a0a0a] ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={title} className="h-full w-full object-cover" />

      {/* wash so the caption stays readable */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-20 p-4 lg:p-[22px]">
        <p className="font-ui text-[12px] leading-none text-gold lg:text-[14px]">{index}</p>
        <h3 className="mt-2.5 font-display text-[20px] font-medium uppercase leading-[1.15] text-white lg:text-[24px]">
          {title}
        </h3>
      </div>

      {/* gold line traces the border on hover */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 h-full w-full overflow-visible"
        fill="none"
        preserveAspectRatio="none"
      >
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx="3"
          pathLength={1}
          stroke="#c0ab79"
          strokeWidth="1.5"
          className="[stroke-dasharray:1] [stroke-dashoffset:1] transition-[stroke-dashoffset] duration-[900ms] ease-out group-hover:[stroke-dashoffset:0]"
        />
      </svg>

      {/* curtain uncovers the piece on scroll — no movement */}
      <motion.div
        aria-hidden
        initial={{ scaleY: 1 }}
        whileInView={{ scaleY: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: EASE }}
        className="absolute inset-0 z-40 origin-top bg-night"
      />
    </Link>
  );
}

function Bestsellers() {
  return (
    <section className={`${SHELL} py-16 lg:py-20`}>
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
        <Reveal>
          <p className="font-ui text-[16px] text-white">Bestsellers</p>
          <h2 className="mt-4 font-display text-[40px] font-medium leading-[1.17] text-gold sm:text-[52px] lg:text-[64px]">
            Ten worlds,
            <br />
            One vault.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex items-start gap-6 lg:mt-2">
            <span className="h-[65px] w-px shrink-0 bg-white/25" />
            <p className="pt-2.5 font-ui text-[14px] leading-[1.55] text-white">
              Every piece cast, cut
              <br />
              and polished by hand.
            </p>
          </div>
        </Reveal>
      </div>

      {/* Figma grid: 601 / 627 columns, right column split 339 + 339 and the
          lower row split 409 / 206. Height tracks the viewport so the whole
          section reads on one screen. */}
      <div className="mt-12 grid gap-3 lg:aspect-[1240/691] lg:grid-cols-[601fr_627fr] lg:grid-rows-[minmax(0,1fr)]">
        <BestTile
          src="/v2/best1.png"
          index="01 - FEATURED"
          title="Dinero Sun Glass"
          href="/shop"
          className="h-[340px] lg:h-full lg:min-h-0"
        />

        <div className="grid gap-3 lg:min-h-0 lg:grid-rows-[minmax(0,1fr)_minmax(0,1fr)]">
          <BestTile
            src="/v2/best2.png"
            index="02"
            title="Agni Nail Ring"
            href="/products/agni-nail-ring"
            className="h-[200px] lg:h-full lg:min-h-0"
          />

          <div className="grid grid-cols-[409fr_206fr] gap-3 lg:min-h-0">
            <BestTile
              src="/v2/best3.png"
              index="03"
              title="Chameli Earrings"
              href="/shop"
              className="h-[200px] lg:h-full lg:min-h-0"
            />
            <BestTile
              src="/v2/best4.png"
              index="04"
              title="GilGa Ring"
              href="/shop"
              className="h-[200px] lg:h-full lg:min-h-0"
            />
          </div>
        </div>
      </div>

      <Reveal className="mt-12 flex justify-center">
        <Link
          href="/shop"
          className="group inline-flex items-center gap-3 font-ui text-[16px] text-gold underline underline-offset-4 transition-opacity hover:opacity-80"
        >
          VIEW ALL COLLECTION
          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
        </Link>
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
    <section className={`${SHELL} py-16 lg:py-24`}>
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        <Reveal>
          <h2 className="font-display text-[44px] font-medium leading-[1.17] text-gold sm:text-[56px] lg:text-[64px]">
            The Studio
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-[329px] font-ui text-[16px] leading-[1.4] text-smoke lg:mt-5">
            Founded 2018 — design out of Mumbai, made by hand in Jaipur.
          </p>
        </Reveal>
      </div>

      <div className="mt-8 h-px w-full bg-white/15" />

      {/* Figma: 509 image / 652 copy with an 83px gutter */}
      <div className="mt-14 grid gap-12 lg:grid-cols-[509fr_652fr] lg:gap-[6.7%]">
        <Reveal>
          <div className="aspect-[509/764] w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/v2/studio.png" alt="Bhavya Ramesh studio" className="h-full w-full object-cover" />
          </div>
        </Reveal>

        <div className="flex flex-col">
          <Reveal delay={0.1}>
            <p className="font-ui text-[18px] font-extralight leading-[1.45] text-white/65 lg:text-[24px]">
              Bhavya Ramesh trained as an engineer, not a designer — and it shows in the work.{" "}
              <span className="font-medium text-white">Structure, form, and function</span> came first; the silver came
              after, chosen because it was honest, valuable, and built to outlast trends. What began as a one-person
              label sketching pieces on the road, inspired by the ornament traditions of Rajasthan and northern
              Karnataka, has grown into a full studio without losing that original instinct: nothing mediocre leaves the
              workshop.
            </p>
            <p className="mt-8 font-ui text-[18px] font-extralight leading-[1.45] text-white/65 lg:text-[24px]">
              The brand is built around{" "}
              <span className="font-medium text-white">self-expression and a fluid, gender-unifying community</span> —
              jewelry as identity rather than decoration. Every collection is still hand-finished, still rooted in the
              artisan traditions the label started with, and still made to be worn until it earns its own patina.
            </p>
          </Reveal>

          <Reveal delay={0.16} className="mt-auto">
            <dl className="mt-16 grid grid-cols-2 gap-y-10 sm:grid-cols-4">
              {STATS.map((s, i) => (
                <div key={s.label} className={i > 0 ? "sm:border-l sm:border-white/15 sm:pl-7" : ""}>
                  <dt className="font-display text-[36px] font-medium leading-none text-gold lg:text-[40px]">
                    {s.value}
                  </dt>
                  <dd className="mt-4 max-w-[145px] font-ui text-[14px] leading-[1.4] text-smoke">{s.label}</dd>
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
 * The House
 * ------------------------------------------------------------------ */

function House() {
  return (
    <section className={`${SHELL} py-16 lg:py-20`}>
      {/* Figma: 780 copy column, 343 image starting at 72%. Two columns from
          tablet up; stacked with a centred serpent on phones. */}
      <div className="grid gap-10 md:grid-cols-[780fr_343fr] md:gap-[6%] lg:gap-[9%]">
        <div className="flex flex-col">
          <Reveal>
            <p className="font-ui text-[16px] uppercase tracking-[0.03em] text-white">The House</p>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-8 font-display text-[21px] font-medium leading-[1.32] text-white sm:text-[24px] lg:text-[28px]">
              A conscious silverware brand, fostering <span className="text-gold">love &amp; oneness</span> to create a
              fluid community that wholeheartedly expresses itself.
            </p>
            <p className="mt-7 font-display text-[21px] font-medium leading-[1.32] text-white sm:text-[24px] lg:text-[28px]">
              We believe in the power of being <span className="text-gold">sensitive and sublime.</span>
            </p>
          </Reveal>

          <Reveal delay={0.14} className="mt-auto">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-10 flex max-w-[643px] items-center justify-between gap-4 border-b border-white/20 pb-3 sm:gap-6 lg:mt-16"
            >
              <input
                type="email"
                required
                placeholder="Sign up for new collection notifications"
                className="w-full min-w-0 bg-transparent font-ui text-[14px] text-white placeholder:text-[#767676] focus:outline-none sm:text-[16px]"
              />
              <button
                type="submit"
                className="shrink-0 font-ui text-[12px] uppercase tracking-[0.02em] text-gold transition-opacity hover:opacity-75 sm:text-[14px]"
              >
                Notify Me
              </button>
            </form>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          {/* contained, not cropped — the artwork's black surround blends
              straight into the page. Centred and smaller on phones. */}
          <div className="mx-auto aspect-[343/400] w-full max-w-[250px] sm:max-w-[300px] md:max-w-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/v2/house.png" alt="Serpent sculpture" className="h-full w-full object-contain" />
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
        <Rule />
        <Collection />
        <Bestsellers />
        <Rule />
        <Studio />
        {/* Archive story from the previous homepage — scroll-driven on
            desktop, stacked on mobile */}
        <div className="hidden lg:block">
          <ArchiveStory tone="gold" />
        </div>
        <MobileArchive tone="gold" />
        <AsWorn tone="gold" />
        <House />
        <Rule />
      </main>
      <Footer />
    </>
  );
}
