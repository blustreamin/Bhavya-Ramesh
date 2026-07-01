"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "../ui/Icons";

const REVIEWS = [
  {
    name: "Ujwal Chopra",
    title: "CEO",
    company: "TheWebagency",
    avatar: "/figma/67c28554bb035bb434d67d022a26e5401d67f847.png",
    quote: "Genuinely my favourite purchase this year. The craft is unreal and it turns heads every single time.",
  },
  {
    name: "Madhuri Iyer",
    title: "Manager",
    company: "TheWekrtech",
    avatar: "/figma/9b227545e2a9637a4f88dad021a60a3613e290f8.png",
    quote: "Feels heirloom-worthy. Beautifully made, ships fast, and looks even better in person.",
  },
  {
    name: "Somya Yadav",
    title: "Developer",
    company: "I2c Company",
    avatar: "/figma/3a16c9835bee6dfe6169e1bb8ec0509a3fc6b6ee.png",
    quote: "Bold, sculptural and unlike anything else. I get compliments every time I wear it out.",
  },
  {
    name: "Mehak Arora",
    title: "Accountant",
    company: "TheConsturction",
    avatar: "/figma/d4affb9ba67d82589175eba4ecee2ecbe554baa3.png",
    quote: "Obsessed. The finish is flawless and it pairs with absolutely everything in my wardrobe.",
  },
];

function Stars() {
  return (
    <div className="flex justify-center gap-1.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-4 w-4 text-[#e8b44a]" fill="currentColor" aria-hidden>
          <path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.98 6.1 20.67l1.13-6.57L2.45 9.44l6.6-.96z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ r }: { r: (typeof REVIEWS)[number] }) {
  return (
    <figure className="overflow-hidden rounded-2xl bg-[#161616] shadow-lg">
      <div className="flex items-center gap-3.5 bg-[#f3f1ec] p-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-200">
          <Image src={r.avatar} alt={r.name} fill sizes="56px" className="object-cover object-[center_22%]" />
        </div>
        <figcaption className="min-w-0">
          <p className="truncate text-[16px] font-bold text-[#1a1a1a]">{r.name}</p>
          <p className="text-[13px] leading-tight text-neutral-500">{r.title}</p>
          <p className="text-[13px] leading-tight text-neutral-500">{r.company}</p>
        </figcaption>
      </div>
      <div className="px-5 py-6 text-center">
        <Stars />
        <blockquote className="mt-4 text-[13px] leading-relaxed text-white/75">{r.quote}</blockquote>
      </div>
    </figure>
  );
}

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const goTo = (n: number) => {
    const el = trackRef.current;
    if (!el) return;
    const idx = Math.max(0, Math.min(REVIEWS.length - 1, n));
    const c = el.children[idx] as HTMLElement;
    el.scrollTo({ left: el.scrollLeft + (c.getBoundingClientRect().left - el.getBoundingClientRect().left), behavior: "smooth" });
  };
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const base = el.getBoundingClientRect().left;
    let best = 0, bd = Infinity;
    Array.from(el.children).forEach((c, i) => {
      const d = Math.abs((c as HTMLElement).getBoundingClientRect().left - base);
      if (d < bd) { bd = d; best = i; }
    });
    setActive(best);
  };

  return (
    <section className="px-5 py-16 sm:px-12">
      <div className="mx-auto max-w-[1360px]">
        <h2 className="text-[15px] uppercase tracking-[0.2em] text-white/90">What People Say</h2>

        {/* Tablet / desktop grid */}
        <div className="mt-8 hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((r) => (
            <ReviewCard key={r.name} r={r} />
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="mt-8 sm:hidden">
          <div ref={trackRef} onScroll={onScroll} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto">
            {REVIEWS.map((r) => (
              <div key={r.name} className="w-[85%] shrink-0 snap-start">
                <ReviewCard r={r} />
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-4">
            <button type="button" aria-label="Previous" onClick={() => goTo(active - 1)} className="text-brand transition-opacity hover:opacity-70">
              <ChevronDown className="h-5 w-5 rotate-90" />
            </button>
            <div className="flex items-center gap-1.5">
              {REVIEWS.map((r, i) => (
                <button key={r.name} type="button" aria-label={`Go to ${i + 1}`} onClick={() => goTo(i)} className={`h-1.5 rounded-full transition-all ${i === active ? "w-4 bg-brand" : "w-1.5 bg-white/30"}`} />
              ))}
            </div>
            <button type="button" aria-label="Next" onClick={() => goTo(active + 1)} className="text-brand transition-opacity hover:opacity-70">
              <ChevronDown className="h-5 w-5 -rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
