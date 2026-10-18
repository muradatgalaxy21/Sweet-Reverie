import { shopifyFetch } from "./shopify";
import { sanitizeDescription } from "./sanitize";
import { Product } from "./types";
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
  query CollectionProducts($handle: String!, $first: Int!, $after: String) {
    collection(handle: $handle) {
      title
      description
      products(first: $first, after: $after) {
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

export interface CollectionPage {
  title: string;
  description: string;
  products: Product[];
  /** Cursor for the next page, or null when this is the last one. */
  nextCursor: string | null;
}

/** One page of a collection for `/collections/[handle]`; null if the collection doesn't exist. */
export async function getCollectionPage(
  handle: string,
  after?: string,
  first = 20
): Promise<CollectionPage | null> {
  const data = await shopifyFetch<CollectionProductsQuery, CollectionProductsQueryVariables>(
    COLLECTION_PRODUCTS,
    { handle, first, after }
  );
  const collection = data.collection;
  if (!collection) return null;
  const { nodes, pageInfo } = collection.products;
  return {
    title: collection.title,
    description: collection.description,
    products: nodes.map(toProduct),
    nextCursor: pageInfo.hasNextPage ? pageInfo.endCursor ?? null : null,
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
