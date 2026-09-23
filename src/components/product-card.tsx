"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

interface ProductCardProps {
  product: Product;
}

/**
 * ProductCard component matching the design mockup layout.
 * 1. Top right corner badge (Sale / New / Hot).
 * 2. High-res product image with smooth hover zoom.
 * 3. Title and dual price display (original vs sale).
 * 4. Full-width Add to Cart button triggering cart drawer.
 */
export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  return (
    <div className="product-card group relative h-full flex flex-col justify-between">
      {/* Corner Badge */}
      {product.badge && (
        <span
          className={`absolute top-3 right-3 z-10 text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-sm ${
            product.badge === "Sale"
              ? "bg-[#662A37] text-white"
              : product.badge === "Hot"
              ? "bg-red-600 text-white"
              : "bg-amber-400 text-black"
          }`}
        >
          {product.badge}
        </span>
      )}

      {/* Product Image Area */}
      <Link
        href={`/products/${product.handle}`}
        className="block relative w-full aspect-square bg-stone-50/80 rounded-xl overflow-hidden mb-3 p-3 flex items-center justify-center border border-stone-100"
      >
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Product Metadata */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/products/${product.handle}`}>
            <h3 className="text-xs md:text-sm font-bold text-stone-900 group-hover:text-[#662A37] transition-colors line-clamp-2 min-h-[2.5rem]">
              {product.title}
            </h3>
          </Link>

          {/* Pricing Row */}
          <div className="mt-2 mb-3">
            {product.compareAtPrice && (
              <span className="text-xs font-semibold text-stone-400 line-through mr-2">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            <span className="text-sm md:text-base font-extrabold text-[#662A37]">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full bg-[#F59E0B] hover:bg-[#E68A00] active:scale-95 text-black font-extrabold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
          <span>Add to cart</span>
        </button>
      </div>
    </div>
  );
}
