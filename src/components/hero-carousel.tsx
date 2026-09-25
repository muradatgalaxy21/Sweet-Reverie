"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSlide {
  id: string;
  badge?: string;
  headline: string;
  subheadline: string;
  buttonText: string;
  buttonLink: string;
  bgGradient: string;
  featuredImages: string[];
  /** Full-bleed background image with text/CTA baked in (skips the text/collage overlay below). */
  bgImage?: string;
}

/**
 * Hero carousel component replicating the dynamic banners from the design mockup.
 * 1. Slide 1: Full-bleed "Exquisite Chocolate Reverie" brand banner (text baked into image).
 * 2. Slide 2: Feel The Fire / Spicy Snacks showcase with purple/amber backdrop.
 * 3. Slide 3: Colorful imported confections & treats explosion.
 * 4. Left/Right circular arrows and indicator pills.
 * 5. Automatic slide rotation every 6 seconds.
 */
export function HeroCarousel() {
  const slides: HeroSlide[] = [
    {
      id: "slide-0",
      headline: "Exquisite Chocolate Reverie",
      subheadline: "A curated collection for every sweet desire",
      buttonText: "SHOP ALL CHOCOLATES",
      buttonLink: "#new-arrivals",
      bgGradient: "",
      featuredImages: [],
      // Next.js image optimizer rejects query strings on local images unless allow-listed in
      // next.config.ts, so bump the filename suffix (-v3, -v4, ...) instead of overwriting in place —
      // that's what actually busts the Next cache and the browser cache.
      bgImage: "/hero/exquisite-chocolate-reverie-v2.jpeg",
    },
    {
      id: "slide-1",
      badge: "EXTREME CRUNCH",
      headline: "FEEL THE FIRE",
      subheadline: "Explore intense crunch & spicy flavor explosions from around the world",
      buttonText: "ORDER NOW",
      buttonLink: "#best-sellers",
      bgGradient: "from-[#2A0845] via-[#4B1248] to-[#1F0429]",
      featuredImages: [
        "/products/1731906239-Takis.jpeg",
        "/products/1764072900-Samyang-3x-Hot-Chicken-Ramen-140g.jpeg",
        "/products/1784186392-WarheadsSuperSourTongueSplash.jpeg",
      ],
    },
    {
      id: "slide-2",
      badge: "SWEET REVERIE EXCLUSIVES",
      headline: "WORLD OF SWEET WONDERS",
      subheadline: "Hand-picked chocolates, gummies, crispy wafers & imported luxury hampers",
      buttonText: "ORDER NOW",
      buttonLink: "#new-arrivals",
      bgGradient: "from-[#FBBF24] via-[#F472B6] to-[#60A5FA]",
      featuredImages: [
        "/products/1768309497-Ferrero-Rocher-T16-200g.jpeg",
        "/products/1750122477-Lotus-Biscoff-250g.jpeg",
        "/products/1746690032-jelly.jpeg",
        "/products/1750127147-Toblerone-Crunchy-Almond-Chocolate-Bar-100g.jpeg",
      ],
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const active = slides[currentSlide];

  return (
    <section className="relative">
      <div
        className={`relative overflow-hidden ${active.bgImage ? "" : `bg-gradient-to-r ${active.bgGradient}`} min-h-[max(380px,calc(100svh-115px))] shadow-2xl transition-all duration-700 flex flex-col justify-between p-6 md:p-12 text-white`}
      >
        {active.bgImage ? (
          /* Full-bleed banner: image already carries headline, subheadline & CTA */
          <Link href={active.buttonLink} className="absolute inset-0 z-10" aria-label={active.headline}>
            <Image
              src={active.bgImage}
              alt={active.headline}
              fill
              priority={currentSlide === 0}
              className="object-cover"
            />
          </Link>
        ) : (
          <>
            {/* Decorative background flare */}
            <div className="absolute inset-0 bg-radial-gradient from-white/10 via-transparent to-black/40 pointer-events-none" />

            {/* Top Text Showcase */}
            <div className="relative z-10 text-center space-y-2 max-w-3xl mx-auto pt-2">
              {active.badge && (
                <span className="inline-block bg-amber-400 text-black text-[11px] md:text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full shadow-md">
                  {active.badge}
                </span>
              )}
              <h2 className="text-3xl md:text-6xl font-black tracking-tight text-yellow-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] font-sans">
                {active.headline}
              </h2>
              <p className="text-xs md:text-sm text-white/90 font-medium max-w-xl mx-auto drop-shadow-md">
                {active.subheadline}
              </p>
            </div>

            {/* Center Product Showcase Collage */}
            <div className="relative z-10 my-4 flex items-center justify-center space-x-3 md:space-x-6">
              {active.featuredImages.map((src, idx) => (
                <div
                  key={idx}
                  className="relative w-24 h-24 md:w-36 md:h-36 bg-white/95 rounded-2xl p-2 shadow-2xl border-2 border-white/60 transform hover:scale-110 transition-transform duration-300 flex-shrink-0"
                >
                  <Image
                    src={src}
                    alt="Featured confection"
                    fill
                    className="object-contain p-1 rounded-xl"
                  />
                </div>
              ))}
            </div>

            {/* Bottom CTA Button */}
            <div className="relative z-10 text-center pb-2">
              <Link
                href={active.buttonLink}
                className="inline-flex items-center justify-center bg-black hover:bg-[#662A37] text-white hover:text-amber-300 text-xs md:text-sm font-extrabold tracking-widest uppercase px-8 py-3 rounded-full border-2 border-amber-400/80 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {active.buttonText}
              </Link>
            </div>
          </>
        )}

        {/* Circular Navigation Arrows */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/30 hover:bg-white text-black flex items-center justify-center backdrop-blur-md shadow-lg transition-all"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6 stroke-[3]" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/30 hover:bg-white text-black flex items-center justify-center backdrop-blur-md shadow-lg transition-all"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentSlide(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === currentSlide ? "w-8 bg-amber-400" : "w-2.5 bg-white/50"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
