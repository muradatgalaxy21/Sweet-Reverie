"use server";

import { getCollectionPage } from "./products";

/** Next page of a collection, used by the "Load more" button on `/collections/[handle]`. */
export async function loadMoreProducts(handle: string, after: string) {
  const page = await getCollectionPage(handle, after);
  return { products: page?.products ?? [], nextCursor: page?.nextCursor ?? null };
}
