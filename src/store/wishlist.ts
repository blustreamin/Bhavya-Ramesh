import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  /** Finish the shopper had selected when saving. */
  finish?: "silver" | "gold";
};

interface WishlistState {
  items: WishlistItem[];
  add: (item: WishlistItem) => void;
  remove: (id: string) => void;
  toggle: (item: WishlistItem) => boolean;
  has: (id: string) => boolean;
  clear: () => void;
  count: () => number;
}

/**
 * Client-side wishlist. Mirrors the cart store's local-first approach so the
 * header badge and wishlist page render instantly; swapping in a customer
 * account API later only touches the actions below.
 */
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item) =>
        set((state) =>
          state.items.some((i) => i.id === item.id) ? state : { items: [...state.items, item] },
        ),

      remove: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      /** Adds when missing, removes when present. Returns the new saved state. */
      toggle: (item) => {
        const exists = get().items.some((i) => i.id === item.id);
        set((state) =>
          exists
            ? { items: state.items.filter((i) => i.id !== item.id) }
            : { items: [...state.items, item] },
        );
        return !exists;
      },

      has: (id) => get().items.some((i) => i.id === id),

      clear: () => set({ items: [] }),

      count: () => get().items.length,
    }),
    { name: "blustream-wishlist" },
  ),
);
