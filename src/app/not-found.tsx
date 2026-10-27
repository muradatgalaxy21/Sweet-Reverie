import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export const metadata: Metadata = { title: "Page not found" };

/** Branded 404 for unknown URLs and `notFound()` (missing product/collection). */
export default function NotFound() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-16 md:py-20 text-center">
      <Image
        src="/404-not-found/not-found-chocolate.svg"
        alt="A sad melted chocolate bar"
        width={600}
        height={600}
        className="w-56 md:w-64 h-auto mx-auto mb-4"
      />
      <p className="text-sm font-black tracking-widest text-amber-600">404</p>
      <h1 className="mt-2 font-serif text-3xl md:text-4xl font-bold text-[#662A37]">
        Oops! This treat doesn&apos;t exist…
      </h1>
      <p className="mt-3 text-stone-600">
        Someone may have eaten it already. Plenty more sweets are waiting for you.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center bg-[#4A1A25] hover:bg-[#662A37] text-white text-xs font-extrabold tracking-widest uppercase px-8 py-3 rounded-full shadow-md transition-all hover:scale-105 active:scale-95"
      >
        Continue shopping
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
    </section>
  );
}
