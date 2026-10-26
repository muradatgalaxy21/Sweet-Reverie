"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/lib/types";
import { ProductCard } from "./product-card";

const RANK_STYLES = [
  "bg-gradient-to-br from-yellow-300 to-amber-500 text-[#4A1A25]",
  "bg-gradient-to-br from-stone-100 to-stone-400 text-stone-800",
  "bg-gradient-to-br from-orange-300 to-orange-700 text-white",
];

/** Horizontal scroll-snap row of product cards; top 3 get #1–#3 rank badges. */
export function ProductRail({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) =>
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <div className="relative">
      <div ref={ref} className="flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory pt-3 pb-4 -mx-1 px-1">
        {products.map((product, i) => (
          <div key={product.id} className="relative flex-shrink-0 snap-start w-[46%] sm:w-[31%] lg:w-[19%]">
            {i < 3 && (
              <span
                className={`absolute -top-2 -left-2 z-20 flex h-9 w-9 items-center justify-center rounded-full text-sm font-black shadow-md ring-2 ring-white ${RANK_STYLES[i]}`}
              >
                #{i + 1}
              </span>
            )}
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      {(["left", "right"] as const).map((side) => (
        <button
          key={side}
          type="button"
          onClick={() => scroll(side === "left" ? -1 : 1)}
          aria-label={side === "left" ? "Scroll left" : "Scroll right"}
          className={`hidden md:flex absolute top-1/2 -translate-y-1/2 ${side === "left" ? "-left-5" : "-right-5"} z-20 h-10 w-10 items-center justify-center rounded-full bg-white text-[#662A37] shadow-lg border border-[#ECA58A] hover:bg-[#662A37] hover:text-white transition-colors`}
        >
          {side === "left" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      ))}
    </div>
  );
}
