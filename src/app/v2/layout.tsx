import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";

/* Desktop-10 type pairing.
   Canela Deck → Playfair Display (sturdy high-contrast display serif)
   Avenir Next → Manrope (geometric humanist sans) */
const display = Playfair_Display({
  variable: "--font-v2-display",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const ui = Manrope({
  variable: "--font-v2-ui",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bhavya Ramesh — A silverware house",
  description:
    "A silverware house fostering love & oneness — cast in 925, worn without apology.",
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${display.variable} ${ui.variable}`}>{children}</div>;
}
