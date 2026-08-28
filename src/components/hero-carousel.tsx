"use client";

import * as React from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

// Placeholder promo slides — swap gradients for real banner images later.
const SLIDES = [
  {
    title: "Sweet Deals, Fast Delivery",
    subtitle: "Shop chocolates, candy & snacks — delivered to your door",
    className: "from-primary to-primary/70",
  },
  {
    title: "New Arrivals Every Week",
    subtitle: "Fresh drops across chocolate, jelly, chips & more",
    className: "from-accent to-accent/70",
  },
  {
    title: "Free Delivery on Orders Over Rs. 1500",
    subtitle: "More treats, less delivery fee",
    className: "from-primary/80 via-accent/70 to-primary",
  },
];

export function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="relative">
      <Carousel setApi={setApi} opts={{ loop: true }}>
        <CarouselContent>
          {SLIDES.map((slide) => (
            <CarouselItem key={slide.title}>
              <div
                className={cn(
                  "flex h-56 flex-col items-center justify-center gap-2 rounded-3xl bg-gradient-to-br px-6 text-center text-primary-foreground sm:h-72",
                  slide.className
                )}
              >
                <h2 className="text-2xl font-extrabold sm:text-4xl">
                  {slide.title}
                </h2>
                <p className="text-sm opacity-90 sm:text-base">
                  {slide.subtitle}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3" />
        <CarouselNext className="right-3" />
      </Carousel>

      <div className="mt-3 flex justify-center gap-2">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              index === current ? "w-6 bg-primary" : "bg-border"
            )}
          />
        ))}
      </div>
    </div>
  );
}
