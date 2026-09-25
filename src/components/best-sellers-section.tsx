import React from "react";
import Image from "next/image";
import { BEST_SELLERS } from "@/lib/products-data";
import { ProductCard } from "./product-card";

/**
 * BestSellersSection matching the design mockup layout.
 * 1. Displays OUR BEST SELLERS banner.
 * 2. Displays 5-column product card grid with dual pricing and Quick Add.
 */
export function BestSellersSection() {
  return (
    <section id="best-sellers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex justify-center my-4 md:my-6">
        <h2 className="sr-only">Our Best Sellers</h2>
        <Image
          src="/banners/our-best-sellers-banner-v2.png"
          alt="Our Best Sellers"
          width={2323}
          height={730}
          className="max-w-xs sm:max-w-md md:max-w-lg w-full h-auto object-contain drop-shadow-sm"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
        {BEST_SELLERS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
