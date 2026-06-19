/**
 * Centralised, validated access to environment variables.
 *
 * Reading env vars through this module (instead of `process.env` everywhere)
 * gives us a single place that fails loudly with a clear message when a
 * required variable is missing, rather than producing a confusing runtime
 * error deep inside the Shopify client.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Copy .env.example to .env.local and fill it in.`
    );
  }
  return value;
}

export const env = {
  shopify: {
    domain: required(
      "NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN",
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
    ),
    storefrontToken: required(
      "NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN",
      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
    ),
    apiVersion:
      process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION ?? "2025-01",
  },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
