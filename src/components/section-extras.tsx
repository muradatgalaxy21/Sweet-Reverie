import React from "react";

/** Gold rule with a centered diamond, placed between homepage sections. */
export function SectionDivider() {
  return (
    <div className="max-w-xs mx-auto flex items-center gap-3 px-4" aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4AF7A]" />
      <span className="h-2.5 w-2.5 rotate-45 bg-[#D4AF7A]" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4AF7A]" />
    </div>
  );
}

/** Suspense fallback for homepage product sections. */
export function ProductGridSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" aria-busy="true" aria-label="Loading products">
      <div className="mx-auto my-6 h-16 max-w-md rounded-full bg-stone-200/70 animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="rounded-2xl border border-[#ECA58A]/40 bg-white p-4 animate-pulse">
            <div className="aspect-square rounded-xl bg-stone-200/70" />
            <div className="mt-3 h-3 rounded bg-stone-200/70" />
            <div className="mt-2 h-3 w-2/3 rounded bg-stone-200/70" />
            <div className="mt-4 h-9 rounded-xl bg-stone-200/70" />
          </div>
        ))}
      </div>
    </div>
  );
}
