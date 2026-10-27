"use client";

import React, { useEffect, useState } from "react";
import Image, { getImageProps } from "next/image";
import { preload } from "react-dom";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSlide {
  id: string;
  /** Desktop headline lines; joined for alt text. */
  headline: string[];
  subheadline: string;
  tagline: string;
  buttonText: string;
  buttonLink: string;
  theme: keyof typeof THEMES;
  /** Text-free full-bleed background; headline/subheadline/tagline are HTML over it. */
  bgImage: string;
  /** Text-free portrait image shown below md; HTML text sits in its empty top zone. */
  bgImageMobile?: string;
}

const BTN =
  "inline-flex items-center justify-center whitespace-nowrap text-xs md:text-sm font-extrabold tracking-widest uppercase px-6 md:px-8 py-3 md:py-4 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.45)] ring-1 ring-black/10 transition-all hover:scale-105 hover:shadow-[0_10px_24px_rgba(0,0,0,0.55)] active:scale-95";

/** Per-slide text design, matched to the reference banners. */
const THEMES = {
  chocolate: {
    box: "md:left-[6%] md:top-[10%] md:max-w-[38%] text-left text-[#5A1A25]",
    sub: "",
    tagline: "",
    divider: false,
    btn: "bg-[#F2871A] hover:bg-[#d9740f] text-black",
  },
  fire: {
    box: "md:left-[12%] md:top-[13%] md:w-[28%] text-center text-white",
    sub: "text-white/90",
    tagline: "font-bold text-[#D4A35A]",
    divider: true,
    btn: "bg-[#F2871A] hover:bg-[#d9740f] text-black",
  },
  gift: {
    box: "md:left-[8%] md:top-[12%] md:w-[36%] text-center text-[#6B1A2C]",
    sub: "text-[#3A2A2A]",
    tagline: "font-bold text-[#B08A3E]",
    divider: true,
    btn: "bg-[#6B1A2C] hover:bg-[#4A1A25] text-white",
  },
} as const;

/**
 * Hero carousel component replicating the dynamic banners from the design mockup.
 * 1-3. Full-bleed text-free banners (chocolate / spicy snacks / gifting) with themed HTML text + CTA.
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
      headline: ["Exquisite Chocolate Reverie"],
      subheadline: "A curated collection for every sweet desire.",
      tagline: "Fine confections • Since 2024",
      buttonText: "SHOP ALL CHOCOLATES",
      buttonLink: "#new-arrivals",
      theme: "chocolate",
      // Next.js image optimizer rejects query strings on local images unless allow-listed in
      // next.config.ts, so bump the filename suffix (-v3, -v4, ...) instead of overwriting in place —
      // that's what actually busts the Next cache and the browser cache.
      bgImage: "/hero/exquisite-chocolate-reverie-v5.webp",
      bgImageMobile: "/hero/hero-carousel-image-1-mobile.webp",
    },
    {
      id: "slide-1",
      headline: ["Feel the", "Fire"],
      subheadline: "Bold crunch & fiery flavours from around the world.",
      tagline: "Extreme crunch • Imported heat",
      buttonText: "ORDER NOW",
      buttonLink: "#best-sellers",
      theme: "fire",
      bgImage: "/hero/hero-carousel-image-2.webp",
      bgImageMobile: "/hero/hero-carousel-image-2-mobile.webp",
    },
    {
      id: "slide-2",
      headline: ["The Art", "of Gifting"],
      subheadline: "Curated hampers for Eid, birthdays & every celebration.",
      tagline: "Hand-packed • Nationwide delivery",
      buttonText: "SHOP HAMPERS",
      buttonLink: "#new-arrivals",
      theme: "gift",
      bgImage: "/hero/hero-carousel-image-3.webp",
      bgImageMobile: "/hero/hero-carousel-image-3-mobile.webp",
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

  const renderSlide = (active: HeroSlide, index: number, overlay: boolean) => {
    const t = THEMES[active.theme];
    const alt = active.headline.join(" ");
    return (
      <div
        className={`relative overflow-hidden ${
          overlay
            ? "h-full"
            : active.bgImageMobile
              ? "aspect-[1536/2752] md:aspect-auto md:min-h-[max(380px,calc(100svh-115px))]"
              : "min-h-[max(380px,calc(100svh-115px))]"
        } shadow-2xl`}
      >
        <div className="absolute inset-0 z-10">
          {active.bgImageMobile ? (
            <ArtDirectedImage
              desktopSrc={active.bgImage}
              mobileSrc={active.bgImageMobile}
              alt={alt}
              eager={index === 0 && !overlay}
            />
          ) : (
            <Image
              src={active.bgImage}
              alt={alt}
              fill
              sizes="100vw"
              preload={index === 0 && !overlay}
              className="object-cover object-[78%_center] md:object-left"
            />
          )}
          {/* Desktop: text block with the CTA right under it. Mobile: text centred in the image's empty
              top zone; with a portrait image the CTA is pinned bottom. */}
          <div
            className={`absolute inset-0 md:inset-auto ${t.box} flex flex-col items-center ${active.bgImageMobile ? "pt-[10%]" : "pt-[12%]"} px-6 md:block md:p-0`}
          >
            <div className="max-md:text-center">
              {active.theme === "gift" && (
                <div aria-hidden className="mx-auto mb-[0.8em] flex w-[40%] items-center gap-2 text-[#B08A3E]">
                  <span className="h-px flex-1 bg-current" />
                  <span className="size-2 rotate-45 bg-current" />
                  <span className="h-px flex-1 bg-current" />
                </div>
              )}
              <h2
                className={`uppercase leading-[1.05] text-[clamp(2rem,min(5vw,8.5svh),6rem)] ${active.theme === "fire" ? "font-extrabold" : "font-medium"}`}
              >
                {active.theme === "fire" ? (
                  <>
                    <span className="block bg-gradient-to-b from-[#FFF4E0] to-[#E8CFA8] bg-clip-text text-transparent">
                      {active.headline[0]}
                    </span>
                    <span className="block text-[1.75em] leading-none text-[#FFC2C2] [text-shadow:0_0_18px_rgba(255,40,40,0.85),0_0_40px_rgba(255,0,0,0.5),4px_4px_0_#B3141B]">
                      {active.headline[1]}
                    </span>
                  </>
                ) : (
                  active.headline.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))
                )}
              </h2>
              <p className={`mt-[0.6em] text-[clamp(1rem,min(2vw,3.8svh),2.25rem)] leading-snug ${t.sub}`}>
                {active.subheadline}
              </p>
              {t.divider && <div aria-hidden className="mt-[1em] h-px bg-[#C9A35C]" />}
              <p className={`mt-[1em] uppercase tracking-wide text-[clamp(0.75rem,min(1.2vw,2.2svh),1.25rem)] ${t.tagline}`}>
                {active.tagline}
              </p>
            </div>
            <Link
              href={active.buttonLink}
              className={`${active.bgImageMobile ? "absolute left-1/2 -translate-x-1/2 bottom-[4%]" : "mt-6"} md:static md:translate-x-0 md:mt-[min(2.5vw,4svh)] ${BTN} ${t.btn}`}
            >
              {active.buttonText}
            </Link>
          </div>
        </div>
      </div>
    );
  };

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
