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

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const panelOpen = openMenu === "Jewellery" || openMenu === "The Archive";

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onMouseLeave={() => setOpenMenu(null)}
      className={`fixed inset-x-0 top-9 z-50 transition-colors duration-300 ${
        scrolled || panelOpen ? "bg-black/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="flex h-16 w-full items-center justify-between gap-4 px-6 sm:h-20 sm:px-10">
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
            <div className="flex w-full flex-wrap gap-x-16 gap-y-8 px-6 py-10 sm:px-10">
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
            <div className="w-full px-6 py-8 sm:px-10">
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

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/10 bg-black/90 px-5 backdrop-blur-md lg:hidden"
          >
            {NAV_ITEMS.map((item) => (
              <li key={item.label} className="border-b border-white/5 last:border-0">
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between py-4 text-sm text-white/90"
                >
                  {item.label}
                  {item.menu && <ChevronDown className="h-4 w-4 opacity-70" />}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
