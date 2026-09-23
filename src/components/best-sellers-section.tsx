import React from "react";
import { BEST_SELLERS } from "@/lib/products-data";
import { ProductCard } from "./product-card";
import { SectionBadge } from "./section-badge";

/**
 * BestSellersSection matching the design mockup layout.
 * 1. Displays notched ribbon badge OUR BEST SELLERS.
 * 2. Displays 5-column product card grid with dual pricing and Quick Add.
 */
export function BestSellersSection() {
  return (
    <section id="best-sellers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <SectionBadge title="OUR BEST SELLERS" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
        {BEST_SELLERS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
