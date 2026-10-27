import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges multiple class values and resolves Tailwind class conflicts.
 * 1. Takes variable class values.
 * 2. Conditionally resolves them via clsx.
 * 3. Deduplicates and merges Tailwind conflicts via twMerge.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a numeric price into Pakistani Rupee currency string.
 * 1. Accepts numeric value.
 * 2. Formats with thousands comma separation and standard Rs. prefix.
 */
export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Public site origin for canonical URLs, sitemap and JSON-LD. NEXT_PUBLIC_SITE_URL overrides; otherwise
 * Vercel's production domain (the primary custom domain once one is assigned, else *.vercel.app).
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  "http://localhost:3000";

/** Site-wide Open Graph fields. A page that sets its own `openGraph` replaces the root one, so spread these in. */
export const OPEN_GRAPH_DEFAULTS = {
  type: "website",
  locale: "en_PK",
  siteName: "Sweet Reverie",
} as const;

/**
 * Animated shimmer SVG for `<Image placeholder={SHIMMER}>`: shows a skeleton sweep in the
 * image's box until it loads, instead of empty space or a spinner.
 */
export const SHIMMER: `data:image/${string}` = `data:image/svg+xml;base64,${btoa(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" preserveAspectRatio="none"><defs><linearGradient id="g"><stop stop-color="#F5EDE4" offset="20%"/><stop stop-color="#FDF8F3" offset="50%"/><stop stop-color="#F5EDE4" offset="80%"/></linearGradient></defs><rect width="400" height="400" fill="#F5EDE4"/><rect width="400" height="400" fill="url(#g)"><animate attributeName="x" from="-400" to="400" dur="1.2s" repeatCount="indefinite"/></rect></svg>`,
)}`;
