/**
 * Placeholder homepage product data.
 *
 * NOTE: In production these should come from the Shopify Storefront API
 * (see src/services/products.ts). Image fields are intentionally optional —
 * when `image` is undefined the ProductCard renders a styled placeholder.
 * Replace `image` with the real CDN/asset URL when available.
 */
export type Swatch = { label: string; color: string };

export type Product = {
  id: string;
  name: string;
  description: string;
  /** Price in minor-of-major rupees, e.g. 15420 => "Rs. 15,420.00". */
  price: number;
  rating: number; // 0–5
  swatches: Swatch[];
  /** Optional product image URL (silver finish). Falls back to a placeholder when omitted. */
  image?: string;
  /** Gold-finish product image, shown on hover or when the gold swatch is selected. */
  goldImage?: string;
  /** Visual accent behind the card. */
  glow?: "none" | "maroon";
};

export const newArrivals: Product[] = [
  {
    id: "chameli-sunglasses",
    name: "Chameli Sunglasses",
    description:
      "The Chameli Sunglasses are known to have a glaring effect on people's judgment.",
    price: 15420,
    rating: 4,
    swatches: [
      { label: "Silver", color: "#d9d9d9" },
      { label: "Gold", color: "#d8b15a" },
    ],
    glow: "none",
    image: "/figma/2a355c7498cf8b92e7a6ac3c9ece1bd727aa71eb.png",
    goldImage: "/figma/441b861038e6780b5653c72cc927d58f67794f63.png",
  },
  {
    id: "agni-nail-ring",
    name: "Agni Nail Ring",
    description:
      "The Agni ring rests atop the nail hinged segments that allow free finger movement.",
    price: 8900,
    rating: 4,
    swatches: [
      { label: "Silver", color: "#d9d9d9" },
      { label: "Gold", color: "#d8b15a" },
    ],
    glow: "none",
    image: "/figma/1f474d211aff17d1dedca3194dfbb8c53fc87608.png",
    goldImage: "/figma/2e78e9da92e032cfa2ddab3251a428c5f2779077.png",
  },
  {
    id: "chameli-sunglasses-maroon",
    name: "Chameli Sunglasses",
    description:
      "The Chameli Sunglasses are known to have a glaring effect on people's judgment.",
    price: 15420,
    rating: 4,
    swatches: [
      { label: "Silver", color: "#d9d9d9" },
      { label: "Gold", color: "#d8b15a" },
    ],
    glow: "none",
    image: "/figma/2a355c7498cf8b92e7a6ac3c9ece1bd727aa71eb.png",
    goldImage: "/figma/441b861038e6780b5653c72cc927d58f67794f63.png",
  },
];

/** Featured products shown in the brand-story vertical slider. */
export const featuredProducts: Product[] = [
  {
    id: "imarti-bangle",
    name: "Imarti Bangle",
    description:
      "The Imarti Bangle coils the wrist in sculptural silver — equal parts armour and ornament.",
    price: 23000,
    rating: 4,
    swatches: [
      { label: "Silver", color: "#d9d9d9" },
      { label: "Gold", color: "#d8b15a" },
    ],
    glow: "none",
    image: "/figma/95beb547aaa54910ead91e1a68155105422f32ed.png",
    goldImage: "/figma/caddd41f91522c9bccca2f032c557f1827533177.png",
  },
  newArrivals[1], // Agni Nail Ring
  newArrivals[0], // Chameli Sunglasses
];

/** Formats a rupee amount as "Rs. 15,420.00". */
export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
