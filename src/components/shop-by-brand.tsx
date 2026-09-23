import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BRANDS } from "@/lib/products-data";
import { SectionBadge } from "./section-badge";

/**
 * ShopByBrand component displaying confectionery brand logos matching mockup.
 * 1. Displays notched ribbon badge header.
 * 2. Displays responsive multi-column grid of brand logo tiles.
 * 3. Supports hover scale animations and links to brand collections.
 */
export function ShopByBrand() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Notched Ribbon Header */}
      <SectionBadge title="SHOP BY BRAND" />

      {/* Brand Logos Grid */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-stone-200/80 shadow-md">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4 md:gap-6 items-center justify-items-center">
          {BRANDS.map((brand) => (
            <Link
              key={brand.id}
              href={`/collections/${brand.handle}`}
              className="group flex flex-col items-center justify-center p-3 w-full h-20 bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-lg hover:border-amber-300 hover:-translate-y-1 transition-all duration-300"
              title={brand.name}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={brand.logoUrl}
                  alt={`${brand.name} logo`}
                  fill
                  className="object-contain filter contrast-105 group-hover:scale-110 transition-transform duration-300 p-1"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
