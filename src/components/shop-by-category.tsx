import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { SectionBadge } from "./section-badge";

/**
 * ShopByCategory component replicating the 5-column category grid from the mockup.
 * 1. Notched ribbon title SHOP BY CATEGORY.
 * 2. 5-column responsive grid featuring all 17 categories.
 * 3. Double-border card framing and high-contrast bottom label pills.
 */
export function ShopByCategory() {
  return (
    <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <SectionBadge title="SHOP BY CATEGORY" />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
        {CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={`/collections/${category.handle}`}
            className="category-card-frame group block"
          >
            {/* Image Tile */}
            <div className="relative w-full aspect-square bg-gradient-to-b from-stone-50 to-white rounded-xl overflow-hidden mb-3 p-3 flex items-center justify-center">
              <Image
                src={category.imageUrl}
                alt={category.title}
                fill
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
