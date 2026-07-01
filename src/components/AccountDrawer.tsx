"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useAccountStore } from "@/store/account";

function CloseX({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" aria-label="Close" onClick={onClick} className="text-white/80 transition-colors hover:text-brand">
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
        <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </button>
  );
}

const inputCls =
  "h-12 w-full rounded-md border border-white/25 bg-transparent px-4 text-sm text-white placeholder:text-white/45 focus:border-brand focus:outline-none";

export function AccountDrawer() {
  const isOpen = useAccountStore((s) => s.isOpen);
  const close = useAccountStore((s) => s.close);
  const user = useAccountStore((s) => s.user);
  const login = useAccountStore((s) => s.login);
  const register = useAccountStore((s) => s.register);
  const logout = useAccountStore((s) => s.logout);

  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (mode === "signin") login(form.email, form.password);
    else register(form.name, form.email, form.password);
    setForm({ name: "", email: "", password: "" });
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="acc-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
            aria-hidden
          />
          <motion.aside
            key="acc-panel"
            role="dialog"
            aria-label="Account"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-y-0 right-0 z-[71] flex h-full w-full max-w-[420px] flex-col bg-[#0c0b0d] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <h2 className="text-[15px] uppercase tracking-[0.2em] text-white">
                {user ? "My Account" : mode === "signin" ? "Sign In" : "Create Account"}
              </h2>
              <CloseX onClick={close} />
            </div>

            {user ? (
              /* ---- Logged in ---- */
              <div className="flex flex-1 flex-col px-6 py-6">
                <p className="font-serif text-[28px] leading-tight text-white">Hi, {user.name}.</p>
                <p className="mt-1 text-sm text-white/55">{user.email}</p>

                <nav className="mt-8 flex flex-col divide-y divide-white/10 border-y border-white/10">
                  {[
                    { label: "Overview", href: "/account?tab=overview" },
                    { label: "My Orders", href: "/account?tab=orders" },
                    { label: "Addresses", href: "/account?tab=addresses" },
                    { label: "Wishlist", href: "/account?tab=wishlist" },
                    { label: "Profile Settings", href: "/account?tab=profile" },
                  ].map((l) => (
                    <Link key={l.label} href={l.href} onClick={close} className="flex items-center justify-between py-4 text-[15px] text-white transition-colors hover:text-brand">
                      {l.label}
                      <span aria-hidden>→</span>
                    </Link>
                  ))}
                </nav>

                <button
                  type="button"
                  onClick={logout}
                  className="mt-auto w-full rounded-md border border-white/25 py-3.5 text-[12px] font-bold uppercase tracking-widest text-white transition-colors hover:border-brand hover:text-brand"
                >
                  Log Out
                </button>
              </div>
            ) : (
              /* ---- Signed out ---- */
              <div className="flex flex-1 flex-col px-6 py-6">
                <form onSubmit={submit} className="space-y-3">
                  {mode === "register" && (
                    <input required value={form.name} onChange={set("name")} placeholder="Full name" className={inputCls} />
                  )}
                  <input required type="email" value={form.email} onChange={set("email")} placeholder="Email" className={inputCls} />
                  <input required type="password" value={form.password} onChange={set("password")} placeholder="Password" className={inputCls} />

                  {mode === "signin" && (
                    <div className="text-right">
                      <button type="button" className="text-[12px] text-white/50 underline underline-offset-2 hover:text-brand">
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button type="submit" className="!mt-5 w-full rounded-md bg-brand-soft py-3.5 text-[12px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-brand">
                    {mode === "signin" ? "Sign In" : "Create Account"}
                  </button>
                </form>

                <div className="mt-6 text-center text-sm text-white/60">
                  {mode === "signin" ? (
                    <>
                      New to Bhavya Ramesh?{" "}
                      <button type="button" onClick={() => setMode("register")} className="text-brand underline underline-offset-2">
                        Create an account
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button type="button" onClick={() => setMode("signin")} className="text-brand underline underline-offset-2">
                        Sign in
                      </button>
                    </>
                  )}
                </div>

                <Link href="/account" onClick={close} className="mt-auto text-center text-[12px] uppercase tracking-widest text-white/50 transition-colors hover:text-brand">
                  Open full account page →
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
