import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export const metadata: Metadata = { title: "Page not found" };

/** Branded 404 for unknown URLs and `notFound()` (missing product/collection). */
export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
      <p className="text-xs font-black uppercase tracking-widest text-[#662A37]">404</p>
      <h1 className="mt-2 text-3xl md:text-5xl font-serif text-[#4A1A25] tracking-tight">
        Page not found
      </h1>
      <p className="mt-4 text-sm md:text-base text-stone-600">
        This page may have moved or no longer exists. Our sweets are still here, though.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block bg-[#4A1A25] hover:bg-[#662A37] text-white font-bold text-sm tracking-wider uppercase px-8 py-3 rounded-full shadow transition-colors"
      >
        Back to home
      </Link>

      <h2 className="mt-12 text-xs font-black uppercase tracking-wider text-[#662A37]">
        Popular categories
      </h2>
      <ul className="mt-3 flex flex-wrap justify-center gap-2">
        {CATEGORIES.slice(0, 6).map((category) => (
          <li key={category.id}>
            <Link
              href={`/collections/${category.handle}`}
              className="block px-4 py-2 bg-white hover:bg-[#ECA58A]/20 border border-stone-200 rounded-full text-xs font-bold text-[#662A37]"
            >
              {category.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
