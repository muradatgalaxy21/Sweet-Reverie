import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

/**
 * ShopByCategory component replicating the 5-column category grid from the mockup.
 * 1. SHOP BY CATEGORY banner.
 * 2. 5-column responsive grid featuring all 17 categories.
 * 3. Double-border card framing and high-contrast bottom label pills.
 */
export function ShopByCategory() {
  return (
    <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-center my-4 md:my-6">
        <h2 className="sr-only">Shop by Category</h2>
        <Image
          src="/banners/shop-by-category-banner-v1.png"
          alt="Shop by Category"
          width={2323}
          height={730}
          sizes="(min-width: 768px) 512px, (min-width: 640px) 448px, 320px"
          fetchPriority="low"
          className="max-w-xs sm:max-w-md md:max-w-lg w-full h-auto object-contain drop-shadow-sm"
        />
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:overflow-visible sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-5">
        {CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={`/collections/${category.handle}`}
            className="category-card-frame group block w-36 flex-shrink-0 snap-start sm:w-auto"
          >
            {/* Image Tile */}
            <div className="relative w-full aspect-square bg-gradient-to-b from-stone-50 to-white rounded-xl overflow-hidden mb-3 p-3 flex items-center justify-center">
              <Image
                src={category.imageUrl}
                alt={category.title}
                fill
                sizes="(min-width: 1280px) 256px, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                fetchPriority="low"
                className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Bottom Label Pill */}
            <div className="category-pill group-hover:brightness-110 transition-all">
              {category.title}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
