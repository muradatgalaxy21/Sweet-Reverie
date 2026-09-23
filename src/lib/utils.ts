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
