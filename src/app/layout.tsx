import type { Metadata } from "next";
import { Jost, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

// Body / UI typeface — geometric humanist sans matching the spaced nav caps.
const jost = Jost({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Display typeface — high-contrast serif used for "Bhavya Ramesh", headings, "SHINE ON".
const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  weight: ["300", "400", "500", "600"],
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
      className={`${jost.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}
