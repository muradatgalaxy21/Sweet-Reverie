import React from "react";
import Image from "next/image";
import { getBestSellers } from "@/lib/products";
import Link from "next/link";
import { ProductRail } from "./product-rail";

/**
 * BestSellersSection matching the design mockup layout.
 * 1. Displays OUR BEST SELLERS banner.
 * 2. Displays 5-column product card grid with dual pricing and Quick Add.
 */
export async function BestSellersSection() {
  const products = await getBestSellers();
  if (!products.length) return null;

  return (
    <section id="best-sellers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex justify-center my-4 md:my-6">
        <h2 className="sr-only">Our Best Sellers</h2>
        <Image
          src="/banners/our-best-sellers-banner-v2.webp"
          alt="Our Best Sellers"
          width={2323}
          height={730}
          sizes="(min-width: 768px) 512px, (min-width: 640px) 448px, 320px"
          fetchPriority="low"
          className="max-w-xs sm:max-w-md md:max-w-lg w-full h-auto object-contain drop-shadow-sm"
        />
      </div>

      <ProductRail products={products} />

      <div className="mt-6 text-center">
        <Link
          href="/collections/best-sellers"
          className="inline-flex items-center gap-1 text-sm font-extrabold uppercase tracking-wider text-[#662A37] border-b-2 border-[#D4AF7A] hover:text-[#F59E0B] hover:border-[#F59E0B] transition-colors"
        >
          View all →
        </Link>
      </div>
    </section>
  );
}
