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
  /** Optional product image URL. Falls back to a placeholder when omitted. */
  image?: string;
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
    glow: "maroon",
    image: "/figma/2a355c7498cf8b92e7a6ac3c9ece1bd727aa71eb.png",
  },
];

/** Formats a rupee amount as "Rs. 15,420.00". */
export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
