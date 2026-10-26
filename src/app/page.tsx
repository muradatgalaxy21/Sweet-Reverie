import React, { Suspense } from "react";
import { HeroCarousel } from "@/components/hero-carousel";
import { ShopByBrand } from "@/components/shop-by-brand";
import { NewArrivalsSection } from "@/components/new-arrivals-section";
import { ShopByCategory } from "@/components/shop-by-category";
import { SpecialOffersBanner } from "@/components/special-offers-banner";
import { BestSellersSection } from "@/components/best-sellers-section";
import { NewsletterBar } from "@/components/newsletter-bar";
import { TrustStrip } from "@/components/trust-strip";
import { Testimonials } from "@/components/testimonials";
import { SectionDivider, ProductGridSkeleton } from "@/components/section-extras";

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
    <div className="space-y-6 pb-4 reveal-sections">
      {/* 1. Hero Carousel */}
      <HeroCarousel />

      <TrustStrip />

      {/* 2. Shop By Brand */}
      <ShopByBrand />

      {/* 3. New Arrivals — peach band */}
      <div className="bg-[#FDF1EA] candy-pattern py-6">
        <Suspense fallback={<ProductGridSkeleton />}>
          <NewArrivalsSection />
        </Suspense>
      </div>

      {/* 4. Shop By Category */}
      <ShopByCategory />

      <SectionDivider />

      {/* 5. Special Offers Banner */}
      <SpecialOffersBanner />

      {/* 6. Our Best Sellers — peach band */}
      <div className="bg-[#FDF1EA] candy-pattern py-6">
        <Suspense fallback={<ProductGridSkeleton />}>
          <BestSellersSection />
        </Suspense>
      </div>

      {/* 7. Testimonials */}
      <Testimonials />

      <SectionDivider />

      {/* 8. Join Our Email List Bar */}
      <NewsletterBar />
    </div>
  );
}
