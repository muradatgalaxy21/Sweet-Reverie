"use client";

import React, { useState, useTransition } from "react";
import { Product } from "@/lib/types";
import { loadMoreProducts } from "@/lib/collection-actions";
import { ProductCard } from "./product-card";

interface CollectionGridProps {
  handle: string;
  initialProducts: Product[];
  initialCursor: string | null;
}

/** Product grid for a collection page; "Load more" appends the next page via server action. */
export function CollectionGrid({ handle, initialProducts, initialCursor }: CollectionGridProps) {
  const [products, setProducts] = useState(initialProducts);
  const [cursor, setCursor] = useState(initialCursor);
  const [isPending, startTransition] = useTransition();

  const loadMore = () => {
    if (!cursor) return;
    startTransition(async () => {
      const next = await loadMoreProducts(handle, cursor);
      setProducts((prev) => [...prev, ...next.products]);
      setCursor(next.nextCursor);
    });
  };

  if (!products.length) {
    return (
      <p className="text-center text-muted-foreground py-16">
        No products here yet — check back soon.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {cursor && (
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={loadMore}
            disabled={isPending}
            className="bg-[#4A1A25] hover:bg-[#662A37] text-white font-bold text-sm tracking-wider uppercase px-8 py-3 rounded-full shadow transition-colors disabled:opacity-60"
          >
            {isPending ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </>
  );
}
