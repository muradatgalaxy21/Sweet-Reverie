import type { MetadataRoute } from "next";
import { shopifyFetch } from "@/lib/shopify";
import { SITE_URL } from "@/lib/utils";
import type { SitemapQuery, SitemapQueryVariables } from "@/lib/generated/storefront";

// Collections come along on every page request; harmless at <250 collections.
const SITEMAP = /* GraphQL */ `
  query Sitemap($after: String) {
    collections(first: 250) {
      nodes {
        handle
        updatedAt
      }
    }
    products(first: 250, after: $after) {
      nodes {
        handle
        updatedAt
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const entry = (path: string, lastModified?: string) => ({ url: new URL(path, SITE_URL).href, lastModified });

/** Homepage + every collection and product page, from the Storefront API (products paginated). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const first = await shopifyFetch<SitemapQuery, SitemapQueryVariables>(SITEMAP);
  const products = [...first.products.nodes];
  let { pageInfo } = first.products;
  while (pageInfo.hasNextPage && pageInfo.endCursor) {
    const page = await shopifyFetch<SitemapQuery, SitemapQueryVariables>(SITEMAP, { after: pageInfo.endCursor });
    products.push(...page.products.nodes);
    pageInfo = page.products.pageInfo;
  }

  return [
    entry("/"),
    // "frontpage" is Shopify's default Online Store collection, not a page on this site.
    ...first.collections.nodes
      .filter((c) => c.handle !== "frontpage")
      .map((c) => entry(`/collections/${c.handle}`, c.updatedAt)),
    ...products.map((p) => entry(`/products/${p.handle}`, p.updatedAt)),
  ];
}
