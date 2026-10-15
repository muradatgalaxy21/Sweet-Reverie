"use server";

import { getProducts } from "./products";
import { Product } from "./types";

/** Full-text product search via the Storefront API, used by the header search modal. */
export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim();
  if (!q) return [];
  return getProducts({ first: 8, query: q });
}
