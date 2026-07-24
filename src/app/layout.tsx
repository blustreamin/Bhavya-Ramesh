import type { Metadata } from "next";
import { Mulish, Italiana, Poppins, Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";
import { PetalCursor } from "@/components/PetalCursor";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { CartDrawer } from "@/components/CartDrawer";
import { SearchOverlay } from "@/components/SearchOverlay";
import { FlyToCartLayer } from "@/components/FlyToCartLayer";

// Body / UI typeface — humanist sans used for nav, labels, product copy and price.
const mulish = Mulish({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Display typeface — high-contrast serif used for "Bhavya Ramesh", section headings
// ("Built from mythology…", "Subscribe to Newsletter") and the "SHINE ON" watermark.
const italiana = Italiana({
  variable: "--font-serif",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

/* Desktop-10 pairing, declared here so every route (including the shared
   header/footer) can use it: Canela Deck → Playfair Display, Avenir Next →
   Manrope. */
const v2Display = Playfair_Display({
  variable: "--font-v2-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const v2Ui = Manrope({
  variable: "--font-v2-ui",
  subsets: ["latin"],
  display: "swap",
});

// Hero wordmark typeface.
const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bhavya Ramesh — Fine Jewellery",
    template: "%s | Bhavya Ramesh",
  },
  description:
    "Bhavya Ramesh — sculptural fine jewellery, archives and atelier crafts. Shine on.",
  openGraph: {
    type: "website",
    siteName: "Bhavya Ramesh",
    url: siteUrl,
    title: "Bhavya Ramesh — Fine Jewellery",
    description:
      "Sculptural fine jewellery, archives and atelier crafts. Shine on.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${mulish.variable} ${italiana.variable} ${poppins.variable} ${v2Display.variable} ${v2Ui.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <AnnouncementBar />
        {children}
        <CartDrawer />
        <SearchOverlay />
        <FlyToCartLayer />
        <PetalCursor />
      </body>
    </html>
  );
}
