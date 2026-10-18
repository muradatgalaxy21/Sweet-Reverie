"use client";

import { useEffect } from "react";
import Link from "next/link";
import { WHATSAPP_NUMBER } from "@/components/floating-whatsapp";

/**
 * Branded fallback when a page fails to render, e.g. the Storefront API is down on a
 * product's first-ever visit. Cached (ISR) pages keep serving their last good copy instead.
 */
export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
      <title>Something went wrong | Sweet Reverie</title>
      <h1 className="text-3xl md:text-5xl font-serif text-[#4A1A25] tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-4 text-sm md:text-base text-stone-600">
        We couldn&apos;t load this page. Please try again in a moment.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="bg-[#4A1A25] hover:bg-[#662A37] text-white font-bold text-sm tracking-wider uppercase px-8 py-3 rounded-full shadow transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border-2 border-[#4A1A25] text-[#4A1A25] hover:bg-[#4A1A25] hover:text-white font-bold text-sm tracking-wider uppercase px-8 py-2.5 rounded-full transition-colors"
        >
          Back to home
        </Link>
      </div>
      <p className="mt-8 text-xs text-stone-600">
        Want to order now?{" "}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-[#0E7A35] underline underline-offset-2"
        >
          Message us on WhatsApp
        </a>
      </p>
    </div>
  );
}
