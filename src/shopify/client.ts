import { createStorefrontApiClient } from "@shopify/storefront-api-client";

import { env } from "@/lib/env";

/**
 * Shared Shopify Storefront API client.
 *
 * The Storefront token is a *public* token, so this client is safe to use in
 * both Server and Client Components. In practice we fetch on the server
 * (Server Components / Route Handlers) for SEO + caching, and only reach for
 * the client on the browser for cart mutations.
 */
export const shopifyClient = createStorefrontApiClient({
  storeDomain: `https://${env.shopify.domain}`,
  apiVersion: env.shopify.apiVersion,
  publicAccessToken: env.shopify.storefrontToken,
});

/**
 * Thin wrapper around `client.request` that throws on GraphQL/userErrors so
 * callers get a single rejection path instead of having to inspect every
 * response shape.
 */
export async function storefrontRequest<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const { data, errors } = await shopifyClient.request<T>(query, {
    variables,
  });

  if (errors) {
    throw new Error(
      `Shopify Storefront API error: ${
        errors.message ?? JSON.stringify(errors.graphQLErrors ?? errors)
      }`
    );
  }

  if (!data) {
    throw new Error("Shopify Storefront API returned no data.");
  }

  return data;
}
