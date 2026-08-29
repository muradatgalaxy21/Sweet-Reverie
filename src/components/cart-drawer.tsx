"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Loader2 } from "lucide-react";
import { useCart } from "./cart-provider";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";

export function CartDrawer() {
  const { cart, isOpen, isPending, closeCart, updateItem, removeItem } =
    useCart();

  const lines = cart?.lines.edges.map((e) => e.node) ?? [];

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-background shadow-xl transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Your cart</h2>
          <button
            type="button"
            aria-label="Close cart"
            onClick={closeCart}
            className="rounded-full p-1 hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {lines.length === 0 ? (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Your cart is empty.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-muted">
                    {line.merchandise.image ? (
                      <Image
                        src={line.merchandise.image.url as string}
                        alt={line.merchandise.image.altText ?? line.merchandise.product.title}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="text-sm font-medium leading-tight">
                      {line.merchandise.product.title}
                    </span>
                    {line.merchandise.title !== "Default Title" && (
                      <span className="text-xs text-muted-foreground">
                        {line.merchandise.title}
                      </span>
                    )}
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        disabled={isPending}
                        onClick={() =>
                          line.quantity > 1
                            ? updateItem(line.id, line.quantity - 1)
                            : removeItem(line.id)
                        }
                        className="flex h-6 w-6 items-center justify-center rounded-full border hover:bg-secondary disabled:opacity-50"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-4 text-center text-sm">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        disabled={isPending}
                        onClick={() => updateItem(line.id, line.quantity + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full border hover:bg-secondary disabled:opacity-50"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <span className="text-sm font-semibold">
                      {formatMoney(
                        line.cost.totalAmount.amount as string,
                        line.cost.totalAmount.currencyCode
                      )}
                    </span>
                    <button
                      type="button"
                      aria-label="Remove item"
                      disabled={isPending}
                      onClick={() => removeItem(line.id)}
                      className="text-xs text-muted-foreground hover:text-destructive disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t px-4 py-4">
            <div className="mb-3 flex items-center justify-between text-sm font-medium">
              <span>Subtotal</span>
              <span>
                {cart
                  ? formatMoney(
                      cart.cost.subtotalAmount.amount as string,
                      cart.cost.subtotalAmount.currencyCode
                    )
                  : "-"}
              </span>
            </div>
            <Button
              render={<Link href={(cart?.checkoutUrl as string) ?? "#"} />}
              size="lg"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Checkout"
              )}
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
