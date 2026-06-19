import "server-only";

import { storefrontRequest } from "@/shopify/client";
import {
  PRODUCTS_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
} from "@/shopify/queries";
import type { Product, ProductImage, ProductVariant } from "@/types/shopify";

/**
 * Product data access layer.
 *
 * `server-only` guarantees these functions are never bundled into client code.
 * Each function maps the raw Storefront `edges`/`node` response into the flat
 * domain types from `@/types/shopify`.
 */

interface Edge<T> {
  node: T;
}
interface Connection<T> {
  edges: Edge<T>[];
}

type RawProduct = Omit<Product, "images" | "variants"> & {
  images: Connection<ProductImage>;
  variants: Connection<ProductVariant>;
};

function mapProduct(raw: RawProduct): Product {
  return {
    ...raw,
    images: raw.images.edges.map((e) => e.node),
    variants: raw.variants.edges.map((e) => e.node),
  };
}

export async function getProducts(first = 12): Promise<Product[]> {
  const data = await storefrontRequest<{
    products: Connection<RawProduct>;
  }>(PRODUCTS_QUERY, { first });

  return data.products.edges.map((e) => mapProduct(e.node));
}

export async function getProductByHandle(
  handle: string
): Promise<Product | null> {
  const data = await storefrontRequest<{ product: RawProduct | null }>(
    PRODUCT_BY_HANDLE_QUERY,
    { handle }
  );

  return data.product ? mapProduct(data.product) : null;
}
