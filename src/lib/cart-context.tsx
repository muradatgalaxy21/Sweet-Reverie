"use client";

import React, { createContext, useContext, useState, useEffect, useTransition, ReactNode } from "react";
import { Cart } from "./types";
import { addToCart, getCart, removeCartLine, updateCartLine } from "./cart-actions";

interface CartContextType {
  cart: Cart | null;
  isOpen: boolean;
  /** True while a cart mutation is in flight. */
  isPending: boolean;
  error: string | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Client view of the Shopify cart. The cart itself lives in Shopify (ID in an httpOnly
 * cookie); every change goes through a server action that returns the updated cart.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getCart().then(setCart, () => {});
  }, []);

  const run = (action: () => Promise<Cart>) =>
    startTransition(async () => {
      setError(null);
      try {
        setCart(await action());
      } catch {
        setError("Couldn't update your cart. Please try again.");
      }
    });

  const addItem = (variantId: string, quantity = 1) => {
    setIsOpen(true);
    run(() => addToCart(variantId, quantity));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isPending,
        error,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        updateQuantity: (lineId, quantity) => run(() => updateCartLine(lineId, quantity)),
        removeItem: (lineId) => run(() => removeCartLine(lineId)),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
