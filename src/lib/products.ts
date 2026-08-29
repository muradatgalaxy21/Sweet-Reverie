import { gql } from "graphql-request";
import { storefrontClient } from "./shopify";
import type {
  GetProductsQuery,
  GetProductsQueryVariables,
  GetProductByHandleQuery,
  GetProductByHandleQueryVariables,
  GetCollectionsQuery,
  GetCollectionsQueryVariables,
  GetCollectionByHandleQuery,
  GetCollectionByHandleQueryVariables,
} from "./generated/storefront";

const PRODUCT_CARD_FRAGMENT = gql`
  fragment ProductCard on Product {
    id
    handle
    title
    featuredImage {
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
`;

const GET_PRODUCTS = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query GetProducts($first: Int = 20, $after: String) {
    products(first: $first, after: $after) {
      edges {
        cursor
        node {
          ...ProductCard
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const GET_PRODUCT_BY_HANDLE = gql`
  query GetProductByHandle($handle: String!) {
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
      featuredImage {
        url
        altText
        width
        height
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`;

const GET_COLLECTIONS = gql`
  query GetCollections($first: Int = 20) {
    collections(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

const GET_COLLECTION_BY_HANDLE = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query GetCollectionByHandle($handle: String!, $first: Int = 20, $after: String) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      seo {
        title
        description
      }
      image {
        url
        altText
        width
        height
      }
      products(first: $first, after: $after) {
        edges {
          cursor
          node {
            ...ProductCard
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export async function getProducts(variables: GetProductsQueryVariables = {}) {
  const data = await storefrontClient.request<GetProductsQuery>(
    GET_PRODUCTS,
    variables
  );
  return data.products;
}

export async function getProductByHandle(
  variables: GetProductByHandleQueryVariables
) {
  const data = await storefrontClient.request<GetProductByHandleQuery>(
    GET_PRODUCT_BY_HANDLE,
    variables
  );
  return data.product;
}

export async function getCollections(
  variables: GetCollectionsQueryVariables = {}
) {
  const data = await storefrontClient.request<GetCollectionsQuery>(
    GET_COLLECTIONS,
    variables
  );
  return data.collections;
}

export async function getCollectionByHandle(
  variables: GetCollectionByHandleQueryVariables
) {
  const data = await storefrontClient.request<GetCollectionByHandleQuery>(
    GET_COLLECTION_BY_HANDLE,
    variables
  );
  return data.collection;
}
