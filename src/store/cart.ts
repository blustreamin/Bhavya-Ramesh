import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartLine, Product, ProductVariant } from "@/types/shopify";

/**
 * Client-side cart store.
 *
 * For the foundation this holds an optimistic, local view of the cart so the UI
 * (drawer, badge count) can render instantly. Syncing line items to a real
 * Shopify Cart (cartCreate / cartLinesAdd) will be layered on top in the
 * commerce milestone — the actions below are the integration points for that.
 */

interface CartState {
  /** Whether the cart drawer is open. */
  isOpen: boolean;
  lines: CartLine[];

  open: () => void;
  close: () => void;
  toggle: () => void;

  addLine: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeLine: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;

  totalQuantity: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      lines: [],

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),

      addLine: (product, variant, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find(
            (l) => l.merchandiseId === variant.id
          );

          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.merchandiseId === variant.id
                  ? { ...l, quantity: l.quantity + quantity }
                  : l
              ),
            };
          }

          const line: CartLine = {
            id: variant.id,
            merchandiseId: variant.id,
            quantity,
            title: `${product.title}${
              variant.title && variant.title !== "Default Title"
                ? ` — ${variant.title}`
                : ""
            }`,
            price: variant.price,
            image: product.featuredImage,
          };

          return { lines: [...state.lines, line] };
        }),

      removeLine: (lineId) =>
        set((state) => ({
          lines: state.lines.filter((l) => l.id !== lineId),
        })),

      updateQuantity: (lineId, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.id !== lineId)
              : state.lines.map((l) =>
                  l.id === lineId ? { ...l, quantity } : l
                ),
        })),

      clear: () => set({ lines: [] }),

      totalQuantity: () =>
        get().lines.reduce((sum, l) => sum + l.quantity, 0),
    }),
    { name: "blustream-cart" }
  )
);
