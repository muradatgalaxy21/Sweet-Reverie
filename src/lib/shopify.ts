const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
// Server-only (no NEXT_PUBLIC_ prefix): every Storefront call runs in server components/actions.
const token = process.env.SHOPIFY_STOREFRONT_TOKEN;

if (!domain || !token) {
  throw new Error(
    "Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_TOKEN env vars"
  );
}

const endpoint = `https://${domain}/api/2026-01/graphql.json`;

/**
 * POSTs a query to the Storefront API.
 * Responses are tagged "shopify" and refreshed by the Shopify webhook at
 * `/api/revalidate` (plan.md §3); the 1h revalidate is only a safety net for missed
 * webhooks. Pass `cache: false` for per-user data (carts) that must never be cached or shared.
 */
export async function shopifyFetch<TData, TVariables = Record<string, never>>(
  query: string,
  variables?: TVariables,
  { cache = true }: { cache?: boolean } = {}
): Promise<TData> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token!,
    },
    body: JSON.stringify({ query, variables }),
    ...(cache ? { next: { revalidate: 3600, tags: ["shopify"] } } : { cache: "no-store" }),
  });

  const json = await res.json();
  if (!res.ok || json.errors) {
    throw new Error(`Shopify Storefront API error: ${JSON.stringify(json.errors ?? res.status)}`);
  }
  return json.data as TData;
}
