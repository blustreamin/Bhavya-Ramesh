"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { useCartStore } from "@/store/cart";
import { useAccountStore } from "@/store/account";
import { formatPrice } from "@/lib/products";

const SHIPPING = {
  standard: { label: "Standard", detail: "3–5 business days", cost: 0 },
  express: { label: "Express", detail: "1–2 business days", cost: 200 },
} as const;
type ShipKey = keyof typeof SHIPPING;

const field = "h-12 w-full rounded-md border border-white/25 bg-transparent px-4 text-sm text-white placeholder:text-white/40 focus:border-brand focus:outline-none";

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const lines = useCartStore((s) => s.lines);
  const clear = useCartStore((s) => s.clear);
  const user = useAccountStore((s) => s.user);
  const addresses = useAccountStore((s) => s.addresses);

  const [ship, setShip] = useState<ShipKey>("standard");
  const [placed, setPlaced] = useState(false);
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
        email: u?.email ?? f.email,
        name: a?.name ?? u?.name ?? f.name,
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
    setOrderId("BR-" + Math.floor(10000 + Math.random() * 90000));
    setPlaced(true);
    clear();
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black px-5 pb-24 pt-[130px] sm:px-8">
        <div className="mx-auto max-w-[1200px]">
          {placed ? (
            <div className="mx-auto flex max-w-lg flex-col items-center py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden><path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <h1 className="mt-6 font-serif text-[40px] leading-tight text-white">Order confirmed</h1>
              <p className="mt-3 text-sm text-white/60">
                Thank you{form.name ? `, ${form.name.split(" ")[0]}` : ""}! Your order{" "}
                <span className="text-brand">{orderId}</span> has been placed. A confirmation has been sent to{" "}
                {form.email || "your email"}.
              </p>
              <div className="mt-8 flex gap-3">
                <Link href="/account?tab=orders" className="rounded-md border border-white/25 px-6 py-3 text-[12px] font-bold uppercase tracking-widest text-white transition-colors hover:border-brand hover:text-brand">View Orders</Link>
                <Link href="/#new-arrivals" className="rounded-md bg-brand-soft px-6 py-3 text-[12px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-brand">Continue Shopping</Link>
              </div>
            </div>
          ) : !mounted ? (
            <div className="h-40" />
          ) : lines.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <h1 className="font-serif text-[40px] text-white">Your cart is empty</h1>
              <Link href="/#new-arrivals" className="mt-6 rounded-md bg-brand-soft px-8 py-3.5 text-[12px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-brand">Continue Shopping</Link>
            </div>
          ) : (
            <form onSubmit={placeOrder}>
              <h1 className="font-serif text-[40px] leading-tight text-white sm:text-[52px]">Checkout</h1>
              <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
                {/* Forms */}
                <div className="space-y-10">
                  <section>
                    <h2 className="text-[15px] uppercase tracking-[0.15em] text-white">Contact</h2>
                    <input required type="email" value={form.email} onChange={set("email")} placeholder="Email address" className={`${field} mt-4`} />
                  </section>

                  <section>
                    <h2 className="text-[15px] uppercase tracking-[0.15em] text-white">Shipping Address</h2>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <input required value={form.name} onChange={set("name")} placeholder="Full name" className={`${field} sm:col-span-2`} />
                      <input required value={form.line1} onChange={set("line1")} placeholder="Address" className={`${field} sm:col-span-2`} />
                      <input value={form.line2} onChange={set("line2")} placeholder="Apartment, suite (optional)" className={`${field} sm:col-span-2`} />
                      <input required value={form.city} onChange={set("city")} placeholder="City" className={field} />
                      <input required value={form.state} onChange={set("state")} placeholder="State" className={field} />
                      <input required value={form.zip} onChange={set("zip")} placeholder="PIN code" className={field} />
                      <input required value={form.phone} onChange={set("phone")} placeholder="Phone" className={field} />
                    </div>
                  </section>

                  <section>
                    <h2 className="text-[15px] uppercase tracking-[0.15em] text-white">Delivery</h2>
                    <div className="mt-4 space-y-3">
                      {(Object.keys(SHIPPING) as ShipKey[]).map((k) => (
                        <label key={k} className={`flex cursor-pointer items-center justify-between rounded-md border px-4 py-3.5 transition-colors ${ship === k ? "border-brand bg-brand/5" : "border-white/20"}`}>
                          <span className="flex items-center gap-3">
                            <input type="radio" name="ship" checked={ship === k} onChange={() => setShip(k)} className="h-4 w-4 accent-brand" />
                            <span>
                              <span className="block text-[14px] text-white">{SHIPPING[k].label}</span>
                              <span className="block text-[12px] text-white/50">{SHIPPING[k].detail}</span>
                            </span>
                          </span>
                          <span className="text-[14px] text-white">{SHIPPING[k].cost === 0 ? "Free" : formatPrice(SHIPPING[k].cost)}</span>
                        </label>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h2 className="text-[15px] uppercase tracking-[0.15em] text-white">Payment</h2>
                    <p className="mt-1 text-[12px] text-white/45">Demo checkout — no real payment is taken.</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <input required value={form.card} onChange={set("card")} placeholder="Card number" inputMode="numeric" className={`${field} sm:col-span-2`} />
                      <input required value={form.exp} onChange={set("exp")} placeholder="MM / YY" className={field} />
                      <input required value={form.cvc} onChange={set("cvc")} placeholder="CVC" inputMode="numeric" className={field} />
                    </div>
                  </section>
                </div>

                {/* Summary */}
                <aside className="h-fit rounded-xl border border-white/10 bg-white/[0.03] p-6 lg:sticky lg:top-[120px]">
                  <h2 className="text-[15px] uppercase tracking-[0.15em] text-white">Order Summary</h2>
                  <ul className="mt-5 space-y-4">
                    {lines.map((l) => (
                      <li key={l.id} className="flex items-center gap-3">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-white/[0.04]">
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
                    <div className="flex justify-between text-white/70"><dt>Subtotal</dt><dd className="text-white">{formatPrice(subtotal)}</dd></div>
                    <div className="flex justify-between text-white/70"><dt>Shipping</dt><dd className="text-white">{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</dd></div>
                  </dl>
                  <div className="mt-5 flex justify-between border-t border-white/10 pt-5 text-[16px] font-semibold text-white">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <button type="submit" className="mt-6 w-full rounded-md bg-brand-soft py-3.5 text-[12px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-brand">
                    Place Order · {formatPrice(total)}
                  </button>
                  <Link href="/cart" className="mt-4 block text-center text-[12px] uppercase tracking-widest text-white/50 transition-colors hover:text-brand">
                    Back to Cart
                  </Link>
                </aside>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
