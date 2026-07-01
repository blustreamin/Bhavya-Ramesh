"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { UserIcon } from "./ui/Icons";
import { useAccountStore } from "@/store/account";

/**
 * Header account control. On desktop, hovering opens a small popup below the
 * icon with a mini summary + a link to the full /account page (no drawer).
 */
export function AccountMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const user = useAccountStore((s) => s.user);
  const orders = useAccountStore((s) => s.orders);
  const logout = useAccountStore((s) => s.logout);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setMounted(true), []);

  const show = () => { if (timer.current) clearTimeout(timer.current); setOpen(true); };
  const hide = () => { timer.current = setTimeout(() => setOpen(false), 160); };

  const loggedIn = mounted && user;

  return (
    <div className="relative hidden sm:block" onMouseEnter={show} onMouseLeave={hide}>
      <Link href="/account" aria-label="Account" className={`block transition-colors hover:text-brand ${open ? "text-brand" : ""}`}>
        <UserIcon className="h-5 w-5" />
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-full z-50 w-[268px] origin-top-right overflow-hidden rounded-2xl border border-white/12 bg-[#0c0b0f]/95 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl"
          >
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/70 to-transparent" />
            <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(70% 50% at 80% 0%, rgba(228,99,140,0.12), transparent 60%)" }} />

            {loggedIn ? (
              <div className="relative p-5">
                <p className="font-serif text-[22px] leading-none text-white">Hi, {user.name.split(" ")[0]}.</p>
                <p className="mt-1.5 truncate text-[12px] text-white/45">{user.email}</p>

                <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-lg border border-white/8 bg-white/[0.04] py-2.5">
                    <p className="font-serif text-[19px] text-white">{orders.length}</p>
                    <p className="text-[10px] uppercase tracking-wider text-white/45">Orders</p>
                  </div>
                  <div className="rounded-lg border border-white/8 bg-white/[0.04] py-2.5">
                    <p className="font-serif text-[19px] text-white">3</p>
                    <p className="text-[10px] uppercase tracking-wider text-white/45">Wishlist</p>
                  </div>
                </div>

                <Link href="/account" className="mt-4 block rounded-full bg-gradient-to-r from-brand to-brand-soft py-2.5 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-shadow hover:shadow-[0_0_24px_-6px_rgba(228,99,140,0.6)]">
                  My Account
                </Link>
                <div className="mt-3 flex items-center justify-center gap-3 text-[11px] uppercase tracking-widest text-white/45">
                  <Link href="/account?tab=orders" className="transition-colors hover:text-brand">Orders</Link>
                  <span className="text-white/15">·</span>
                  <button type="button" onClick={logout} className="transition-colors hover:text-brand">Log Out</button>
                </div>
              </div>
            ) : (
              <div className="relative p-5">
                <p className="font-serif text-[22px] leading-none text-white">Welcome</p>
                <p className="mt-2 text-[12px] leading-relaxed text-white/50">Sign in to track orders, save addresses and curate your wishlist.</p>
                <Link href="/account" className="mt-4 block rounded-full bg-gradient-to-r from-brand to-brand-soft py-2.5 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-shadow hover:shadow-[0_0_24px_-6px_rgba(228,99,140,0.6)]">
                  Sign In
                </Link>
                <Link href="/account" className="mt-3 block text-center text-[11px] uppercase tracking-widest text-white/45 transition-colors hover:text-brand">
                  Create Account
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
