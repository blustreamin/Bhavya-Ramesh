"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAccountStore, type Address, type Order } from "@/store/account";
import { useCartStore } from "@/store/cart";
import { newArrivals, formatPrice, type Product } from "@/lib/products";

const TABS = ["overview", "orders", "addresses", "wishlist", "profile"] as const;
type Tab = (typeof TABS)[number];

function Icon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
const P = {
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  bag: "M6 8h12l-1 12H7L6 8ZM9 8V6a3 3 0 0 1 6 0v2",
  pin: "M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  heart: "M12 20s-7-4.5-9.2-9C1.3 7.7 3 4.5 6.2 4.5c1.9 0 3.2 1.2 3.8 2.3.6-1.1 1.9-2.3 3.8-2.3 3.2 0 4.9 3.2 3.4 6.5C19 15.5 12 20 12 20Z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 21a7 7 0 0 1 14 0",
  out: "M15 12H4m0 0 4-4m-4 4 4 4M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3",
  arrow: "M5 12h14M13 6l6 6-6 6",
};
const TAB_META: Record<Tab, { label: string; icon: string }> = {
  overview: { label: "Overview", icon: P.grid },
  orders: { label: "My Orders", icon: P.bag },
  addresses: { label: "Addresses", icon: P.pin },
  wishlist: { label: "Wishlist", icon: P.heart },
  profile: { label: "Profile", icon: P.user },
};
const STATUS: Record<Order["status"], string> = {
  Delivered: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
  Shipped: "bg-sky-500/15 text-sky-300 ring-sky-400/30",
  Processing: "bg-amber-500/15 text-amber-300 ring-amber-400/30",
  Cancelled: "bg-red-500/15 text-red-300 ring-red-400/30",
};

