"use server";

import { cookies } from "next/headers";
import {
  addCartLines,
  createCart,
  getCart,
  removeCartLines,
  updateCartLines,
  type CartFragment,
} from "./cart";

const CART_COOKIE = "cart_id";

export async function fetchCart(): Promise<CartFragment | null> {
  const cookieStore = await cookies();
  const id = cookieStore.get(CART_COOKIE)?.value;
  if (!id) return null;

  const cart = await getCart(id);
  return cart;
}

export async function addToCart(
  variantId: string,
  quantity: number = 1
): Promise<CartFragment | null> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;

  if (!cartId) {
    const result = await createCart([{ merchandiseId: variantId, quantity }]);
    if (result?.cart) {
      cookieStore.set(CART_COOKIE, result.cart.id, {
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
      });
    }
    return result?.cart ?? null;
  }

  const result = await addCartLines({
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  });
  return result?.cart ?? null;
}

export async function updateCartLine(
  lineId: string,
  quantity: number
): Promise<CartFragment | null> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;
  if (!cartId) return null;

  const result = await updateCartLines({
    cartId,
    lines: [{ id: lineId, quantity }],
  });
  return result?.cart ?? null;
}

export async function removeCartLine(
  lineId: string
): Promise<CartFragment | null> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;
  if (!cartId) return null;

  const result = await removeCartLines({ cartId, lineIds: [lineId] });
  return result?.cart ?? null;
}
