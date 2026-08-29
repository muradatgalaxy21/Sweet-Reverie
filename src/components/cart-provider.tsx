"use client";

import {
  createContext,
  useContext,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import {
  addToCart,
  removeCartLine,
  updateCartLine,
} from "@/lib/cart-actions";
import type { CartFragment } from "@/lib/cart";

type CartContextValue = {
  cart: CartFragment | null;
  isOpen: boolean;
  isPending: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number) => void;
  updateItem: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  initialCart,
  children,
}: {
  initialCart: CartFragment | null;
  children: ReactNode;
}) {
  const [cart, setCart] = useState(initialCart);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const addItem = (variantId: string, quantity: number = 1) => {
    startTransition(async () => {
      const result = await addToCart(variantId, quantity);
      setCart(result);
      setIsOpen(true);
    });
  };

  const updateItem = (lineId: string, quantity: number) => {
    startTransition(async () => {
      const result = await updateCartLine(lineId, quantity);
      setCart(result);
    });
  };

  const removeItem = (lineId: string) => {
    startTransition(async () => {
      const result = await removeCartLine(lineId);
      setCart(result);
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isPending,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        updateItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
