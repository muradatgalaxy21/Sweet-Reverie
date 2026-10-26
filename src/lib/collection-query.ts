import type { ProductCollectionSortKeys, ProductFilter } from "./generated/storefront-types";

/** Sort options on the collection page; "" is the collection's own order set in Shopify admin. */
export const SORT_OPTIONS = [
  { value: "", label: "Featured" },
  { value: "best-selling", label: "Best selling" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

const SORT_KEYS: Record<SortValue, { sortKey: ProductCollectionSortKeys; reverse: boolean }> = {
  "": { sortKey: "COLLECTION_DEFAULT", reverse: false },
  "best-selling": { sortKey: "BEST_SELLING", reverse: false },
  newest: { sortKey: "CREATED", reverse: true },
  "price-asc": { sortKey: "PRICE", reverse: false },
  "price-desc": { sortKey: "PRICE", reverse: true },
};

/** Quick price ranges in the sidebar, set from the catalog's spread (Rs.). */
export const PRICE_PRESETS = [
  { label: "Under Rs. 500", maxPrice: 500 },
  { label: "Rs. 500 – 1,000", minPrice: 500, maxPrice: 1000 },
  { label: "Rs. 1,000 – 2,000", minPrice: 1000, maxPrice: 2000 },
  { label: "Over Rs. 2,000", minPrice: 2000 },
] as const;

/** Sort + filters for `/collections/[handle]`, kept in the URL as `?sort=&stock=1&type=&min=&max=`. */
export interface CollectionQuery {
  sort: SortValue;
  /** Hide sold-out products. */
  inStock: boolean;
  /** Product types; several are OR-ed by Shopify. */
  types: string[];
  minPrice?: number;
  maxPrice?: number;
}

export const DEFAULT_QUERY: CollectionQuery = { sort: "", inStock: false, types: [] };

function toPrice(value: string | null): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

/** Reads a query from URL params, dropping anything invalid (server actions get untrusted input). */
export function parseCollectionQuery(params: URLSearchParams): CollectionQuery {
  const sortParam = params.get("sort") ?? "";
  const sort = SORT_OPTIONS.some((o) => o.value === sortParam) ? (sortParam as SortValue) : "";
  const types = [...new Set(params.getAll("type").map((t) => t.trim()))]
    .filter((t) => t && t.length <= 100)
    .slice(0, 20);
  let minPrice = toPrice(params.get("min"));
  let maxPrice = toPrice(params.get("max"));
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }
  return { sort, inStock: params.get("stock") === "1", types, minPrice, maxPrice };
}

/** URL search string for a query ("" for the default view). */
export function toSearchString(query: CollectionQuery): string {
  const params = new URLSearchParams();
  if (query.sort) params.set("sort", query.sort);
  if (query.inStock) params.set("stock", "1");
  query.types.forEach((t) => params.append("type", t));
  if (query.minPrice !== undefined) params.set("min", String(query.minPrice));
  if (query.maxPrice !== undefined) params.set("max", String(query.maxPrice));
  return params.toString();
}

/** Number of active filters (sort excluded), for the mobile "Filters" button badge. */
export function countFilters(query: CollectionQuery): number {
  const price = query.minPrice !== undefined || query.maxPrice !== undefined ? 1 : 0;
  return query.types.length + price + (query.inStock ? 1 : 0);
}

/** Storefront API `sortKey`/`reverse`/`filters` variables for a query. */
export function toStorefrontVariables(query: CollectionQuery) {
  const filters: ProductFilter[] = query.types.map((productType) => ({ productType }));
  if (query.inStock) filters.push({ available: true });
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filters.push({ price: { min: query.minPrice, max: query.maxPrice } });
  }
  return { ...SORT_KEYS[query.sort], filters: filters.length ? filters : undefined };
}
