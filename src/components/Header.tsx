"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./ui/Logo";
import { SearchIcon, BagIcon, UserIcon, ChevronDown } from "./ui/Icons";

type MenuKind = "mega" | "dropdown";
type NavItem = { label: string; href: string; menu?: MenuKind };

const NAV_ITEMS: NavItem[] = [
  { label: "Jewellery", href: "#jewellery", menu: "mega" },
  { label: "The Archive", href: "#archive", menu: "dropdown" },
  { label: "The BR Community", href: "#community" },
  { label: "Our Atelier", href: "#atelier" },
  { label: "BR Journal", href: "#journal" },
];

const JEWELLERY_MEGA: { title: string; items: string[] }[] = [
  { title: "Everyday Essentials", items: ["Rings", "Earrings", "Chains", "Nose Pins"] },
  { title: "Statement Jewellery", items: ["Palm Cuffs", "Webbed Fingers", "Nail Rings", "Ear Cuffs"] },
  { title: "Occasion Wear", items: ["Neckpieces", "Anklets", "Brooches", "Cufflinks"] },
  { title: "Accessories & Add-ons", items: ["Hair Accessories", "Belts", "Sunglasses", "Waist Wear"] },
];

const ARCHIVE_DROPDOWN = [
  "GilGa",
  "Naraka",
  "Ancient Aliens",
  "Jalebi",
  "Glarekillers",
  "Darlings",
  "HARMONY",
  "POISON",
  "Bhavya x Rosh - Nail Rings",
];

