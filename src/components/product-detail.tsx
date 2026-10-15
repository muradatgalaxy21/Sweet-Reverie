"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, MessageCircle } from "lucide-react";
import type { ProductDetail as ProductData } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { WHATSAPP_NUMBER } from "./floating-whatsapp";

interface ProductDetailProps {
  product: ProductData;
  /** Product images, with a placeholder substituted when Shopify has none. */
  images: { url: string; altText?: string | null }[];
}

/**
 * Product page body: image gallery, variant picker, price, stock, quantity, add to cart,
 * WhatsApp order link and description. Gallery thumbnails / option pickers only show
 * when there's more than one image / value to choose from.
 */
export function ProductDetail({ product, images }: ProductDetailProps) {
  const variants = product.variants.nodes;
  const { addItem } = useCart();

  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(variants[0]?.selectedOptions.map((o) => [o.name, o.value]) ?? [])
  );
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const findVariant = (choice: Record<string, string>) =>
    variants.find((v) => v.selectedOptions.every((o) => choice[o.name] === o.value));

  const variant = findVariant(selected);
  const price = Number(variant?.price.amount ?? 0);
  const compareAt = Number(variant?.compareAtPrice?.amount ?? 0);
  const onSale = compareAt > price;
  const inStock = variant?.availableForSale ?? false;
  const title = variants.length > 1 && variant ? `${product.title} - ${variant.title}` : product.title;

  // Option name -> distinct values, in variant order.
  const options = new Map<string, string[]>();
  for (const v of variants) {
    for (const o of v.selectedOptions) {
      const values = options.get(o.name) ?? [];
      if (!values.includes(o.value)) values.push(o.value);
      options.set(o.name, values);
    }
  }

  const selectValue = (name: string, value: string) => {
    const next = { ...selected, [name]: value };
    setSelected(next);
    // Jump the gallery to the chosen variant's image, if it has one.
    const idx = images.findIndex((img) => img.url === findVariant(next)?.image?.url);
    if (idx >= 0) setActiveImage(idx);
  };

  const handleAddToCart = () => {
    if (!variant) return;
    // ponytail: local cart keyed by variant id; replaced by Shopify cart lines in Phase 4
    addItem(
      {
        id: variant.id,
        handle: product.handle,
        title,
        price,
        imageUrl: images[activeImage].url,
        availableForSale: inStock,
      },
      quantity
    );
  };

  const whatsappText = encodeURIComponent(
    `Hello Sweet Reverie, I'd like to order ${quantity} x ${title}.`
  );

  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-12">
      {/* Gallery */}
      <div className="flex flex-col gap-3">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-stone-100 bg-stone-50/80">
          <Image
            src={images[activeImage].url}
            alt={images[activeImage].altText ?? product.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-contain p-6"
            priority
          />
          {onSale && (
            <span className="absolute top-4 right-4 bg-[#662A37] text-white text-xs font-extrabold tracking-wider uppercase px-3 py-1 rounded-full shadow-sm">
              Sale
            </span>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={img.url}
                type="button"
                onClick={() => setActiveImage(i)}
                aria-label={`Show image ${i + 1}`}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-stone-50 ${
                  i === activeImage ? "border-[#662A37] ring-2 ring-[#662A37]" : "border-stone-200"
                }`}
              >
                <Image src={img.url} alt="" fill sizes="64px" className="object-contain p-1" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-5">
        <h1 className="text-2xl md:text-4xl font-serif text-[#4A1A25] tracking-tight">
          {product.title}
        </h1>

        <div className="flex items-baseline gap-3">
          {onSale && (
            <span className="text-base font-semibold text-stone-400 line-through">
              {formatPrice(compareAt)}
            </span>
          )}
          <span className="text-2xl md:text-3xl font-extrabold text-[#662A37]">
            {formatPrice(price)}
          </span>
        </div>

        <span
          className={`w-fit text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
            inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}
        >
          {inStock ? "In stock" : "Out of stock"}
        </span>

        {[...options].map(([name, values]) =>
          values.length > 1 ? (
            <fieldset key={name}>
              <legend className="text-sm font-bold text-stone-700 mb-2">{name}</legend>
              <div className="flex flex-wrap gap-2">
                {values.map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selected[name] === value}
                    onClick={() => selectValue(name, value)}
                    className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                      selected[name] === value
                        ? "border-[#4A1A25] bg-[#4A1A25] text-white"
                        : "border-stone-300 bg-white hover:border-[#662A37]"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </fieldset>
          ) : null
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center justify-between rounded-xl border border-stone-300 sm:w-36">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="p-3 text-stone-600 hover:text-[#662A37] disabled:opacity-40"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold tabular-nums" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => q + 1)}
              className="p-3 text-stone-600 hover:text-[#662A37]"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!inStock}
            className="flex-1 bg-[#4A1A25] hover:bg-[#662A37] active:scale-95 text-white font-extrabold text-sm uppercase tracking-wider py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            {inStock ? "Add to cart" : "Out of stock"}
          </button>
        </div>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#25D366] text-[#128C3E] hover:bg-[#25D366] hover:text-white font-bold text-sm uppercase tracking-wider py-3 px-6 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Order on WhatsApp
        </a>

        {product.descriptionHtml.trim() && (
          <div
            className="mt-2 border-t border-stone-200 pt-5 text-sm leading-relaxed text-stone-700 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        )}
      </div>
    </div>
  );
}
