import React from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * SpecialOffersBanner matching the luxury split section from the design mockup.
 * 1. Deep espresso chocolate noir background (#24120B).
 * 2. Left: Gold serif typography ("Special Offers", "Shop Now", "upto 40% off").
 * 3. Right: Multi-product showcase of premium imported treats.
 */
const SPARKLES = [
  { pos: { top: "-10%", left: "-12%" }, size: "1.5rem", delay: "0s" },
  { pos: { top: "5%", right: "-14%" }, size: "1rem", delay: "0.6s" },
  { pos: { bottom: "0%", left: "40%" }, size: "0.9rem", delay: "1.2s" },
  { pos: { top: "-18%", right: "20%" }, size: "1.1rem", delay: "0.3s" },
];

export function SpecialOffersBanner() {
  const showcaseProducts = [
    { title: "Ferrero Rocher Box", src: "/products/1768309497-Ferrero-Rocher-T16-200g.webp" },
    { title: "Biscoff Spread", src: "/products/1752363437-Lotus-Biscoff-Spread-400g.webp" },
    { title: "Toblerone Deluxe", src: "/products/1750127147-Toblerone-Crunchy-Almond-Chocolate-Bar-100g.webp" },
    { title: "Milka Wafer Treat", src: "/products/1764068771-Redondo-Wafers-Sticks-Choco-Hazelnut-100g.webp" },
  ];

  return (
    <section id="special-offers" data-focus="light" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <div className="relative overflow-hidden rounded-3xl bg-[#4A1A25] border-4 border-[#D4AF7A] ring-1 ring-[#D4AF7A]/40 ring-offset-4 ring-offset-[#FAF7F2] shadow-2xl p-8 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Left Side: Luxury Gold Typography */}
        <div className="lg:w-1/2 text-center lg:text-left space-y-4 z-10">
          <div className="space-y-1">
            <h2 className="space-y-1 text-4xl md:text-6xl lg:text-7xl font-serif text-[#D4AF7A] drop-shadow-md tracking-tight">
              <span className="block">Special</span>
              <span className="block">Offers</span>
            </h2>
          </div>

          <div className="pt-2">
            <Link
              href="/#best-sellers"
              className="inline-block bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-sm md:text-base tracking-wider uppercase px-10 py-3.5 rounded-full shadow-lg ring-2 ring-[#D4AF7A]/60 transition-transform hover:scale-105"
            >
              Shop Now
            </Link>
          </div>

          <div className="pt-4 flex items-baseline justify-center lg:justify-start space-x-2">
            <span className="text-2xl md:text-4xl font-serif italic text-amber-200">
              upto
            </span>
            <span className="relative inline-block">
              {SPARKLES.map((s, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="absolute text-yellow-200 animate-pulse pointer-events-none drop-shadow-[0_0_6px_rgba(253,224,71,0.9)]"
                  style={{ ...s.pos, fontSize: s.size, animationDelay: s.delay }}
                >
                  ✦
                </span>
              ))}
            <span className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 drop-shadow-[0_4px_10px_rgba(245,158,11,0.5)]">
              40%
            </span>
            </span>
            <span className="text-2xl md:text-4xl font-serif italic text-amber-200">
              off
            </span>
          </div>
        </div>

        {/* Right Side: Product Showcase Montage */}
        <div className="lg:w-1/2 z-10 w-full flex items-center justify-center">
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {showcaseProducts.map((item, idx) => (
              <div
                key={idx}
                className="relative bg-white/95 rounded-2xl p-4 shadow-xl border border-amber-300/40 hover:scale-105 transition-transform duration-300 aspect-square flex items-center justify-center"
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="224px"
                  fetchPriority="low"
                  className="object-contain p-2"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
