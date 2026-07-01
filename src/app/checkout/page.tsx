"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/Header";
import { useCartStore } from "@/store/cart";
import { useAccountStore } from "@/store/account";
import { formatPrice } from "@/lib/products";

const SHIPPING = {
  standard: { label: "Standard", detail: "3–5 business days", cost: 0 },
  express: { label: "Express", detail: "1–2 business days", cost: 200 },
} as const;
type ShipKey = keyof typeof SHIPPING;

function Icon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
const P = {
  lock: "M6 10V8a6 6 0 1 1 12 0v2M5 10h14v10H5zM12 14v3",
  truck: "M3 6h11v9H3zM14 9h4l3 3v3h-7M6.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM17.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  refresh: "M3 12a9 9 0 1 0 3-6.7M3 4v3.5h3.5",
  arrow: "M5 12h14M13 6l6 6-6 6",
};

const field =
  "peer h-[52px] w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 pt-4 text-sm text-white placeholder-transparent transition-colors focus:border-brand focus:outline-none";

function Field({ id, label, value, onChange, type = "text", required = true, className = "", ...rest }: any) {
  return (
    <div className={`relative ${className}`}>
      <input id={id} type={type} required={required} value={value} onChange={onChange} placeholder={label} className={field} {...rest} />
      <label htmlFor={id} className="pointer-events-none absolute left-4 top-1.5 text-[10px] uppercase tracking-widest text-white/40 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-[13px] peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-white/40 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-brand">
        {label}
      </label>
    </div>
  );
}

