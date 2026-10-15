/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type * as Types from './storefront-types';
/**
 * Sorting options for the [`products`](https://shopify.dev/docs/api/storefront/current/queries/products) query. Supports sorting products by criteria such as best-selling and price, and by product attributes such as type, and vendor.
 *
 * > Note: Use the [`RELEVANCE`](https://shopify.dev/docs/api/storefront/current/enums/ProductSortKeys#enums-RELEVANCE) key only when a search query is specified.
 *
 */
export type ProductSortKeys =
  /** Sort by the `best_selling` value. */
  | 'BEST_SELLING'
  /** Sort by the `created_at` value. */
  | 'CREATED_AT'
  /** Sort by the `id` value. */
  | 'ID'
  /** Sort by the `price` value. */
  | 'PRICE'
  /** Sort by the `product_type` value. */
  | 'PRODUCT_TYPE'
  /**
   * Sort by relevance to the search terms when the `query` parameter is specified on the connection.
   * Don't use this sort key when no search query is specified.
   *
   */
  | 'RELEVANCE'
  /** Sort by the `title` value. */
  | 'TITLE'
  /** Sort by the `updated_at` value. */
  | 'UPDATED_AT'
  /** Sort by the `vendor` value. */
  | 'VENDOR';

export type ProductCardFragment = { id: string, handle: string, title: string, availableForSale: boolean, featuredImage: { url: string, altText: string | null } | null, variants: { nodes: Array<{ price: { amount: string }, compareAtPrice: { amount: string } | null }> } };

export type CollectionProductsQueryVariables = Exact<{
  handle: string;
  first: number;
  after?: string | null | undefined;
}>;


export type CollectionProductsQuery = { collection: { title: string, description: string, products: { nodes: Array<{ id: string, handle: string, title: string, availableForSale: boolean, featuredImage: { url: string, altText: string | null } | null, variants: { nodes: Array<{ price: { amount: string }, compareAtPrice: { amount: string } | null }> } }>, pageInfo: { hasNextPage: boolean, endCursor: string | null } } } | null };

export type ProductsQueryVariables = Exact<{
  first: number;
  sortKey?: Types.ProductSortKeys | null | undefined;
  reverse?: boolean | null | undefined;
  query?: string | null | undefined;
}>;


export type ProductsQuery = { products: { nodes: Array<{ id: string, handle: string, title: string, availableForSale: boolean, featuredImage: { url: string, altText: string | null } | null, variants: { nodes: Array<{ price: { amount: string }, compareAtPrice: { amount: string } | null }> } }> } };
