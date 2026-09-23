import React from "react";
import { cn } from "@/lib/utils";

interface SectionBadgeProps {
  title: string;
  className?: string;
}

/**
 * Reusable notched ribbon badge matching the design mockup headers.
 * 1. Features yellow/amber gradient fill.
 * 2. Styled dark border with left and right notched ribbon cuts.
 * 3. Centered bold uppercase typography.
 */
export function SectionBadge({ title, className }: SectionBadgeProps) {
  return (
    <div className={cn("flex justify-center my-10", className)}>
      <div className="relative inline-flex items-center justify-center">
        {/* Left side triangle notch */}
        <div
          className="absolute -left-3 w-4 h-8 bg-black z-10"
          style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}
        />

        {/* Center Pill Badge */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-extrabold text-sm md:text-lg tracking-wider uppercase px-8 md:px-14 py-2 md:py-2.5 rounded-full border-2 border-black shadow-lg">
          {title}
        </div>

        {/* Right side triangle notch */}
        <div
          className="absolute -right-3 w-4 h-8 bg-black z-10"
          style={{ clipPath: "polygon(100% 0, 0 50%, 100% 100%)" }}
        />
      </div>
    </div>
  );
}