export default function AccountPage() {
  const user = useAccountStore((s) => s.user);
  const openDrawer = useAccountStore((s) => s.open);
  const logout = useAccountStore((s) => s.logout);
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    setMounted(true);
    const t = new URLSearchParams(window.location.search).get("tab");
    if (t && (TABS as readonly string[]).includes(t)) setTab(t as Tab);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-black" />;

  return (
    <>
      <Header />
      <main className="relative min-h-screen overflow-hidden bg-black px-5 pb-28 pt-[120px] sm:px-8">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 40% at 82% 6%, rgba(120,122,145,0.16) 0%, transparent 58%), radial-gradient(55% 45% at 5% 90%, rgba(228,99,140,0.12) 0%, transparent 62%)" }} />

        <div className="relative mx-auto max-w-[1200px]">
          {!user ? (
            <div className="mx-auto flex max-w-md flex-col items-center py-24 text-center">
              <p className="text-[12px] uppercase tracking-[0.4em] text-brand">Account</p>
              <h1 className="mt-4 font-serif text-[46px] leading-tight text-white sm:text-[58px]">Welcome to the House.</h1>
              <p className="mt-4 text-sm text-white/55">Sign in to track orders, save addresses and curate your wishlist.</p>
              <button type="button" onClick={openDrawer} className="group mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-soft px-8 py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:shadow-[0_0_30px_-6px_rgba(228,99,140,0.6)]">
                Sign In / Create Account <Icon d={P.arrow} className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ) : (
            <>
              {/* Hero banner */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-3xl border border-white/10 p-8 sm:p-10" style={{ background: "linear-gradient(120deg, rgba(228,99,140,0.14), rgba(120,122,145,0.10) 45%, rgba(10,10,12,0) 80%)" }}>
                <p className="text-[12px] uppercase tracking-[0.35em] text-brand">Welcome back</p>
                <h1 className="mt-3 font-serif text-[44px] leading-[0.95] text-white sm:text-[60px]">{user.name}.</h1>
                <p className="mt-3 text-[13px] text-white/55">{user.email} · Member of the House</p>
              </motion.div>

              <div className="mt-8 grid gap-8 lg:grid-cols-[248px_1fr]">
                {/* Sidebar */}
                <aside>
                  <nav className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-1.5 lg:px-0">
                    {TABS.map((t) => (
                      <button key={t} type="button" onClick={() => setTab(t)} className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-[14px] transition-all ${tab === t ? "bg-gradient-to-r from-brand/20 to-transparent text-white ring-1 ring-brand/30" : "text-white/55 hover:bg-white/[0.04] hover:text-white"}`}>
                        <Icon d={TAB_META[t].icon} className="h-[18px] w-[18px]" /> {TAB_META[t].label}
                      </button>
                    ))}
                    <button type="button" onClick={logout} className="flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-[14px] text-white/55 transition-colors hover:text-brand">
                      <Icon d={P.out} className="h-[18px] w-[18px]" /> Log Out
                    </button>
                  </nav>
                </aside>

                {/* Content */}
                <section className="min-w-0">
                  <AnimatePresence mode="wait">
                    <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                      {tab === "overview" && <Overview onGo={setTab} />}
                      {tab === "orders" && <Orders />}
                      {tab === "addresses" && <Addresses />}
                      {tab === "wishlist" && <Wishlist />}
                      {tab === "profile" && <Profile />}
                    </motion.div>
                  </AnimatePresence>
                </section>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-white/10 bg-white/[0.03] p-6 ${className}`}>{children}</div>;
}

function Overview({ onGo }: { onGo: (t: Tab) => void }) {
  const orders = useAccountStore((s) => s.orders);
  const addresses = useAccountStore((s) => s.addresses);
  const stats = [
    { label: "Orders", value: orders.length, tab: "orders" as Tab, icon: P.bag },
    { label: "Addresses", value: addresses.length, tab: "addresses" as Tab, icon: P.pin },
    { label: "Wishlist", value: 3, tab: "wishlist" as Tab, icon: P.heart },
  ];
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <button key={s.label} type="button" onClick={() => onGo(s.tab)} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition-all hover:border-brand/40">
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <Icon d={s.icon} className="h-5 w-5 text-brand" />
            <p className="mt-3 font-serif text-[36px] leading-none text-white">{s.value}</p>
            <p className="mt-1 text-[12px] uppercase tracking-widest text-white/45">{s.label}</p>
          </button>
        ))}
      </div>
      <div>
        <h2 className="text-[14px] uppercase tracking-[0.15em] text-white/80">Recent Order</h2>
        {orders[0] ? <Card className="mt-4"><OrderRow order={orders[0]} /></Card> : <p className="mt-4 text-sm text-white/50">No orders yet.</p>}
      </div>
    </div>
  );
}

function OrderRow({ order }: { order: Order }) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-serif text-[19px] text-white">Order {order.id}</p>
          <p className="text-[13px] text-white/45">{order.date}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ${STATUS[order.status]}`}>{order.status}</span>
      </div>
      <div className="mt-4 flex items-center gap-3">
        {order.items.map((it, i) => (
          <div key={i} className="relative h-14 w-14 overflow-hidden rounded-lg bg-white/[0.05]">
            {it.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={it.image} alt={it.name} className="h-full w-full object-contain p-1" />
            )}
          </div>
        ))}
        <p className="ml-auto font-serif text-[20px] text-white">{formatPrice(order.total)}</p>
      </div>
    </div>
  );
}

function Orders() {
  const orders = useAccountStore((s) => s.orders);
  if (!orders.length) return <p className="text-sm text-white/50">You haven&apos;t placed any orders yet.</p>;
  return <div className="space-y-5">{orders.map((o) => <Card key={o.id}><OrderRow order={o} /></Card>)}</div>;
}

function Addresses() {
  const addresses = useAccountStore((s) => s.addresses);
  const addAddress = useAccountStore((s) => s.addAddress);
  const removeAddress = useAccountStore((s) => s.removeAddress);
  const [adding, setAdding] = useState(false);
  const empty = { label: "", name: "", line1: "", line2: "", city: "", state: "", zip: "", country: "India", phone: "" };
  const [form, setForm] = useState(empty);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = (e: FormEvent) => { e.preventDefault(); addAddress(form as Omit<Address, "id">); setForm(empty); setAdding(false); };
  const cls = "h-11 rounded-lg border border-white/15 bg-white/[0.03] px-3 text-sm text-white placeholder:text-white/40 focus:border-brand focus:outline-none";
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((a) => (
          <Card key={a.id} className="relative">
            <div className="flex items-center justify-between">
              <p className="font-serif text-[19px] text-white">{a.label}</p>
              {a.default && <span className="rounded-full bg-brand/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand ring-1 ring-brand/30">Default</span>}
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-white/65">{a.name}<br />{a.line1}{a.line2 ? <>, {a.line2}</> : null}<br />{a.city}, {a.state} {a.zip}<br />{a.country}<br />{a.phone}</p>
            <button type="button" onClick={() => removeAddress(a.id)} className="mt-4 text-[12px] uppercase tracking-widest text-white/45 transition-colors hover:text-brand">Remove</button>
          </Card>
        ))}
      </div>
      {adding ? (
        <Card>
          <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
            <input required value={form.label} onChange={set("label")} placeholder="Label (Home / Work)" className={cls} />
            <input required value={form.name} onChange={set("name")} placeholder="Full name" className={cls} />
            <input required value={form.line1} onChange={set("line1")} placeholder="Address line 1" className={`${cls} sm:col-span-2`} />
            <input value={form.line2} onChange={set("line2")} placeholder="Address line 2 (optional)" className={`${cls} sm:col-span-2`} />
            <input required value={form.city} onChange={set("city")} placeholder="City" className={cls} />
            <input required value={form.state} onChange={set("state")} placeholder="State" className={cls} />
            <input required value={form.zip} onChange={set("zip")} placeholder="PIN code" className={cls} />
            <input required value={form.phone} onChange={set("phone")} placeholder="Phone" className={cls} />
            <div className="flex gap-3 sm:col-span-2">
              <button type="submit" className="rounded-full bg-gradient-to-r from-brand to-brand-soft px-6 py-3 text-[12px] font-bold uppercase tracking-widest text-white">Save Address</button>
              <button type="button" onClick={() => setAdding(false)} className="rounded-full border border-white/25 px-6 py-3 text-[12px] font-bold uppercase tracking-widest text-white/80 transition-colors hover:text-white">Cancel</button>
            </div>
          </form>
        </Card>
      ) : (
        <button type="button" onClick={() => setAdding(true)} className="w-full rounded-2xl border border-dashed border-white/20 px-6 py-5 text-[13px] uppercase tracking-widest text-white/60 transition-colors hover:border-brand hover:text-brand">+ Add a new address</button>
      )}
    </div>
  );
}

function Wishlist() {
  const [items, setItems] = useState<Product[]>(() => newArrivals.slice(0, 3));
  const addLocal = useCartStore((s) => s.addLocal);
  if (!items.length) return <p className="text-sm text-white/50">Your wishlist is empty.</p>;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <Card key={p.id} className="group flex flex-col">
          <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-xl">
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "radial-gradient(70% 70% at 50% 30%, rgba(228,99,140,0.22) 0%, transparent 70%)" }} />
            {p.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image} alt={p.name} className="relative h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
            )}
          </div>
          <h3 className="mt-3 font-serif text-[18px] text-brand">{p.name}</h3>
          <p className="mt-1 text-[13px] text-white/55">{formatPrice(p.price)}</p>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => addLocal({ id: p.id, name: p.name, price: p.price, image: p.image })} className="flex-1 rounded-full bg-gradient-to-r from-brand to-brand-soft py-2.5 text-[11px] font-bold uppercase tracking-widest text-white">Add to Cart</button>
            <button type="button" aria-label="Remove" onClick={() => setItems((xs) => xs.filter((x) => x.id !== p.id))} className="rounded-full border border-white/20 px-3 text-white/55 transition-colors hover:text-brand">✕</button>
          </div>
        </Card>
      ))}
    </div>
  );
}

function Profile() {
  const user = useAccountStore((s) => s.user);
  const updateProfile = useAccountStore((s) => s.updateProfile);
  const [form, setForm] = useState({ name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "" });
  const [saved, setSaved] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => { setForm((f) => ({ ...f, [k]: e.target.value })); setSaved(false); };
  const submit = (e: FormEvent) => { e.preventDefault(); updateProfile(form); setSaved(true); };
  const cls = "h-12 w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/40 focus:border-brand focus:outline-none";
  return (
    <Card className="max-w-lg">
      <form onSubmit={submit} className="space-y-4">
        {(["name", "email", "phone"] as const).map((k) => (
          <label key={k} className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-widest text-white/50">{k === "name" ? "Full name" : k}</span>
            <input type={k === "email" ? "email" : "text"} value={form[k]} onChange={set(k)} className={cls} />
          </label>
        ))}
        <div className="flex items-center gap-4 pt-2">
          <button type="submit" className="rounded-full bg-gradient-to-r from-brand to-brand-soft px-8 py-3 text-[12px] font-bold uppercase tracking-widest text-white">Save Changes</button>
          {saved && <span className="text-[13px] text-emerald-300">Saved ✓</span>}
        </div>
      </form>
    </Card>
  );
}
