/**
 * Application-facing Shopify domain types.
 *
 * These are intentionally a *simplified, flattened* view of the raw Storefront
 * API responses (which are deeply nested with `edges`/`node`). Service
 * functions in `src/services` are responsible for mapping raw responses into
 * these shapes so the rest of the app never deals with GraphQL connection
 * boilerplate.
 */

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ProductImage {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: ProductImage | null;
  images: ProductImage[];
  priceRange: {
    minVariantPrice: Money;
  };
  variants: ProductVariant[];
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandiseId: string;
  title: string;
  price: Money;
  image: ProductImage | null;
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
  lines: CartLine[];
}
