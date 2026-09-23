import React from "react";
import { HeroCarousel } from "@/components/hero-carousel";
import { ShopByBrand } from "@/components/shop-by-brand";
import { NewArrivalsSection } from "@/components/new-arrivals-section";
import { ShopByCategory } from "@/components/shop-by-category";
import { SpecialOffersBanner } from "@/components/special-offers-banner";
import { BestSellersSection } from "@/components/best-sellers-section";
import { NewsletterBar } from "@/components/newsletter-bar";

/**
 * Sweet Reverie Homepage.
 * 1. HeroCarousel: Dynamic slider showcasing featured confections & spicy crunch.
 * 2. ShopByBrand: 18+ famous confectionery brand logos.
 * 3. NewArrivalsSection: 5-column new releases with dual price tags.
 * 4. ShopByCategory: 17 categories in 5-column framed cards with label pills.
 * 5. SpecialOffersBanner: Luxury split dark espresso banner with gold typography.
 * 6. BestSellersSection: Top trending imported items with quick add to cart.
 * 7. NewsletterBar: VIP email subscription strip.
 */
export default function HomePage() {
  return (
    <div className="space-y-6 pb-4">
      {/* 1. Hero Carousel */}
      <HeroCarousel />

      {/* 2. Shop By Brand */}
      <ShopByBrand />

      {/* 3. New Arrivals */}
      <NewArrivalsSection />

      {/* 4. Shop By Category */}
      <ShopByCategory />

      {/* 5. Special Offers Banner */}
      <SpecialOffersBanner />

      {/* 6. Our Best Sellers */}
      <BestSellersSection />

      {/* 7. Join Our Email List Bar */}
      <NewsletterBar />
    </div>
  );
}
