import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BRANDS } from "@/lib/products-data";

/**
 * ShopByBrand component displaying confectionery brand logos matching mockup.
 * 1. Displays notched ribbon badge header.
 * 2. Displays responsive multi-column grid of brand logo tiles.
 * 3. Supports hover scale animations and links to brand collections.
 */
const half = Math.ceil(BRANDS.length / 2);
const topRow = BRANDS.slice(0, half);
const bottomRow = BRANDS.slice(half);

export function ShopByBrand() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* First Heading: Shop by Brand Banner */}
      <div className="flex justify-center my-4 md:my-6">
        <h2 className="sr-only">Shop by Brand</h2>
        <Image
          src="/banners/shop-by-brand-banner-v4.png"
          alt="Shop by Brand"
          width={2268}
          height={641}
          priority
          className="max-w-xs sm:max-w-md md:max-w-lg w-full h-auto object-contain drop-shadow-sm"
        />
      </div>

      {/* Brand Logos Marquee */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen h-56 pt-4 overflow-hidden space-y-4 md:space-y-6">
        <BrandRow brands={topRow} direction="forward" />
        <BrandRow brands={bottomRow} direction="reverse" />
      </div>
    </section>
  );
}

function BrandRow({
  brands,
  direction,
}: {
  brands: typeof BRANDS;
  direction: "forward" | "reverse";
}) {
  return (
    <div
      className={
        direction === "forward" ? "animate-marquee" : "animate-marquee-reverse"
      }
    >
      {[...brands, ...brands].map((brand, i) => (
        <Link
          key={`${brand.id}-${i}`}
          href={`/collections/${brand.handle}`}
          className="group flex flex-col items-center justify-center p-3 mx-2 w-32 md:w-40 h-20 flex-shrink-0 bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-lg hover:border-[#662A37] hover:-translate-y-1 transition-all duration-300"
          title={brand.name}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={brand.logoUrl}
              alt={`${brand.name} logo`}
              fill
              className="object-contain filter contrast-105 scale-110 group-hover:scale-125 transition-transform duration-300 p-1"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
