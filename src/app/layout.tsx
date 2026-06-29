import type { Metadata } from "next";
import { Mulish, Italiana, Poppins } from "next/font/google";
import "./globals.css";
import { SnakeCursor } from "@/components/SnakeCursor";
import { AnnouncementBar } from "@/components/AnnouncementBar";

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
      className={`${mulish.variable} ${italiana.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <AnnouncementBar />
        {children}
        <SnakeCursor />
      </body>
    </html>
  );
}
