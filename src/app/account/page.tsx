"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useAccountStore, type Address, type Order } from "@/store/account";
import { useCartStore } from "@/store/cart";
import { newArrivals, formatPrice, type Product } from "@/lib/products";

const TABS = ["overview", "orders", "addresses", "wishlist", "profile"] as const;
type Tab = (typeof TABS)[number];

const TAB_LABEL: Record<Tab, string> = {
  overview: "Overview",
  orders: "My Orders",
  addresses: "Addresses",
  wishlist: "Wishlist",
  profile: "Profile Settings",
};

const STATUS_STYLE: Record<Order["status"], string> = {
  Delivered: "bg-emerald-500/15 text-emerald-300",
  Shipped: "bg-sky-500/15 text-sky-300",
  Processing: "bg-amber-500/15 text-amber-300",
  Cancelled: "bg-red-500/15 text-red-300",
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

  if (!mounted) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <main className="min-h-screen bg-black px-5 pb-24 pt-[150px] sm:px-8">
      <div className="mx-auto max-w-[1200px]">
        {!user ? (
          <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
            <p className="text-[14px] uppercase tracking-[0.3em] text-white/60">Account</p>
            <h1 className="mt-5 font-serif text-[44px] leading-tight text-white">You&apos;re not signed in</h1>
            <p className="mt-4 text-sm text-white/60">Sign in to view your orders, addresses and wishlist.</p>
            <button
              type="button"
              onClick={openDrawer}
              className="mt-8 rounded-md bg-brand-soft px-8 py-3.5 text-[12px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-brand"
            >
              Sign In / Create Account
            </button>
          </div>
        ) : (
          <>
            <header className="mb-10">
              <p className="text-[13px] uppercase tracking-[0.3em] text-brand">My Account</p>
              <h1 className="mt-3 font-serif text-[40px] leading-tight text-white sm:text-[52px]">Hi, {user.name}.</h1>
            </header>

            <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
              {/* Sidebar */}
              <aside>
                <nav className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-1 lg:px-0">
                  {TABS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTab(t)}
                      className={`shrink-0 rounded-md px-4 py-3 text-left text-[14px] transition-colors ${
                        tab === t ? "bg-white/10 text-white" : "text-white/60 hover:text-white"
                      }`}
                    >
                      {TAB_LABEL[t]}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={logout}
                    className="shrink-0 rounded-md px-4 py-3 text-left text-[14px] text-white/60 transition-colors hover:text-brand"
                  >
                    Log Out
                  </button>
                </nav>
              </aside>

              {/* Content */}
              <section className="min-w-0">
                {tab === "overview" && <Overview onGo={setTab} />}
                {tab === "orders" && <Orders />}
                {tab === "addresses" && <Addresses />}
                {tab === "wishlist" && <Wishlist />}
                {tab === "profile" && <Profile />}
              </section>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

/* ---------------- Sections ---------------- */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-white/10 bg-white/[0.03] p-6 ${className}`}>{children}</div>;
}

function Overview({ onGo }: { onGo: (t: Tab) => void }) {
  const orders = useAccountStore((s) => s.orders);
  const addresses = useAccountStore((s) => s.addresses);
  const stats = [
    { label: "Orders", value: orders.length, tab: "orders" as Tab },
    { label: "Addresses", value: addresses.length, tab: "addresses" as Tab },
    { label: "Wishlist", value: 3, tab: "wishlist" as Tab },
  ];
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <button key={s.label} type="button" onClick={() => onGo(s.tab)} className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-left transition-colors hover:border-brand/50">
            <p className="text-[32px] font-bold text-white">{s.value}</p>
            <p className="mt-1 text-[13px] text-white/55">{s.label}</p>
          </button>
        ))}
      </div>

      <div>
        <h2 className="text-[15px] uppercase tracking-[0.15em] text-white/80">Recent Order</h2>
        {orders[0] ? (
          <Card className="mt-4">
            <OrderRow order={orders[0]} />
          </Card>
        ) : (
          <p className="mt-4 text-sm text-white/50">No orders yet.</p>
        )}
      </div>
    </div>
  );
}

function OrderRow({ order }: { order: Order }) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[15px] font-semibold text-white">Order {order.id}</p>
          <p className="text-[13px] text-white/50">{order.date}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${STATUS_STYLE[order.status]}`}>
          {order.status}
        </span>
      </div>
      <div className="mt-4 flex items-center gap-3">
        {order.items.map((it, i) => (
          <div key={i} className="relative h-14 w-14 overflow-hidden rounded-md bg-white/[0.04]">
            {it.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={it.image} alt={it.name} className="h-full w-full object-contain" />
            )}
          </div>
        ))}
        <p className="ml-auto text-[15px] font-semibold text-white">{formatPrice(order.total)}</p>
      </div>
    </div>
  );
}

