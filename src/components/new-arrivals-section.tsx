import React from "react";
import { NEW_ARRIVALS } from "@/lib/products-data";
import { ProductCard } from "./product-card";
import { SectionBadge } from "./section-badge";

/**
 * NewArrivalsSection matching the design mockup layout.
 * 1. Displays notched ribbon badge NEW ARRIVALS.
 * 2. Displays 5-column product card grid with dual pricing.
 */
export function NewArrivalsSection() {
  return (
    <section id="new-arrivals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <SectionBadge title="NEW ARRIVALS" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
        {NEW_ARRIVALS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
