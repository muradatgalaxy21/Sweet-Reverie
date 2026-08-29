import type { MetadataRoute } from "next";
import { getProducts, getCollections } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ edges: products }, { edges: collections }] = await Promise.all([
    getProducts({ first: 250 }),
    getCollections({ first: 250 }),
  ]);

  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    ...collections.map(({ node }) => ({
      url: `${SITE_URL}/collections/${node.handle}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...products.map(({ node }) => ({
      url: `${SITE_URL}/products/${node.handle}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ];
}
