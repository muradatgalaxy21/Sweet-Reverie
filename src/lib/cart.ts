import { gql } from "graphql-request";
import { storefrontClient } from "./shopify";
import type {
  CartFragment,
  GetCartQuery,
  GetCartQueryVariables,
  CartCreateMutation,
  CartCreateMutationVariables,
  CartLinesAddMutation,
  CartLinesAddMutationVariables,
  CartLinesUpdateMutation,
  CartLinesUpdateMutationVariables,
  CartLinesRemoveMutation,
  CartLinesRemoveMutationVariables,
} from "./generated/storefront";

const CART_FRAGMENT = gql`
  fragment Cart on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              image {
                url
                altText
              }
              price {
                amount
                currencyCode
              }
              product {
                handle
                title
              }
            }
          }
        }
      }
    }
  }
`;

const GET_CART = gql`
  ${CART_FRAGMENT}
  query GetCart($id: ID!) {
    cart(id: $id) {
      ...Cart
    }
  }
`;

const CART_CREATE = gql`
  ${CART_FRAGMENT}
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...Cart
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_ADD = gql`
  ${CART_FRAGMENT}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...Cart
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_UPDATE = gql`
  ${CART_FRAGMENT}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...Cart
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_REMOVE = gql`
  ${CART_FRAGMENT}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...Cart
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export type { CartFragment };

export async function getCart(id: string): Promise<CartFragment | null> {
  const data = await storefrontClient.request<GetCartQuery>(GET_CART, {
    id,
  } satisfies GetCartQueryVariables);
  return data.cart ?? null;
}

export async function createCart(
  lines: CartCreateMutationVariables["lines"]
) {
  const data = await storefrontClient.request<CartCreateMutation>(
    CART_CREATE,
    { lines } satisfies CartCreateMutationVariables
  );
  return data.cartCreate;
}

export async function addCartLines(
  variables: CartLinesAddMutationVariables
) {
  const data = await storefrontClient.request<CartLinesAddMutation>(
    CART_LINES_ADD,
    variables
  );
  return data.cartLinesAdd;
}

export async function updateCartLines(
  variables: CartLinesUpdateMutationVariables
) {
  const data = await storefrontClient.request<CartLinesUpdateMutation>(
    CART_LINES_UPDATE,
    variables
  );
  return data.cartLinesUpdate;
}

export async function removeCartLines(
  variables: CartLinesRemoveMutationVariables
) {
  const data = await storefrontClient.request<CartLinesRemoveMutation>(
    CART_LINES_REMOVE,
    variables
  );
  return data.cartLinesRemove;
}
