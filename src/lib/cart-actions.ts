"use server";

import { cookies } from "next/headers";
import { shopifyFetch } from "./shopify";
import { PLACEHOLDER_IMAGE } from "./products";
import { Cart } from "./types";
import type {
  CartFieldsFragment,
  CartLinesAddMutation,
  CartLinesAddMutationVariables,
  CartLinesRemoveMutation,
  CartLinesRemoveMutationVariables,
  CartLinesUpdateMutation,
  CartLinesUpdateMutationVariables,
  CartQuery,
  CartQueryVariables,
  CreateCartMutation,
  CreateCartMutationVariables,
} from "./generated/storefront";

const CART_COOKIE = "cartId";

const CART_FIELDS = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            title
            price {
              amount
            }
            image {
              url
            }
            product {
              title
              featuredImage {
                url
              }
            }
          }
        }
      }
    }
  }
`;

const CART = /* GraphQL */ `
  query Cart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
  ${CART_FIELDS}
`;

const CREATE_CART = /* GraphQL */ `
  mutation CreateCart($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
  ${CART_FIELDS}
`;

const ADD_LINES = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
  ${CART_FIELDS}
`;

const UPDATE_LINES = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
  ${CART_FIELDS}
`;

const REMOVE_LINES = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        message
      }
    }
  }
  ${CART_FIELDS}
`;

type CartPayload = {
  cart?: CartFieldsFragment | null;
  userErrors: { message: string }[];
};

function toCart(cart: CartFieldsFragment): Cart {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    totalPrice: Number(cart.cost.subtotalAmount.amount),
    items: cart.lines.nodes.flatMap((line) => {
      const m = line.merchandise;
      if (!("product" in m)) return [];
      return {
        id: line.id,
        title: m.title === "Default Title" ? m.product.title : `${m.product.title} - ${m.title}`,
        price: Number(m.price.amount),
        quantity: line.quantity,
        imageUrl: m.image?.url ?? m.product.featuredImage?.url ?? PLACEHOLDER_IMAGE,
      };
    }),
  };
}

function unwrap(payload: CartPayload): Cart {
  if (payload.userErrors.length || !payload.cart) {
    throw new Error(payload.userErrors.map((e) => e.message).join("; ") || "Cart update failed");
  }
  return toCart(payload.cart);
}

const qty = (n: number) => Math.max(0, Math.floor(Number(n) || 0));

async function cartId() {
  return (await cookies()).get(CART_COOKIE)?.value;
}

/** The visitor's cart from the cart-ID cookie, or null if none / expired / checked out. */
export async function getCart(): Promise<Cart | null> {
  const id = await cartId();
  if (!id) return null;
  const data = await shopifyFetch<CartQuery, CartQueryVariables>(CART, { cartId: id }, { cache: false });
  return data.cart ? toCart(data.cart) : null;
}

/** Adds a variant to the cart, creating the cart (and its cookie) if there isn't a live one. */
export async function addToCart(variantId: string, quantity = 1): Promise<Cart> {
  const lines = [{ merchandiseId: variantId, quantity: Math.max(1, qty(quantity)) }];
  const existing = await getCart();

  if (existing) {
    const data = await shopifyFetch<CartLinesAddMutation, CartLinesAddMutationVariables>(
      ADD_LINES,
      { cartId: existing.id, lines },
      { cache: false }
    );
    return unwrap(data.cartLinesAdd!);
  }

  const data = await shopifyFetch<CreateCartMutation, CreateCartMutationVariables>(
    CREATE_CART,
    { lines },
    { cache: false }
  );
  const cart = unwrap(data.cartCreate!);
  (await cookies()).set(CART_COOKIE, cart.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 10, // Shopify drops idle carts after ~10 days
  });
  return cart;
}

/** Sets a line's quantity; 0 removes it. */
export async function updateCartLine(lineId: string, quantity: number): Promise<Cart> {
  const id = await cartId();
  if (!id) throw new Error("No cart");
  const data = await shopifyFetch<CartLinesUpdateMutation, CartLinesUpdateMutationVariables>(
    UPDATE_LINES,
    { cartId: id, lines: [{ id: lineId, quantity: qty(quantity) }] },
    { cache: false }
  );
  return unwrap(data.cartLinesUpdate!);
}

export async function removeCartLine(lineId: string): Promise<Cart> {
  const id = await cartId();
  if (!id) throw new Error("No cart");
  const data = await shopifyFetch<CartLinesRemoveMutation, CartLinesRemoveMutationVariables>(
    REMOVE_LINES,
    { cartId: id, lineIds: [lineId] },
    { cache: false }
  );
  return unwrap(data.cartLinesRemove!);
}
