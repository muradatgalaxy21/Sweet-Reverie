import { shopifyFetch } from "./shopify";
import { sanitizeDescription } from "./sanitize";
import { Product } from "./types";
import { DEFAULT_QUERY, toStorefrontVariables, type CollectionQuery } from "./collection-query";
import type {
  CollectionProductsQuery,
  CollectionProductsQueryVariables,
  ProductCardFragment,
  ProductPageQuery,
  ProductPageQueryVariables,
  ProductsQuery,
  ProductsQueryVariables,
} from "./generated/storefront";

const PRODUCT_CARD = /* GraphQL */ `
  fragment ProductCard on Product {
    id
    handle
    title
    availableForSale
    featuredImage {
      url
      altText
    }
    variants(first: 1) {
      nodes {
        id
        price {
          amount
        }
        compareAtPrice {
          amount
        }
      }
    }
  }
`;

const COLLECTION_PRODUCTS = /* GraphQL */ `
  query CollectionProducts(
    $handle: String!
    $first: Int!
    $after: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
    $withFilters: Boolean = false
  ) {
    collection(handle: $handle) {
      title
      description
      products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, filters: $filters) {
        filters @include(if: $withFilters) {
          id
          values {
            input
          }
        }
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  ${PRODUCT_CARD}
`;

const PRODUCTS = /* GraphQL */ `
  query Products($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD}
`;

const PRODUCT = /* GraphQL */ `
  query ProductPage($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      seo {
        title
        description
      }
      images(first: 10) {
        nodes {
          url
          altText
        }
      }
      variants(first: 100) {
        nodes {
          id
          title
          sku
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
          }
          image {
            url
          }
        }
      }
      collections(first: 1) {
        nodes {
          handle
          title
        }
      }
    }
  }
`;

// Shown when a Shopify product has no image yet.
export const PLACEHOLDER_IMAGE = "/logo/sweet-reverie-no-bg.png";

/** Maps a Storefront API product to the card shape the UI uses. */
function toProduct(node: ProductCardFragment): Product {
  const variant = node.variants.nodes[0];
  const price = Number(variant?.price.amount ?? 0);
  const compareAt = Number(variant?.compareAtPrice?.amount ?? 0);
  const onSale = compareAt > price;

  return {
    id: node.id,
    variantId: variant?.id ?? "",
    handle: node.handle,
    title: node.title,
    price,
    compareAtPrice: onSale ? compareAt : undefined,
    imageUrl: node.featuredImage?.url ?? PLACEHOLDER_IMAGE,
    badge: onSale ? "Sale" : undefined,
    availableForSale: node.availableForSale,
  };
}

export async function getCollectionProducts(handle: string, first = 10): Promise<Product[]> {
  const data = await shopifyFetch<CollectionProductsQuery, CollectionProductsQueryVariables>(
    COLLECTION_PRODUCTS,
    { handle, first }
  );
  return (data.collection?.products.nodes ?? []).map(toProduct);
}

/** Filter options for a collection's sidebar, from Shopify's filter data (Search & Discovery app). */
export interface CollectionFilterOptions {
  /** Product types in the collection; the type filter is only shown with 2+. */
  types: string[];
  /** Price span of the collection, for the min/max placeholders. */
  priceRange: { min: number; max: number } | null;
}

export interface CollectionPage {
  title: string;
  description: string;
  products: Product[];
  /** Cursor for the next page, or null when this is the last one. */
  nextCursor: string | null;
  /** Only when requested with `withFilters`. */
  filterOptions?: CollectionFilterOptions;
}

type ShopifyFilter = NonNullable<
  NonNullable<CollectionProductsQuery["collection"]>["products"]["filters"]
>[number];

// FilterValue.input is a JSON-encoded string, e.g. {"productType":"Chocolate"}.
function parseFilterInput(input: unknown): Record<string, unknown> {
  try {
    const value = typeof input === "string" ? JSON.parse(input) : input;
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

function toFilterOptions(filters: ShopifyFilter[]): CollectionFilterOptions {
  const types = (filters.find((f) => f.id === "filter.p.product_type")?.values ?? [])
    .map((v) => parseFilterInput(v.input).productType)
    .filter((t): t is string => typeof t === "string" && t !== "");

  const priceInput = filters.find((f) => f.id === "filter.v.price")?.values[0]?.input;
  const price = parseFilterInput(priceInput).price as { min?: unknown; max?: unknown } | undefined;
  const min = Number(price?.min ?? 0);
  const max = Number(price?.max);
  const priceRange = Number.isFinite(min) && Number.isFinite(max) && max > 0 ? { min, max } : null;

  return { types, priceRange };
}

/** One page of a collection for `/collections/[handle]`; null if the collection doesn't exist. */
export async function getCollectionPage(
  handle: string,
  {
    query = DEFAULT_QUERY,
    after,
    withFilters = false,
    first = 20,
  }: { query?: CollectionQuery; after?: string; withFilters?: boolean; first?: number } = {}
): Promise<CollectionPage | null> {
  const data = await shopifyFetch<CollectionProductsQuery, CollectionProductsQueryVariables>(
    COLLECTION_PRODUCTS,
    { handle, first, after, withFilters, ...toStorefrontVariables(query) }
  );
  const collection = data.collection;
  if (!collection) return null;
  const { nodes, pageInfo, filters } = collection.products;
  return {
    title: collection.title,
    description: collection.description,
    products: nodes.map(toProduct),
    nextCursor: pageInfo.hasNextPage ? pageInfo.endCursor ?? null : null,
    filterOptions: filters ? toFilterOptions(filters) : undefined,
  };
}

export type ProductDetail = NonNullable<ProductPageQuery["product"]>;

export async function getProductByHandle(handle: string): Promise<ProductDetail | null> {
  const data = await shopifyFetch<ProductPageQuery, ProductPageQueryVariables>(PRODUCT, { handle });
  if (!data.product) return null;
  return { ...data.product, descriptionHtml: sanitizeDescription(data.product.descriptionHtml) };
}

export async function getProducts(variables: ProductsQueryVariables): Promise<Product[]> {
  const data = await shopifyFetch<ProductsQuery, ProductsQueryVariables>(PRODUCTS, variables);
  return data.products.nodes.map(toProduct);
}

/** Hand-picked `new-arrivals` collection, falling back to the newest products while it's empty. */
export async function getNewArrivals(first = 10): Promise<Product[]> {
  const picked = await getCollectionProducts("new-arrivals", first);
  return picked.length ? picked : getProducts({ first, sortKey: "CREATED_AT", reverse: true });
}

/** Hand-picked `best-sellers` collection, falling back to Shopify's best-selling sort while it's empty. */
export async function getBestSellers(first = 10): Promise<Product[]> {
  const picked = await getCollectionProducts("best-sellers", first);
  return picked.length ? picked : getProducts({ first, sortKey: "BEST_SELLING" });
}
