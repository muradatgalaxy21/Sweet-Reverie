import React from "react";
import Image from "next/image";
import { NEW_ARRIVALS } from "@/lib/products-data";
import { ProductCard } from "./product-card";

/**
 * NewArrivalsSection matching the design mockup layout.
 * 1. Displays NEW ARRIVALS banner.
 * 2. Displays 5-column product card grid with dual pricing.
 */
export function NewArrivalsSection() {
  return (
    <section id="new-arrivals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex justify-center my-4 md:my-6">
        <h2 className="sr-only">New Arrivals</h2>
        <Image
          src="/banners/new-arrivals-banner-v1.png"
          alt="New Arrivals"
          width={2323}
          height={730}
          className="max-w-xs sm:max-w-md md:max-w-lg w-full h-auto object-contain drop-shadow-sm"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
        {NEW_ARRIVALS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