function Orders() {
  const orders = useAccountStore((s) => s.orders);
  if (!orders.length) return <p className="text-sm text-white/50">You haven&apos;t placed any orders yet.</p>;
  return (
    <div className="space-y-5">
      {orders.map((o) => (
        <Card key={o.id}>
          <OrderRow order={o} />
        </Card>
      ))}
    </div>
  );
}

function Addresses() {
  const addresses = useAccountStore((s) => s.addresses);
  const addAddress = useAccountStore((s) => s.addAddress);
  const removeAddress = useAccountStore((s) => s.removeAddress);
  const [adding, setAdding] = useState(false);
  const empty = { label: "", name: "", line1: "", line2: "", city: "", state: "", zip: "", country: "India", phone: "" };
  const [form, setForm] = useState(empty);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = (e: FormEvent) => {
    e.preventDefault();
    addAddress(form as Omit<Address, "id">);
    setForm(empty);
    setAdding(false);
  };
  const cls = "h-11 rounded-md border border-white/25 bg-transparent px-3 text-sm text-white placeholder:text-white/40 focus:border-brand focus:outline-none";

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((a) => (
          <Card key={a.id}>
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-semibold text-white">{a.label}</p>
              {a.default && <span className="rounded-full bg-brand/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">Default</span>}
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-white/70">
              {a.name}
              <br />
              {a.line1}
              {a.line2 ? <>, {a.line2}</> : null}
              <br />
              {a.city}, {a.state} {a.zip}
              <br />
              {a.country}
              <br />
              {a.phone}
            </p>
            <button type="button" onClick={() => removeAddress(a.id)} className="mt-4 text-[12px] uppercase tracking-widest text-white/50 transition-colors hover:text-brand">
              Remove
            </button>
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
              <button type="submit" className="rounded-md bg-brand-soft px-6 py-3 text-[12px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-brand">Save Address</button>
              <button type="button" onClick={() => setAdding(false)} className="rounded-md border border-white/25 px-6 py-3 text-[12px] font-bold uppercase tracking-widest text-white/80 transition-colors hover:text-white">Cancel</button>
            </div>
          </form>
        </Card>
      ) : (
        <button type="button" onClick={() => setAdding(true)} className="rounded-md border border-dashed border-white/25 px-6 py-4 text-[13px] uppercase tracking-widest text-white/70 transition-colors hover:border-brand hover:text-brand">
          + Add a new address
        </button>
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
        <Card key={p.id} className="flex flex-col">
          <div className="flex h-40 items-center justify-center">
            {p.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image} alt={p.name} className="h-full w-full object-contain" />
            )}
          </div>
          <h3 className="mt-3 text-[16px] font-bold text-brand">{p.name}</h3>
          <p className="mt-1 text-[13px] text-white/60">{formatPrice(p.price)}</p>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => addLocal({ id: p.id, name: p.name, price: p.price, image: p.image })} className="flex-1 rounded-md bg-brand-soft py-2.5 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-brand">
              Add to Cart
            </button>
            <button type="button" aria-label="Remove" onClick={() => setItems((xs) => xs.filter((x) => x.id !== p.id))} className="rounded-md border border-white/25 px-3 text-white/60 transition-colors hover:text-brand">
              ✕
            </button>
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
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setSaved(false);
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    updateProfile(form);
    setSaved(true);
  };
  const cls = "h-12 w-full rounded-md border border-white/25 bg-transparent px-4 text-sm text-white placeholder:text-white/40 focus:border-brand focus:outline-none";
  return (
    <Card className="max-w-lg">
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-[12px] uppercase tracking-widest text-white/55">Full name</span>
          <input value={form.name} onChange={set("name")} className={cls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[12px] uppercase tracking-widest text-white/55">Email</span>
          <input type="email" value={form.email} onChange={set("email")} className={cls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[12px] uppercase tracking-widest text-white/55">Phone</span>
          <input value={form.phone} onChange={set("phone")} placeholder="+91 " className={cls} />
        </label>
        <div className="flex items-center gap-4 pt-2">
          <button type="submit" className="rounded-md bg-brand-soft px-8 py-3 text-[12px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-brand">Save Changes</button>
          {saved && <span className="text-[13px] text-emerald-300">Saved ✓</span>}
        </div>
      </form>
      <Link href="/" className="mt-6 inline-block text-[12px] uppercase tracking-widest text-white/45 transition-colors hover:text-brand">← Back to store</Link>
    </Card>
  );
}
