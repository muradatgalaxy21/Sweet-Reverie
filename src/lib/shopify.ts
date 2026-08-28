import { GraphQLClient } from "graphql-request";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

if (!domain || !token) {
  throw new Error(
    "Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN or NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN env vars"
  );
}

export const storefrontClient = new GraphQLClient(
  `https://${domain}/api/2026-01/graphql.json`,
  {
    headers: {
      "X-Shopify-Storefront-Access-Token": token,
    },
  }
);
