"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useDialog } from "@/lib/use-dialog";
import { formatPrice } from "@/lib/utils";

/**
 * Slide-over CartDrawer component.
 * 1. Animated side-panel accessible across all views.
 * 2. Real-time quantity mutations (+ / -) and item removal.
 * 3. Subtotal price computation and checkout trigger.
 */
export function CartDrawer() {
  const { cart, isOpen, isPending, error, closeCart, updateQuantity, removeItem } = useCart();
  const items = cart?.items ?? [];
  const panelRef = useDialog<HTMLDivElement>(isOpen, closeCart);

  // Prevent background body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed backdrop */}
      <div
        onClick={closeCart}
        aria-hidden
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-title"
          tabIndex={-1}
          className="w-screen max-w-md bg-[#FAF7F2] focus:outline-none shadow-2xl flex flex-col justify-between border-l-2 border-[#ECA58A] animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div data-focus="light" className="p-6 bg-[#662A37] text-white flex items-center justify-between border-b border-amber-500/20">
            <div className="flex items-center space-x-2">
              <ShoppingBag aria-hidden className="w-5 h-5 text-amber-300" />
              <h2 id="cart-title" className="text-base font-black tracking-wider uppercase">
                Your Cart ({cart?.totalQuantity ?? 0})
              </h2>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-1 hover:text-amber-300 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Line Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {error && (
              <p role="alert" className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
                {error}
              </p>
            )}
            {items.length === 0 && isPending ? (
              <p className="text-center py-16 text-sm font-semibold text-stone-500">Updating your cart...</p>
            ) : items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-[#662A37]/10 text-[#662A37] rounded-full mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-stone-800">
                  Your cart is empty
                </h3>
                <p className="text-xs text-stone-600 max-w-xs mx-auto">
                  Looks like you haven&apos;t added any delicious chocolates or snacks yet.
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="inline-block bg-[#F59E0B] hover:bg-[#E68A00] text-black font-extrabold text-xs uppercase tracking-wider px-6 py-2.5 rounded-full shadow"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-3 bg-white rounded-2xl border border-stone-200 shadow-sm"
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 bg-stone-50 rounded-xl overflow-hidden flex-shrink-0 border border-stone-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="64px"
                      className="object-contain p-1"
                    />
                  </div>

                  {/* Metadata & Controls */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-stone-900 truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs font-extrabold text-[#662A37] mt-0.5">
                      {formatPrice(item.price)}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Modifier */}
                      <div className="flex items-center space-x-2 bg-stone-100 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={isPending}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-black rounded"
                          aria-label={`Decrease quantity of ${item.title}`}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-stone-800 px-1" aria-label={`Quantity ${item.quantity}`}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isPending}
                          className="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-black rounded"
                          aria-label={`Increase quantity of ${item.title}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        disabled={isPending}
                        className="text-stone-400 hover:text-red-600 p-1"
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout Button */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-stone-200 shadow-inner space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-stone-600">Subtotal:</span>
                <span className="text-lg font-black text-[#662A37]">
                  {formatPrice(cart?.totalPrice ?? 0)}
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Shipping rates and taxes calculated during checkout.
              </p>

              <button
                type="button"
                onClick={() => cart && window.location.assign(cart.checkoutUrl)}
                disabled={isPending}
                className="disabled:opacity-60 w-full bg-[#F59E0B] hover:bg-[#E68A00] text-black font-black text-sm uppercase tracking-wider py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
              >
                <span>PROCEED TO CHECKOUT</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
