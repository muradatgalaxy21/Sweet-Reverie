"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { NEW_ARRIVALS, BEST_SELLERS } from "@/lib/products-data";
import { CATEGORIES } from "@/lib/categories";
import { formatPrice } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Instant Search Modal.
 * 1. Provides fast live keyword filtering on products and categories.
 * 2. Matches titles and handles.
 * 3. Shows rich preview results with direct links and prices.
 */
export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  const allProducts = [...NEW_ARRIVALS, ...BEST_SELLERS];
  const filteredProducts = query.trim()
    ? allProducts.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  const filteredCategories = query.trim()
    ? CATEGORIES.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex justify-center items-start pt-20 px-4">
      <div className="bg-[#FAF7F2] rounded-2xl max-w-2xl w-full p-6 shadow-2xl border-2 border-[#ECA58A] relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-black p-2"
          aria-label="Close search"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Search Input Bar */}
        <div className="relative mt-2">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-stone-400" />
          <input
            type="text"
            placeholder="Search chocolates, snacks, candies, drinks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-[#ECA58A] focus:border-[#662A37] rounded-full text-black placeholder:text-stone-400 focus:outline-none text-base shadow-inner"
          />
        </div>

        {/* Results Area */}
        <div className="mt-6 max-h-96 overflow-y-auto space-y-4">
          {query.trim() === "" ? (
            <div className="text-center py-8 text-stone-500 text-sm">
              Type above to search imported chocolates, candies, and snacks...
            </div>
          ) : filteredProducts.length === 0 && filteredCategories.length === 0 ? (
            <div className="text-center py-8 text-stone-500 text-sm">
              No confections found matching &quot;{query}&quot;. Try another search term!
            </div>
          ) : (
            <>
              {filteredProducts.length > 0 && (
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#662A37] mb-2">
                    Products
                  </h4>
                  <div className="space-y-2">
                    {filteredProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.handle}`}
                        onClick={onClose}
                        className="flex items-center space-x-4 p-2 bg-white hover:bg-amber-50/50 rounded-xl transition border border-stone-200"
                      >
                        <div className="w-12 h-12 relative flex-shrink-0 bg-stone-50 rounded-lg overflow-hidden">
                          <Image
                            src={product.imageUrl}
                            alt={product.title}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-stone-900 truncate">
                            {product.title}
                          </p>
                          <p className="text-xs font-semibold text-[#662A37]">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {filteredCategories.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#662A37] mb-2">
                    Categories
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {filteredCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/collections/${category.handle}`}
                        onClick={onClose}
                        className="p-3 bg-white hover:bg-[#ECA58A]/20 border border-stone-200 rounded-xl text-xs font-bold text-[#662A37] text-center"
                      >
                        {category.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