const slug = (s: string) => "#" + s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/* ---- Mobile drawer data (Figma mobile menu) ---- */
const SHOP_COLS: string[][] = [
  ["Shop All", "Sunglasses", "Nail Rings", "Ear Rings", "Rings", "Wrist Wear", "Neck Pieces", "Palm Cuffs"],
  ["Ear Clips", "Chains", "Hair Accessories", "Webbed Fingers", "Anklets", "Nose Pins"],
];
const COLLECTIONS_M = ["Gilga", "Naraka", "Ancient Aliens", "Jalebi", "Glarekillers", "Darlings", "HARMONY", "POISON", "Bhavya x Rosh - Nail Rings"];
const MOBILE_LINKS = [
  { label: "About", href: "#about" },
  { label: "Terms & Conditions", href: "#terms" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Retail Store", href: "#retail" },
  { label: "Wishlist", href: "#wishlist" },
];
const MOBILE_SECONDARY = [
  { label: "Jewellery Care And Material", href: "#care" },
  { label: "Shipping Policy", href: "#shipping" },
  { label: "Returns & Exchange Policy", href: "#returns" },
  { label: "Contact Us", href: "#contact" },
  { label: "Stocklist", href: "#stocklist" },
  { label: "Blogs", href: "#blogs" },
];

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ArrowDownRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M7 7 17 17M17 8v9H8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ArrowLeft({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [view, setView] = useState<"main" | "shop" | "collections">("main");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll + reset to the top view whenever the drawer opens.
  useEffect(() => {
    if (!menuOpen) return;
    setView("main");
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const panelOpen = openMenu === "Jewellery" || openMenu === "The Archive";

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onMouseLeave={() => setOpenMenu(null)}
      className={`fixed inset-x-0 top-9 z-50 transition-colors duration-300 ${
        scrolled || panelOpen
          ? "border-b border-white/10 bg-black/40 backdrop-blur-xl backdrop-saturate-150"
          : "bg-transparent"
      }`}
    >
      <nav className="flex h-16 w-full items-center justify-between gap-4 px-6 sm:h-20 sm:px-16">
        {/* Left: primary navigation (desktop) */}
        <ul className="hidden items-center gap-7 text-[13px] tracking-wide text-white/90 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.label} onMouseEnter={() => setOpenMenu(item.menu ? item.label : null)}>
              <Link
                href={item.href}
                className={`flex items-center gap-1 transition-colors hover:text-brand ${
                  openMenu === item.label ? "text-brand" : ""
                }`}
              >
                {item.label}
                {item.menu && (
                  <ChevronDown
                    className={`h-3.5 w-3.5 opacity-70 transition-transform ${
                      openMenu === item.label ? "rotate-180" : ""
                    }`}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile: hamburger */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex flex-col gap-1.5 lg:hidden"
        >
          <span className={`h-px w-6 bg-white transition-transform ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-white transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`h-px w-6 bg-white transition-transform ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>

        {/* Center: logo */}
        <Link href="/" aria-label="Bhavya Ramesh — home" className="absolute left-1/2 -translate-x-1/2 text-white">
          <Logo className="h-10 w-auto sm:h-14" />
        </Link>

        {/* Right: utility icons */}
        <div className="flex items-center gap-5 text-white sm:gap-6">
          <button type="button" aria-label="Search" className="transition-colors hover:text-brand">
            <SearchIcon className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Cart" className="transition-colors hover:text-brand">
            <BagIcon className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Account" className="hidden transition-colors hover:text-brand sm:block">
            <UserIcon className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Desktop flyout panels */}
      <AnimatePresence>
        {openMenu === "Jewellery" && (
          <motion.div
            key="mega"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="hidden border-t border-white/10 lg:block"
          >
            <div className="flex w-full flex-wrap gap-x-16 gap-y-8 px-6 py-10 sm:px-16">
              {JEWELLERY_MEGA.map((col) => (
                <div key={col.title}>
                  <h3 className="text-[15px] font-semibold text-white">{col.title}</h3>
                  <ul className="mt-5 space-y-3.5 text-[14px] text-white/70">
                    {col.items.map((it) => (
                      <li key={it}>
                        <Link href={slug(it)} className="transition-colors hover:text-brand" onClick={() => setOpenMenu(null)}>
                          {it}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {openMenu === "The Archive" && (
          <motion.div
            key="archive"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="hidden border-t border-white/10 lg:block"
          >
            <div className="w-full px-6 py-8 sm:px-16">
              <ul className="flex w-[260px] flex-col items-center gap-4 text-[14px] text-white/85">
                {ARCHIVE_DROPDOWN.map((it) => (
                  <li key={it}>
                    <Link href={slug(it)} className="transition-colors hover:text-brand" onClick={() => setOpenMenu(null)}>
                      {it}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile full-screen nav drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 top-9 z-[60] flex flex-col bg-[#0c0b0d]/95 backdrop-blur-2xl lg:hidden"
          >
            {/* Soft jewellery glow texture behind the menu */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(55% 35% at 72% 16%, rgba(255,255,255,0.06) 0%, transparent 60%), radial-gradient(45% 28% at 18% 55%, rgba(255,255,255,0.05) 0%, transparent 60%), radial-gradient(40% 30% at 80% 78%, rgba(255,255,255,0.04) 0%, transparent 60%)",
              }}
            />

            {/* Top bar */}
            <div className="relative flex h-16 shrink-0 items-center justify-between px-6">
              <Link href="/" onClick={closeMenu} aria-label="Bhavya Ramesh — home" className="text-white">
                <Logo className="h-10 w-auto" />
              </Link>
              <div className="flex items-center gap-5 text-white">
                <button type="button" aria-label="Account" className="transition-colors hover:text-brand">
                  <UserIcon className="h-5 w-5" />
                </button>
                <button type="button" aria-label="Search" className="transition-colors hover:text-brand">
                  <SearchIcon className="h-5 w-5" />
                </button>
                <button type="button" aria-label="Cart" className="transition-colors hover:text-brand">
                  <BagIcon className="h-5 w-5" />
                </button>
              </div>
              <button type="button" aria-label="Close menu" onClick={closeMenu} className="text-white transition-colors hover:text-brand">
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Views */}
            <div className="relative flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {view === "main" && (
                  <motion.div
                    key="v-main"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex min-h-full flex-col px-6 pb-10 pt-6"
                  >
                    <ul className="space-y-7">
                      <li>
                        <button type="button" onClick={() => setView("shop")} className="flex items-center gap-2.5 text-[26px] tracking-wide text-white">
                          SHOP <ArrowUpRight className="h-6 w-6 text-brand" />
                        </button>
                      </li>
                      <li>
                        <button type="button" onClick={() => setView("collections")} className="flex items-center gap-2.5 text-[26px] tracking-wide text-white">
                          ALL COLLECTIONS <ArrowUpRight className="h-6 w-6 text-brand" />
                        </button>
                      </li>
                      {MOBILE_LINKS.map((l) => (
                        <li key={l.label}>
                          <Link href={l.href} onClick={closeMenu} className="flex items-center gap-2.5 text-[26px] uppercase tracking-wide text-white transition-colors hover:text-brand">
                            {l.label} <ArrowUpRight className="h-6 w-6 text-brand" />
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <ul className="mt-12 space-y-4 text-[15px] text-white/80">
                      {MOBILE_SECONDARY.map((l) => (
                        <li key={l.label}>
                          <Link href={l.href} onClick={closeMenu} className="transition-colors hover:text-brand">
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <p className="mt-auto pt-10 text-right text-[13px] text-white/70">
                      Copyright © 2026,{" "}
                      <Link href="/" onClick={closeMenu} className="underline underline-offset-2">
                        Bhavya Ramesh
                      </Link>
                      .
                    </p>
                  </motion.div>
                )}

                {view === "shop" && (
                  <motion.div
                    key="v-shop"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="flex min-h-full flex-col px-6 pb-10 pt-6"
                  >
                    <button type="button" onClick={() => setView("main")} className="flex items-center gap-2.5 text-[26px] tracking-wide text-white">
                      SHOP <ArrowDownRight className="h-6 w-6 text-brand" />
                    </button>
                    <div className="mt-8 grid grid-cols-2 gap-x-8">
                      {SHOP_COLS.map((col, ci) => (
                        <ul key={ci}>
                          {col.map((it) => (
                            <li key={it} className="border-b border-white/15">
                              <Link href={slug(it)} onClick={closeMenu} className="block py-3 text-[18px] text-white transition-colors hover:text-brand">
                                {it}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ))}
                    </div>
                    <div className="mt-auto flex items-end justify-between pt-10">
                      <p className="text-[13px] text-white/70">
                        Copyright © 2026, <span className="underline underline-offset-2">Bhavya Ramesh</span>.
                      </p>
                      <button type="button" aria-label="Back" onClick={() => setView("main")} className="text-white/70 transition-colors hover:text-white">
                        <ArrowLeft className="h-6 w-6" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {view === "collections" && (
                  <motion.div
                    key="v-collections"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="flex min-h-full flex-col px-6 pb-10 pt-6"
                  >
                    <button type="button" onClick={() => setView("main")} className="flex items-center gap-2.5 text-[26px] tracking-wide text-white">
                      ALL COLLECTIONS <ArrowDownRight className="h-6 w-6 text-brand" />
                    </button>
                    <ul className="mt-8 w-[78%]">
                      {COLLECTIONS_M.map((it) => (
                        <li key={it} className="border-b border-white/15">
                          <Link href={slug(it)} onClick={closeMenu} className="block py-3 text-[18px] text-white transition-colors hover:text-brand">
                            {it}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex items-end justify-between pt-10">
                      <p className="text-[13px] text-white/70">
                        Copyright © 2026, <span className="underline underline-offset-2">Bhavya Ramesh</span>.
                      </p>
                      <button type="button" aria-label="Back" onClick={() => setView("main")} className="text-white/70 transition-colors hover:text-white">
                        <ArrowLeft className="h-6 w-6" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
