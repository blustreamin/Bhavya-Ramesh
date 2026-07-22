"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AsWorn } from "@/components/AsWorn";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";

/* ------------------------------------------------------------------ *
 * Tokens + primitives
 * ------------------------------------------------------------------ */

const SHELL = "mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-[100px]";
const EASE = [0.22, 1, 0.36, 1] as const;

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ArrowRight({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Chevron({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Heart({ filled = false, className = "h-4 w-4" }: { filled?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} className={className} aria-hidden>
      <path
        d="M12 20.3 4.6 13a4.7 4.7 0 0 1 0-6.7 4.7 4.7 0 0 1 6.7 0l.7.7.7-.7a4.7 4.7 0 0 1 6.7 0 4.7 4.7 0 0 1 0 6.7Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

/** Section heading + "View more" row. */
function SectionHead({ title, href = "/shop" }: { title: string; href?: string }) {
  return (
    <div className="flex items-end justify-between gap-6">
      <h2 className="font-ui text-[18px] uppercase tracking-[0.02em] text-white sm:text-[24px]">{title}</h2>
      <Link
        href={href}
        className="group inline-flex shrink-0 items-center gap-2.5 font-ui text-[14px] text-white transition-colors hover:text-gold sm:text-[16px]"
      >
        View more
        <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Data
 * ------------------------------------------------------------------ */

const PRODUCT = {
  id: "agni-nail-ring",
  ref: "Nº 014 - SUNGLASSES",
  name: "Agni Nail Ring",
  price: 15420,
  blurb:
    "Sculptural artifacts designed to be lived in. Forget the rules of gender, embrace the weight of identity.",
  gallery: ["/shopv2/main.png", "/shopv2/thumb1.png", "/shopv2/thumb2.png", "/shopv2/thumb3.png", "/shopv2/thumb4.png"],
  finishes: [
    { label: "Silver", color: "#d9d9d9" },
    { label: "Gold", color: "#c0ab79" },
  ],
};

const DETAILS = [
  {
    title: "Easy Returns & Exchange",
    body: "Hassle-free returns within 7 days of delivery, no questions asked.",
  },
  {
    title: "Real-Time Order Tracking",
    body: "Track your piece from our atelier to your door, every step of the way.",
  },
  {
    title: "Cast in 925 Sterling Silver",
    body: "Solid sterling, hand-finished in our Jaipur atelier and made to earn its own patina.",
  },
];

const RAIL = [
  {
    id: "agni-nail-ring",
    name: "Agni Nail Ring",
    price: "Rs. 15,420.00",
    amount: 15420,
    desc: "Rests atop hinged segments that allow free finger movement.",
    image: "/shopv2/rail1.png",
  },
  {
    id: "chameli-sunglasses",
    name: "Chameli Sunglasses",
    price: "Rs. 8,900.00",
    amount: 8900,
    desc: "Known for their glaring effect on people's judgment.",
    image: "/shopv2/rail2.png",
  },
  {
    id: "agni-nail-ring-ii",
    name: "Agni Nail Ring",
    price: "Rs. 15,420.00",
    amount: 15420,
    desc: "Rests atop hinged segments that allow free finger movement.",
    image: "/shopv2/rail3.png",
  },
];

const REVIEWS = [
  {
    quote:
      "Ten the hastened steepest feelings pleasant few surprise property. An brother he do colonel against.",
    name: "Ujwal Chopra",
    role: "CEO, TheWebAgency",
  },
  {
    quote:
      "Warmly marked and led — raising expectations yet demeanour meeting musical. A material that speaks for itself.",
    name: "Madhuri Iyer",
    role: "Manager, TheWebTech",
  },
  {
    quote:
      "Parked next to busy days — elinor secured twenty each object. Any far saw size want, this way you wrong.",
    name: "Somya Yadav",
    role: "Developer, I2C Company",
  },
  {
    quote:
      "Concerns greatest, margaret him absolute entrance nay. Door neat week do find past he — be no surprise he honoured.",
    name: "Mehak Arora",
    role: "Accountant, TheConstruction",
  },
];

/* ------------------------------------------------------------------ *
 * Gallery — vertical thumb rail + main image
 * ------------------------------------------------------------------ */

function Gallery() {
  const [active, setActive] = useState(0);
  const thumbs = PRODUCT.gallery;

  return (
    <div className="flex gap-4 lg:gap-6">
      {/* thumb rail */}
      <div className="flex w-[74px] shrink-0 flex-col items-center gap-3 lg:w-[177px]">
        <button
          type="button"
          aria-label="Previous image"
          onClick={() => setActive((i) => Math.max(0, i - 1))}
          disabled={active === 0}
          className="text-white/70 transition-colors hover:text-gold disabled:opacity-25"
        >
          <Chevron className="h-5 w-5 rotate-180" />
        </button>

        {thumbs.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`View image ${i + 1}`}
            aria-current={active === i}
            onClick={() => setActive(i)}
            className={`w-full overflow-hidden rounded-[3px] border transition-colors duration-300 ${
              active === i ? "border-gold" : "border-transparent hover:border-white/30"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="aspect-[177/167] w-full object-cover" />
          </button>
        ))}

        <button
          type="button"
          aria-label="Next image"
          onClick={() => setActive((i) => Math.min(thumbs.length - 1, i + 1))}
          disabled={active === thumbs.length - 1}
          className="text-white/70 transition-colors hover:text-gold disabled:opacity-25"
        >
          <Chevron className="h-5 w-5" />
        </button>
      </div>

      {/* main image */}
      <div className="relative min-w-0 flex-1 overflow-hidden rounded-[3px] bg-[#0a0a0a]">
        <AnimatePresence mode="wait">
          <motion.img
            key={thumbs[active]}
            src={thumbs[active]}
            alt={PRODUCT.name}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="aspect-[530/838] w-full object-cover"
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Info panel
 * ------------------------------------------------------------------ */

function Info() {
  const [finish, setFinish] = useState(0);
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState<number | null>(0);
  const addLocal = useCartStore((s) => s.addLocal);
  const openCart = useCartStore((s) => s.open);
  const anchor = useRef<HTMLDivElement>(null);

  const add = () => {
    for (let i = 0; i < qty; i++) {
      addLocal(
        { id: PRODUCT.id, name: PRODUCT.name, price: PRODUCT.price, image: PRODUCT.gallery[0] },
        PRODUCT.finishes[finish].label.toLowerCase() === "gold" ? "gold" : "silver",
      );
    }
    if (anchor.current) {
      window.dispatchEvent(
        new CustomEvent("fly-to-cart", {
          detail: { image: PRODUCT.gallery[0], rect: anchor.current.getBoundingClientRect() },
        }),
      );
    }
  };

  return (
    <div ref={anchor}>
      <p className="font-ui text-[12px] text-[#c1b9b9]">{PRODUCT.ref}</p>

      <h1 className="mt-3 font-display text-[40px] leading-[1.08] text-white sm:text-[52px] lg:text-[65px]">
        {PRODUCT.name}
      </h1>

      <p className="mt-4 font-ui text-[20px] font-medium text-[#dfc37f] sm:text-[24px]">
        Rs. {PRODUCT.price.toLocaleString("en-IN")}.00
      </p>

      <p className="mt-4 font-ui text-[13px] text-[#c1b9b9]">
        EMI starts at 449/month or pay later with Zest / Simpl.
      </p>

      <div className="mt-4 flex max-w-[422px] items-center justify-between gap-4 font-ui text-[13px]">
        <span className="text-[#c1b9b9]">Get 10 % off your first order</span>
        <span className="font-bold tracking-[0.04em] text-gold">WELCOME10</span>
      </div>

      <p className="mt-8 max-w-[301px] font-ui text-[13px] leading-[1.55] text-[#c1b9b9]">{PRODUCT.blurb}</p>

      {/* finish */}
      <p className="mt-9 font-ui text-[12px] text-[#c1b9b9]">FINISH</p>
      <div className="mt-3 flex items-center gap-3">
        {PRODUCT.finishes.map((f, i) => (
          <button
            key={f.label}
            type="button"
            aria-label={`${f.label} finish`}
            aria-pressed={finish === i}
            onClick={() => setFinish(i)}
            className={`h-[17px] w-[17px] rounded-full transition-all duration-300 ${
              finish === i ? "ring-2 ring-white ring-offset-2 ring-offset-black" : "opacity-70 hover:opacity-100"
            }`}
            style={{ backgroundColor: f.color }}
          />
        ))}
      </div>

      {/* qty + CTAs */}
      <div className="mt-7 flex flex-wrap items-center gap-3">
        <div className="flex h-[50px] items-center rounded-[10px] border border-white/25">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 text-white/70 transition-colors hover:text-gold">−</button>
          <span className="min-w-[22px] text-center font-ui text-[14px] text-white">{qty}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)} className="px-4 text-white/70 transition-colors hover:text-gold">+</button>
        </div>

        <button
          type="button"
          onClick={() => { add(); openCart(); }}
          className="h-[50px] rounded-[10px] border border-white/45 px-9 font-ui text-[12px] font-medium uppercase tracking-[0.04em] text-white transition-colors duration-300 hover:border-gold hover:text-gold"
        >
          Buy Now
        </button>

        <button
          type="button"
          onClick={add}
          className="h-[50px] rounded-[10px] bg-white px-8 font-ui text-[12px] font-bold uppercase tracking-[0.04em] text-black transition-colors duration-300 hover:bg-gold"
        >
          Add to Cart
        </button>
      </div>

      {/* stock line */}
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-ui text-[13px] text-[#c1b9b9]">
        <span className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-[#c1b9b9]" />In stock</span>
        <span className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-[#c1b9b9]" />Only 3 left</span>
        <span className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-[#c1b9b9]" />Ships in 1-2 days</span>
      </div>

      {/* detail accordions */}
      <dl className="mt-10 max-w-[420px]">
        {DETAILS.map((d, i) => {
          const isOpen = open === i;
          return (
            <div key={d.title} className="border-b border-white/12 py-5">
              <dt>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 text-left font-ui text-[14px] text-white transition-colors hover:text-gold"
                >
                  {d.title}
                  <Chevron className={`h-4 w-4 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>
              </dt>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.dd
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <p className="pt-3 font-ui text-[13px] leading-[1.6] text-[#b8b8b8]">{d.body}</p>
                  </motion.dd>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Product rail
 * ------------------------------------------------------------------ */

function RailCard({ item }: { item: (typeof RAIL)[number] }) {
  const toggle = useWishlistStore((s) => s.toggle);
  const saved = useWishlistStore((s) => s.items.some((w) => w.id === item.id));
  const frame = useRef<HTMLDivElement>(null);

  const save = () => {
    const added = toggle({ id: item.id, name: item.name, price: item.amount, image: item.image });
    if (added && frame.current) {
      window.dispatchEvent(
        new CustomEvent("fly-to-cart", {
          detail: { image: item.image, rect: frame.current.getBoundingClientRect(), target: "wishlist-fly-target" },
        }),
      );
    }
  };

  return (
    <article className="group">
      <div ref={frame} className="relative overflow-hidden rounded-[3px] bg-[#0a0a0a]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt={item.name} className="aspect-[402/382] w-full object-cover" />
        <button
          type="button"
          aria-label={saved ? `Remove ${item.name} from wishlist` : `Save ${item.name} to wishlist`}
          aria-pressed={saved}
          onClick={save}
          className={`absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border transition-colors duration-300 ${
            saved ? "border-gold bg-gold/15 text-gold" : "border-white/40 bg-black/40 text-white hover:border-gold hover:text-gold"
          }`}
        >
          <Heart filled={saved} className="h-[13px] w-[13px]" />
        </button>
      </div>

      <h3 className="mt-6 font-ui text-[18px] font-medium text-white sm:text-[20px]">{item.name}</h3>
      <p className="mt-2 max-w-[420px] font-ui text-[13px] leading-[1.5] text-[#b8b8b8]">{item.desc}</p>
      <p className="mt-3 font-ui text-[14px] font-medium text-gold">{item.price}</p>
    </article>
  );
}

function Rail({ title }: { title: string }) {
  return (
    <section className={`${SHELL} py-16 lg:py-20`}>
      <Reveal>
        <SectionHead title={title} />
      </Reveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {RAIL.map((item, i) => (
          <Reveal key={`${title}-${item.id}`} delay={i * 0.08}>
            <RailCard item={item} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Testimonials
 * ------------------------------------------------------------------ */

function Reviews() {
  return (
    <section className={`${SHELL} py-16 lg:py-20`}>
      <Reveal>
        <SectionHead title="What People Say" />
      </Reveal>

      <div className="mt-10 grid gap-px overflow-hidden rounded-[3px] bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
        {REVIEWS.map((r, i) => (
          <div key={r.name} className="bg-[#0a0a0a] p-8">
            <p className="font-ui text-[10px] tracking-[0.06em] text-[#666]">
              {String(i + 1).padStart(2, "0")} / {String(REVIEWS.length).padStart(2, "0")}
            </p>
            <p className="mt-6 font-ui text-[14px] leading-[1.6] text-[#b8b8b8]">{r.quote}</p>
            <p className="mt-8 font-ui text-[16px] font-medium text-white">{r.name}</p>
            <p className="mt-1 font-ui text-[10px] capitalize text-[#666]">{r.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export default function ShopV2Page() {
  return (
    <>
      <Header />
      <main className="bg-[#020202] font-ui text-white">
        {/* gallery + info */}
        <section className={`${SHELL} pb-16 pt-[128px] lg:pb-20 lg:pt-[150px]`}>
          <div className="grid gap-12 lg:grid-cols-[1fr_0.63fr] lg:gap-16">
            <Gallery />
            <Info />
          </div>
        </section>

        {/* collection quote */}
        <section className="bg-[#191818] px-6 py-20 text-center lg:py-24">
          <Reveal>
            <p className="font-ui text-[14px] tracking-[0.04em] text-[#c1b9b9] sm:text-[16px]">
              FROM THE GILGA COLLECTION
            </p>
            <p className="mx-auto mt-8 max-w-[809px] font-display text-[22px] italic leading-[1.66] tracking-[0.07em] text-white sm:text-[28px] lg:text-[32px]">
              “Named for the oldest story ever carved — half relic, half rebellion. Serpents, thrones, and eyes that
              don&apos;t blink.”
            </p>
          </Reveal>
        </section>

        <Rail title="You May Also Like" />

        {/* see it in action — the shared As Worn cards bring their own
            heading + View More row */}
        <AsWorn eyebrow="See It In Action" intro={false} id="see-it-in-action" tone="gold" />

        <Reviews />

        <Rail title="More From The Collection" />
      </main>
      <Footer />
    </>
  );
}
