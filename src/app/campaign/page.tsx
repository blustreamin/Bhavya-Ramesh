"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/* ---------- icons ---------- */
function PlayCircle({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 8.5v7l6-3.5-6-3.5Z" fill="currentColor" />
    </svg>
  );
}
function ArrowRight({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- scroll-reveal ---------- */
function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------- focus carousel ---------- */
const GALLERY = ["g1", "g2", "g3", "g4", "g5", "g6", "g7"].map((n) => `/campaign/${n}.png`);

function ArrowBtn({ dir, onClick, disabled }: { dir: "prev" | "next"; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      aria-label={dir === "prev" ? "Previous" : "Next"}
      onClick={onClick}
      disabled={disabled}
      className={`absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur-sm transition-all duration-300 hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-0 ${
        dir === "prev" ? "left-4 sm:left-8" : "right-4 sm:right-8"
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path d={dir === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/** Horizontal image strip scrolled by the navigation arrows. All sharp. */
function FocusCarousel() {
  const scroller = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = () => {
    const el = scroller.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  };
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const by = (dir: number) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(640, el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div ref={scroller} onScroll={update} className="no-scrollbar flex gap-3 overflow-x-auto sm:gap-4">
        {GALLERY.map((src) => (
          <div key={src} className="relative shrink-0 overflow-hidden rounded-[3px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt="Bhavya Ramesh campaign"
              draggable={false}
              className="h-[200px] w-auto max-w-none object-cover sm:h-[270px] lg:h-[300px]"
            />
          </div>
        ))}
      </div>

      <ArrowBtn dir="prev" onClick={() => by(-1)} disabled={atStart} />
      <ArrowBtn dir="next" onClick={() => by(1)} disabled={atEnd} />
    </div>
  );
}

/* Seamless auto-scrolling image band. */
function Marquee({ src, imgClass, reverse = false, duration = 42 }: { src: string; imgClass: string; reverse?: boolean; duration?: number }) {
  return (
    <div className="relative w-full overflow-hidden">
      <motion.div
        className="flex w-max"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="Bhavya Ramesh campaign" className={`block w-auto max-w-none ${imgClass}`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" aria-hidden className={`block w-auto max-w-none ${imgClass}`} />
      </motion.div>
    </div>
  );
}

/* ---------- scroll-driven film slider ---------- */
const STATEMENTS = [
  { number: "01", title: "Not for everybody. For the ones who get it." },
  { number: "02", title: "The body remembers." },
  { number: "03", title: "A place beyond. A state within." },
  { number: "04", title: "An ornament for the in-between." },
];

function FilmSlider({ video, autoPlay = false, poster }: { video: string; autoPlay?: boolean; poster?: string }) {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const count = STATEMENTS.length;
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(count - 1, Math.max(0, Math.floor(v * count))));
  });

  // Autoplay with sound: try unmuted first; if the browser blocks it, fall
  // back to a muted autoplay and unmute on the visitor's first interaction.
  useEffect(() => {
    if (!autoPlay) return;
    const v = videoRef.current;
    if (!v) return;
    v.volume = 1;
    v.muted = false;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });

    const unmute = () => {
      v.muted = false;
      v.play().catch(() => {});
      remove();
    };
    const events = ["pointerdown", "keydown", "touchstart", "wheel"];
    const remove = () => events.forEach((e) => window.removeEventListener(e, unmute));
    events.forEach((e) => window.addEventListener(e, unmute, { passive: true }));
    return remove;
  }, [autoPlay]);

  // Jump to a statement when its dot is clicked.
  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const scrollable = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.offsetTop + scrollable * ((i + 0.5) / count), behavior: "smooth" });
  };

  const current = STATEMENTS[active];

  return (
    <section ref={ref} className="relative" style={{ height: `${count * 72 + 20}vh` }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden px-6 sm:px-16">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          {/* left — vertical rail (number → line → centered dots → line) + statement */}
          <div className="order-2 flex gap-7 sm:gap-9 lg:order-1">
            <div className="flex flex-col items-center self-stretch">
              <AnimatePresence mode="wait">
                <motion.span
                  key={current.number}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.3 }}
                  className="font-serif text-[24px] text-brand"
                >
                  {current.number}
                </motion.span>
              </AnimatePresence>
              <span className="mt-4 w-px flex-1 bg-white/15" />
              <div className="flex flex-col items-center gap-3 py-5">
                {STATEMENTS.map((s, i) => (
                  <button
                    key={s.number}
                    type="button"
                    aria-label={`Show statement ${s.number}`}
                    aria-current={active === i}
                    onClick={() => goTo(i)}
                    className="group flex h-4 w-4 items-center justify-center"
                  >
                    <span
                      className={`rounded-full transition-all duration-300 ${
                        active === i ? "h-2.5 w-2.5 bg-brand" : "h-1.5 w-1.5 bg-white/25 group-hover:bg-white/50"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="mb-1 w-px flex-1 bg-white/15" />
            </div>

            <div className="relative h-[240px] flex-1 overflow-hidden sm:h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.number}
                  initial={{ opacity: 0, y: 56 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -56 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex flex-col justify-center"
                >
                  <h2 className="max-w-[520px] font-serif text-[30px] uppercase leading-[1.08] text-white sm:text-[48px]">
                    {current.title}
                  </h2>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* right — CAMPAIGN FILM label, autoplay video (with sound), WATCH FULL FILM */}
          <div className="order-1 lg:order-2">
            <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-brand">Campaign Film</p>
            <div className="relative overflow-hidden rounded-[4px]">
              <video
                ref={videoRef}
                src={video}
                poster={poster}
                autoPlay={autoPlay}
                loop={autoPlay}
                playsInline
                controls
                preload={autoPlay ? "auto" : "metadata"}
                className="aspect-video w-full bg-black object-cover"
              />
            </div>
            <Link
              href="#"
              className="group/cta mt-5 inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.3em] text-white/85 transition-colors hover:text-brand"
            >
              Watch full film
              <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CampaignPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <>
      <Header />

      <main className="bg-black text-white">
        {/* ================= HERO ================= */}
        <div ref={heroRef} className="relative min-h-[100svh] overflow-hidden">
          {/* portrait — full-bleed on the right, blends into the black page */}
          <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-y-0 right-0 w-full sm:w-[64%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/campaign/hero.png" alt="Paraoka campaign" className="h-full w-full object-cover object-[62%_center]" />
            {/* soft wash so the wordmark reads where it overlaps the figure */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, #000 0%, rgba(0,0,0,0.4) 26%, rgba(0,0,0,0) 54%)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, #000 1%, rgba(0,0,0,0) 26%)" }} />
          </motion.div>

          {/* copy — full width, left edge aligned with the nav */}
          <motion.div style={{ y: textY }} className="relative flex min-h-[100svh] flex-col justify-center px-6 pt-28 pb-24 sm:px-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-[12px] uppercase tracking-[0.45em] text-brand"
            >
              New Campaign
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 font-serif text-[21vw] leading-[0.8] tracking-[-0.02em] text-white sm:text-[17vw] lg:text-[200px]"
            >
              PARAOKA
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="mt-8 max-w-[440px] text-[12px] uppercase leading-relaxed tracking-[0.25em] text-white/70"
            >
              A place beyond. A state within.<br />An ornament for the in&nbsp;-&nbsp;between.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-10"
            >
              <Link href="#" className="group inline-flex items-center gap-4 text-[12px] uppercase tracking-[0.3em] text-white/90 transition-colors hover:text-brand">
                Watch Film
                <span className="h-px w-9 bg-brand transition-all duration-300 group-hover:w-14" />
                <PlayCircle className="h-6 w-6 text-brand" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <div className="h-px w-full bg-white/10" />

        {/* ============ FILM — scroll slider + autoplay video ============ */}
        <FilmSlider video="/campaign/grills.mp4" autoPlay />

        <div className="h-px w-full bg-white/10" />

        {/* ================= GALLERY FOCUS CAROUSEL ================= */}
        <section className="py-8 sm:py-12">
          <FocusCarousel />
        </section>

        <div className="h-px w-full bg-white/10" />

        {/* ============ FILM — scroll slider + click-to-play video ============ */}
        <FilmSlider video="/campaign/bodyremembers.mp4" poster="/campaign/film02.png" />

        <div className="h-px w-full bg-white/10" />

        {/* ================= THE COMMUNITY ================= */}
        <section className="relative mx-auto max-w-[1440px] px-6 py-16 sm:px-16 sm:py-24">
          {/* rotated side label */}
          <span className="pointer-events-none absolute left-2 top-1/2 hidden -translate-y-1/2 -rotate-90 text-[11px] uppercase tracking-[0.5em] text-white/40 lg:block">
            The Community
          </span>

          <div className="lg:pl-16">
            <Reveal>
              <h2 className="font-serif text-[34px] leading-tight text-white sm:text-[46px]">Wear Your World</h2>
              <p className="mt-3 text-[13px] uppercase tracking-[0.25em] text-white/60">
                Tag <span className="text-brand">@bhavyaramesh</span> and join the tribe.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-10 lg:pl-16">
            <div className="overflow-hidden rounded-[4px]">
              <Marquee src="/campaign/community.png" imgClass="h-[140px] sm:h-[190px] lg:h-[210px]" reverse duration={40} />
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
