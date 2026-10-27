"use client";

import React, { useEffect, useState } from "react";
import Image, { getImageProps } from "next/image";
import { preload } from "react-dom";
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
  /** Portrait crop of bgImage shown below md breakpoint, if different from the desktop image. */
  bgImageMobile?: string;
  /** Desktop bgImage has no baked-in text: render headline/subheadline/tagline over it (md+ only). */
  tagline?: string;
}

/**
 * Hero carousel component replicating the dynamic banners from the design mockup.
 * 1. Slide 1: Full-bleed "Exquisite Chocolate Reverie" brand banner (desktop text rendered as HTML over image).
 * 2. Slide 2: Feel The Fire / Spicy Snacks showcase with purple/amber backdrop.
 * 3. Slide 3: Colorful imported confections & treats explosion.
 * 4. Left/Right circular arrows and indicator pills.
 * 5. Automatic slide rotation every 6 seconds.
 */
/**
 * Portrait/landscape hero via <picture>: the browser downloads only the source matching
 * the viewport (two <Image>s toggled by CSS would fetch both on first paint).
 */
function ArtDirectedImage({
  desktopSrc,
  mobileSrc,
  alt,
  eager,
}: {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  eager: boolean;
}) {
  const common = { alt, fill: true, sizes: "100vw" };
  const {
    props: { srcSet: desktop, src: desktopFallback },
  } = getImageProps({ ...common, src: desktopSrc });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    ...common,
    sizes: "70vw",
    src: mobileSrc,
    loading: eager ? "eager" : "lazy",
    fetchPriority: eager ? "high" : "auto",
  });

  // Preload in <head> so the LCP image starts with the CSS instead of after it; `media` keeps
  // each viewport from fetching the other's image.
  if (eager) {
    preload(rest.src, { as: "image", imageSrcSet: mobile, imageSizes: "70vw", fetchPriority: "high", media: "(max-width: 767px)" });
    preload(desktopFallback, { as: "image", imageSrcSet: desktop, imageSizes: "100vw", fetchPriority: "high", media: "(min-width: 768px)" });
  }

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktop} sizes="100vw" />
      {/* 70vw caps phones at the 828w variant (~80KB vs 128KB at 1200w): the hero is the mobile LCP. */}
      <source srcSet={mobile} sizes="70vw" />
      <img {...rest} alt={alt} className="object-cover md:object-left" />
    </picture>
  );
}

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
      bgImage: "/hero/exquisite-chocolate-reverie-v4.png",
      tagline: "Fine confections • Since 2024",
      bgImageMobile: "/hero/exquisite-chocolate-reverie-mobile-view.jpeg",
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
  // Outgoing slide, rendered on top and faded out so the change is a true cross-fade.
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  const goTo = (index: number) => {
    if (index === currentSlide) return;
    setPrevSlide(currentSlide);
    setCurrentSlide(index);
  };
  const goPrev = () => goTo(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  const goNext = () => goTo((currentSlide + 1) % slides.length);

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => {
      setPrevSlide(currentSlide);
      setCurrentSlide((currentSlide + 1) % slides.length);
    }, 6000);
    return () => clearTimeout(id);
  }, [currentSlide, paused, slides.length]);

  const renderSlide = (active: HeroSlide, index: number, overlay: boolean) => (
      <div
        className={`relative overflow-hidden ${active.bgImage ? "" : `bg-gradient-to-r ${active.bgGradient}`} ${
          overlay
            ? "h-full"
            : active.bgImage && active.bgImageMobile
              ? "aspect-[1536/2752] md:aspect-auto md:min-h-[max(380px,calc(100svh-115px))]"
              : "min-h-[max(380px,calc(100svh-115px))]"
        } shadow-2xl flex flex-col justify-between p-6 md:p-12 text-white`}
      >
        {active.bgImage ? (
          /* Full-bleed banner: image carries headline/subheadline; CTA is a real button overlaid at the same spot. */
          <div className="absolute inset-0 z-10">
            {active.bgImageMobile ? (
              <ArtDirectedImage
                desktopSrc={active.bgImage}
                mobileSrc={active.bgImageMobile}
                alt={active.headline}
                eager={index === 0 && !overlay}
              />
            ) : (
              <Image
                src={active.bgImage}
                alt={active.headline}
                fill
                sizes="100vw"
                preload={index === 0 && !overlay}
                className="object-cover"
              />
            )}
            {active.tagline && (
              <div className="hidden md:block absolute left-[6%] top-[10%] max-w-[34%] text-[#5A1A25]">
                <h2 className="uppercase font-medium leading-[1.05] text-[clamp(2rem,min(4.5vw,7svh),6rem)]">
                  {active.headline}
                </h2>
                <p className="mt-[0.6em] text-[clamp(1rem,min(1.7vw,3svh),2.25rem)] leading-snug">{active.subheadline}.</p>
                <p className="mt-[1em] uppercase tracking-wide text-[clamp(0.75rem,min(1vw,1.8svh),1.25rem)]">
                  {active.tagline}
                </p>
              </div>
            )}
            <Link
              href={active.buttonLink}
              className="absolute left-1/2 -translate-x-1/2 bottom-[4%] md:left-[6%] md:bottom-[14%] md:translate-x-0 inline-flex items-center justify-center bg-[#F2871A] hover:bg-[#d9740f] text-black text-xs md:text-sm font-extrabold tracking-widest uppercase px-6 md:px-8 py-3 md:py-4 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.45)] ring-1 ring-black/10 transition-all hover:scale-105 hover:shadow-[0_10px_24px_rgba(0,0,0,0.55)] active:scale-95"
            >
              {active.buttonText}
            </Link>
          </div>
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
                    alt=""
                    fill
                    sizes="(min-width: 768px) 144px, 96px"
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

      </div>
  );

  return (
    <section
      id="hero"
      aria-roledescription="carousel"
      aria-label="Featured"
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {renderSlide(slides[currentSlide], currentSlide, false)}
      {prevSlide !== null && (
        <div
          key={currentSlide}
          aria-hidden
          className="absolute inset-0 z-30 pointer-events-none animate-hero-fade-out"
          onAnimationEnd={() => setPrevSlide(null)}
        >
          {renderSlide(slides[prevSlide], prevSlide, true)}
        </div>
      )}

        {/* Circular Navigation Arrows */}
        <button
          type="button"
          onClick={goPrev}
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-40 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/30 hover:bg-white text-black flex items-center justify-center backdrop-blur-md shadow-lg transition-all"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6 stroke-[3]" />
        </button>

        <button
          type="button"
          onClick={goNext}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-40 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/30 hover:bg-white text-black flex items-center justify-center backdrop-blur-md shadow-lg transition-all"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 flex">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className="flex h-6 min-w-6 items-center justify-center"
              aria-label={`Slide ${i + 1}`}
              aria-current={i === currentSlide || undefined}
            >
              <span
                className={`block h-2.5 rounded-full transition-all duration-300 ${
                  i === currentSlide ? "w-8 bg-amber-400" : "w-2.5 bg-white/50"
                }`}
              />
            </button>
          ))}
        </div>
    </section>
  );
}