function StepNum({ n, title }: { n: number; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-brand/50 bg-brand/10 font-serif text-[15px] text-brand">{n}</span>
      <h2 className="text-[15px] uppercase tracking-[0.15em] text-white">{title}</h2>
    </div>
  );
}

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const lines = useCartStore((s) => s.lines);
  const clear = useCartStore((s) => s.clear);

  const [ship, setShip] = useState<ShipKey>("standard");
  const [placed, setPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [form, setForm] = useState({
    email: "", name: "", line1: "", line2: "", city: "", state: "", zip: "", phone: "",
    card: "", exp: "", cvc: "",
  });

  useEffect(() => {
    setMounted(true);
    const a = useAccountStore.getState().addresses[0];
    const u = useAccountStore.getState().user;
    if (a || u) {
      setForm((f) => ({
        ...f,
        email: u?.email ?? f.email, name: a?.name ?? u?.name ?? f.name,
        line1: a?.line1 ?? "", line2: a?.line2 ?? "", city: a?.city ?? "",
        state: a?.state ?? "", zip: a?.zip ?? "", phone: a?.phone ?? u?.phone ?? "",
      }));
    }
  }, []);

  const subtotal = lines.reduce((s, l) => s + Number(l.price.amount) * l.quantity, 0);
  const shippingCost = SHIPPING[ship].cost;
  const total = subtotal + shippingCost;
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const placeOrder = (e: FormEvent) => {
    e.preventDefault();
    setPlacing(true);
    setTimeout(() => {
      setOrderId("BR-" + Math.floor(10000 + Math.random() * 90000));
      setPlaced(true);
      setPlacing(false);
      clear();
    }, 900);
  };

  return (
    <>
      <Header />
      <main className="relative min-h-screen overflow-hidden bg-black px-5 pb-28 pt-[130px] sm:px-8">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(55% 40% at 90% 8%, rgba(120,122,145,0.14) 0%, transparent 60%), radial-gradient(50% 45% at 8% 95%, rgba(228,99,140,0.12) 0%, transparent 62%)" }} />

        <div className="relative mx-auto max-w-[1200px]">
          <AnimatePresence mode="wait">
            {placed ? (
              <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto flex max-w-xl flex-col items-center py-16 text-center">
                <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 14 }} className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-soft">
                  <div aria-hidden className="absolute inset-0 rounded-full blur-xl" style={{ background: "rgba(228,99,140,0.5)" }} />
                  <svg viewBox="0 0 24 24" fill="none" className="relative h-11 w-11 text-white"><motion.path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.2 }} /></svg>
                </motion.div>
                <p className="mt-8 text-[12px] uppercase tracking-[0.4em] text-brand">Order Confirmed</p>
                <h1 className="mt-3 font-serif text-[44px] leading-tight text-white sm:text-[56px]">Thank you{form.name ? `, ${form.name.split(" ")[0]}` : ""}.</h1>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">Your order is confirmed and a receipt is on its way to {form.email || "your inbox"}. We&apos;ll email you when it ships.</p>

                <div className="mt-8 w-full max-w-sm rounded-2xl border border-white/12 bg-white/[0.03] p-6 text-left">
                  <div className="flex justify-between text-[13px]"><span className="text-white/50">Order number</span><span className="font-semibold text-brand">{orderId}</span></div>
                  <div className="mt-3 flex justify-between text-[13px]"><span className="text-white/50">Total paid</span><span className="font-semibold text-white">{formatPrice(total)}</span></div>
                  <div className="mt-3 flex justify-between text-[13px]"><span className="text-white/50">Delivery</span><span className="text-white">{SHIPPING[ship].label} · {SHIPPING[ship].detail}</span></div>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link href="/account?tab=orders" className="rounded-full border border-white/25 px-7 py-3.5 text-[12px] font-bold uppercase tracking-widest text-white transition-colors hover:border-brand hover:text-brand">Track Order</Link>
                  <Link href="/#new-arrivals" className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-soft px-7 py-3.5 text-[12px] font-bold uppercase tracking-widest text-white transition-all hover:shadow-[0_0_30px_-6px_rgba(228,99,140,0.6)]">Continue Shopping <Icon d={P.arrow} className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
                </div>
              </motion.div>
            ) : !mounted ? (
              <div key="load" className="h-40" />
            ) : lines.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-24 text-center">
                <h1 className="font-serif text-[40px] text-white">Your cart is empty</h1>
                <Link href="/#new-arrivals" className="mt-6 rounded-full bg-gradient-to-r from-brand to-brand-soft px-8 py-3.5 text-[12px] font-bold uppercase tracking-widest text-white">Continue Shopping</Link>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} onSubmit={placeOrder}>
                <p className="text-[12px] uppercase tracking-[0.4em] text-brand">Secure Checkout</p>
                <h1 className="mt-3 font-serif text-[48px] leading-[0.95] text-white sm:text-[60px]">Checkout</h1>
                <div className="mt-6 h-px w-full bg-gradient-to-r from-brand/60 via-white/15 to-transparent" />

                <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_400px]">
                  <div className="space-y-12">
                    {/* Express */}
                    <div>
                      <div className="grid grid-cols-3 gap-3">
                        {["Pay", "G Pay", "Simpl"].map((b) => (
                          <button key={b} type="button" className="flex h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] text-[13px] font-semibold text-white transition-colors hover:border-white/40">{b}</button>
                        ))}
                      </div>
                      <div className="mt-6 flex items-center gap-4 text-[11px] uppercase tracking-widest text-white/35">
                        <span className="h-px flex-1 bg-white/10" /> or pay with card <span className="h-px flex-1 bg-white/10" />
                      </div>
                    </div>

                    <section>
                      <StepNum n={1} title="Contact" />
                      <Field id="email" label="Email address" type="email" value={form.email} onChange={set("email")} />
                    </section>

                    <section>
                      <StepNum n={2} title="Shipping Address" />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field id="name" label="Full name" value={form.name} onChange={set("name")} className="sm:col-span-2" />
                        <Field id="line1" label="Address" value={form.line1} onChange={set("line1")} className="sm:col-span-2" />
                        <Field id="line2" label="Apartment, suite (optional)" required={false} value={form.line2} onChange={set("line2")} className="sm:col-span-2" />
                        <Field id="city" label="City" value={form.city} onChange={set("city")} />
                        <Field id="state" label="State" value={form.state} onChange={set("state")} />
                        <Field id="zip" label="PIN code" value={form.zip} onChange={set("zip")} />
                        <Field id="phone" label="Phone" value={form.phone} onChange={set("phone")} />
                      </div>
                    </section>

                    <section>
                      <StepNum n={3} title="Delivery" />
                      <div className="space-y-3">
                        {(Object.keys(SHIPPING) as ShipKey[]).map((k) => (
                          <label key={k} className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-4 transition-colors ${ship === k ? "border-brand bg-brand/[0.07]" : "border-white/15 hover:border-white/30"}`}>
                            <span className="flex items-center gap-3">
                              <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${ship === k ? "border-brand" : "border-white/40"}`}>{ship === k && <span className="h-2 w-2 rounded-full bg-brand" />}</span>
                              <span><span className="block text-[14px] text-white">{SHIPPING[k].label}</span><span className="block text-[12px] text-white/45">{SHIPPING[k].detail}</span></span>
                            </span>
                            <span className="text-[14px] text-white">{SHIPPING[k].cost === 0 ? "Free" : formatPrice(SHIPPING[k].cost)}</span>
                            <input type="radio" name="ship" checked={ship === k} onChange={() => setShip(k)} className="hidden" />
                          </label>
                        ))}
                      </div>
                    </section>

                    <section>
                      <StepNum n={4} title="Payment" />
                      <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-5">
                        <div className="flex items-center gap-2 text-[12px] text-white/50"><Icon d={P.lock} className="h-4 w-4 text-emerald-400" /> Encrypted &amp; secure · demo checkout, no real charge</div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <Field id="card" label="Card number" inputMode="numeric" value={form.card} onChange={set("card")} className="sm:col-span-2" />
                          <Field id="exp" label="MM / YY" value={form.exp} onChange={set("exp")} />
                          <Field id="cvc" label="CVC" inputMode="numeric" value={form.cvc} onChange={set("cvc")} />
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Summary */}
                  <aside className="h-fit lg:sticky lg:top-[118px]">
                    <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.03] p-7 backdrop-blur-sm">
                      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/70 to-transparent" />
                      <h2 className="font-serif text-[24px] text-white">Order Summary</h2>
                      <ul className="mt-5 space-y-4">
                        {lines.map((l) => (
                          <li key={l.id} className="flex items-center gap-3">
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white/[0.05]">
                              {l.image?.url && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={l.image.url} alt={l.title} className="h-full w-full object-contain p-1" />
                              )}
                              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">{l.quantity}</span>
                            </div>
                            <p className="flex-1 text-[13px] text-white/85">{l.title}</p>
                            <p className="text-[13px] text-white/85">{formatPrice(Number(l.price.amount) * l.quantity)}</p>
                          </li>
                        ))}
                      </ul>
                      <dl className="mt-6 space-y-3 border-t border-white/10 pt-5 text-[14px]">
                        <div className="flex justify-between text-white/60"><dt>Subtotal</dt><dd className="text-white">{formatPrice(subtotal)}</dd></div>
                        <div className="flex justify-between text-white/60"><dt>Shipping</dt><dd className="text-white">{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</dd></div>
                      </dl>
                      <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-5">
                        <span className="text-[13px] uppercase tracking-widest text-white/50">Total</span>
                        <span className="font-serif text-[28px] text-white">{formatPrice(total)}</span>
                      </div>
                      <button type="submit" disabled={placing} className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-soft py-4 text-[12px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:shadow-[0_0_34px_-6px_rgba(228,99,140,0.65)] disabled:opacity-70">
                        {placing ? "Placing Order…" : <>Place Order · {formatPrice(total)}</>}
                      </button>
                      <Link href="/cart" className="mt-4 block text-center text-[12px] uppercase tracking-widest text-white/45 transition-colors hover:text-brand">Back to Cart</Link>
                    </div>
                  </aside>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}
