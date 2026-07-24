import type { Metadata } from "next";

/* Fonts are declared in the root layout so the shared header/footer
   pick them up too. */

export const metadata: Metadata = {
  title: "Agni Nail Ring — Bhavya Ramesh",
  description:
    "Sculptural artifacts designed to be lived in. Forget the rules of gender, embrace the weight of identity.",
};

export default function ShopV2Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
