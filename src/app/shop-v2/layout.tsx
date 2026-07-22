import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";

/* Same pairing as the v2 homepage: Canela Deck → Playfair Display,
   Avenir Next → Manrope. */
const display = Playfair_Display({
  variable: "--font-v2-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const ui = Manrope({
  variable: "--font-v2-ui",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Agni Nail Ring — Bhavya Ramesh",
  description:
    "Sculptural artifacts designed to be lived in. Forget the rules of gender, embrace the weight of identity.",
};

export default function ShopV2Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${display.variable} ${ui.variable}`}>{children}</div>;
}
