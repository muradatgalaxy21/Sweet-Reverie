"use server";

import { getCollectionPage } from "./products";
import { parseCollectionQuery } from "./collection-query";

/**
 * A page of a collection for a sort/filter search string (`sort=…&type=…`), used by the
 * collection page's filters, sort and "Load more". Pass `after` for the next page.
 */
export async function loadCollectionProducts(handle: string, search: string, after?: string) {
  const query = parseCollectionQuery(new URLSearchParams(search));
  const page = await getCollectionPage(handle, { query, after });
  return { products: page?.products ?? [], nextCursor: page?.nextCursor ?? null };
}
