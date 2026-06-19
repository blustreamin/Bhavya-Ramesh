"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./ui/Logo";
import {
  SearchIcon,
  BagIcon,
  UserIcon,
  ChevronDown,
} from "./ui/Icons";

type NavItem = { label: string; href: string; hasDropdown?: boolean };

const NAV_ITEMS: NavItem[] = [
  { label: "Jewellery", href: "#jewellery", hasDropdown: true },
  { label: "The Archive", href: "#archive", hasDropdown: true },
  { label: "The BR Community", href: "#community" },
  { label: "Our Atelier", href: "#atelier" },
  { label: "BR Journal", href: "#journal" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Add a subtle backdrop once the user scrolls past the hero fold.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-black/70 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5 sm:h-20 sm:px-8">
        {/* Left: primary navigation (desktop) */}
        <ul className="hidden items-center gap-7 text-[13px] tracking-wide text-white/90 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex items-center gap-1 transition-colors hover:text-brand"
              >
                {item.label}
                {item.hasDropdown && (
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
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
          <span
            className={`h-px w-6 bg-white transition-transform ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-6 bg-white transition-opacity ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`h-px w-6 bg-white transition-transform ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>

        {/* Center: logo */}
        <Link
          href="/"
          aria-label="Bhavya Ramesh — home"
          className="absolute left-1/2 -translate-x-1/2 text-white"
        >
          <Logo className="h-9 w-auto sm:h-11" />
        </Link>

        {/* Right: utility icons */}
        <div className="flex items-center gap-5 text-white sm:gap-6">
          <button type="button" aria-label="Search" className="transition-colors hover:text-brand">
            <SearchIcon className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Cart" className="transition-colors hover:text-brand">
            <BagIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Account"
            className="hidden transition-colors hover:text-brand sm:block"
          >
            <UserIcon className="h-5 w-5" />
          </button>
        </div>
      </nav>

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
                  {item.hasDropdown && <ChevronDown className="h-4 w-4 opacity-70" />}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
