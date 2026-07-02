"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

type Flight = {
  id: number;
  image: string;
  start: DOMRect;
  end: { x: number; y: number };
};

/**
 * Renders product-image clones that arc from a product card into the header
 * cart icon whenever a `fly-to-cart` event fires. Dispatches `cart-bump` when
 * a clone lands so the cart icon can react. Rendered once, in the root layout.
 */
export function FlyToCartLayer() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onFly = (e: Event) => {
      const detail = (e as CustomEvent).detail as { image?: string; rect?: DOMRect };
      const target = document.getElementById("cart-fly-target");
      if (!target || !detail?.image || !detail.rect) return;
      const t = target.getBoundingClientRect();
      const id = Date.now() + Math.random();
      setFlights((f) => [
        ...f,
        { id, image: detail.image!, start: detail.rect!, end: { x: t.left + t.width / 2, y: t.top + t.height / 2 } },
      ]);
    };
    window.addEventListener("fly-to-cart", onFly as EventListener);
    return () => window.removeEventListener("fly-to-cart", onFly as EventListener);
  }, []);

  const remove = (id: number) => {
    setFlights((f) => f.filter((x) => x.id !== id));
    window.dispatchEvent(new CustomEvent("cart-bump"));
  };

  if (!mounted) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[100]">
      <AnimatePresence>
        {flights.map((f) => {
          const startCx = f.start.left + f.start.width / 2;
          const startCy = f.start.top + f.start.height / 2;
          const dx = f.end.x - startCx;
          const dy = f.end.y - startCy;
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <motion.img
              key={f.id}
              src={f.image}
              alt=""
              aria-hidden
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{
                x: [0, dx * 0.5, dx],
                y: [0, dy * 0.3 - 80, dy],
                scale: [1, 0.7, 0.12],
                opacity: [1, 1, 0.35],
              }}
              transition={{ duration: 0.85, ease: "easeInOut", times: [0, 0.45, 1] }}
              onAnimationComplete={() => remove(f.id)}
              style={{
                position: "fixed",
                top: f.start.top,
                left: f.start.left,
                width: f.start.width,
                height: f.start.height,
                objectFit: "contain",
                filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.55))",
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
