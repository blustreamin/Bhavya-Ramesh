import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Mock account store (placeholder auth).
 *
 * Holds a local, optimistic view of the signed-in customer so the account
 * drawer + /account page work end-to-end without a backend. Swap `login` /
 * `register` for the Shopify Customer Account API in the commerce milestone.
 */

export interface User {
  name: string;
  email: string;
  phone?: string;
}

export interface Address {
  id: string;
  label: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  default?: boolean;
}

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  date: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  total: number;
  items: OrderItem[];
}

const MOCK_ORDERS: Order[] = [
  {
    id: "BR-10245",
    date: "18 Jun 2026",
    status: "Delivered",
    total: 24320,
    items: [
      { name: "Chameli Sunglasses", qty: 1, price: 15420, image: "/figma/2a355c7498cf8b92e7a6ac3c9ece1bd727aa71eb.png" },
      { name: "Agni Nail Ring", qty: 1, price: 8900, image: "/figma/1f474d211aff17d1dedca3194dfbb8c53fc87608.png" },
    ],
  },
  {
    id: "BR-10102",
    date: "02 May 2026",
    status: "Shipped",
    total: 23000,
    items: [{ name: "Imarti Bangle", qty: 1, price: 23000, image: "/figma/95beb547aaa54910ead91e1a68155105422f32ed.png" }],
  },
];

const MOCK_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    label: "Home",
    name: "Bhavya Ramesh",
    line1: "Shop No. 3, 43, Forbes St",
    line2: "behind Rhythm House, Kala Ghoda, Fort",
    city: "Mumbai",
    state: "Maharashtra",
    zip: "400001",
    country: "India",
    phone: "+91 8302074284",
    default: true,
  },
];

interface AccountState {
  user: User | null;
  isOpen: boolean;
  orders: Order[];
  addresses: Address[];

  open: () => void;
  close: () => void;

  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;

  addAddress: (a: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
}

let addrSeq = 100;

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      user: null,
      isOpen: false,
      orders: [],
      addresses: [],

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),

      login: (email) =>
        set({
          user: { name: email.split("@")[0].replace(/[^a-z0-9]/gi, " ").trim() || "Member", email },
          orders: MOCK_ORDERS,
          addresses: MOCK_ADDRESSES,
        }),

      register: (name, email) =>
        set({
          user: { name: name || "Member", email },
          orders: [],
          addresses: [],
        }),

      logout: () => set({ user: null }),

      updateProfile: (patch) =>
        set((s) => (s.user ? { user: { ...s.user, ...patch } } : s)),

      addAddress: (a) =>
        set((s) => ({ addresses: [...s.addresses, { ...a, id: `addr-${++addrSeq}` }] })),

      removeAddress: (id) =>
        set((s) => ({ addresses: s.addresses.filter((x) => x.id !== id) })),
    }),
    { name: "blustream-account" }
  )
);
