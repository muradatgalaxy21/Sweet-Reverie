"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { formatMoney } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { GetProductByHandleQuery } from "@/lib/generated/storefront";

type Product = NonNullable<GetProductByHandleQuery["product"]>;
type Variant = Product["variants"]["edges"][number]["node"];

export function ProductDetail({ product }: { product: Product }) {
  const images = product.images.edges.map((e) => e.node);
  const variants = product.variants.edges.map((e) => e.node);
  const optionNames = useMemo(
    () => Array.from(new Set(variants.flatMap((v) => v.selectedOptions.map((o) => o.name)))),
    [variants]
  );

  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const first = variants[0];
    return Object.fromEntries(
      first?.selectedOptions.map((o) => [o.name, o.value]) ?? []
    );
  });
  const [activeImage, setActiveImage] = useState(0);

  const selectedVariant: Variant | undefined = variants.find((v) =>
    v.selectedOptions.every((o) => selected[o.name] === o.value)
  );

  const price = selectedVariant?.price ?? product.priceRange.minVariantPrice;
  const inStock = selectedVariant
    ? selectedVariant.availableForSale
    : variants.some((v) => v.availableForSale);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border bg-muted">
          {images[activeImage] ? (
            <Image
              src={images[activeImage].url as string}
              alt={images[activeImage].altText ?? product.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain p-6"
              priority
            />
          ) : null}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={img.url as string}
                onClick={() => setActiveImage(i)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-muted ${
                  i === activeImage ? "ring-2 ring-primary" : ""
                }`}
              >
                <Image
                  src={img.url as string}
                  alt={img.altText ?? product.title}
                  fill
                  sizes="64px"
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {product.title}
        </h1>

        <p className="text-2xl font-semibold text-primary">
          {formatMoney(price.amount as string, price.currencyCode)}
        </p>

        <Badge variant={inStock ? "default" : "destructive"} className="w-fit">
          {inStock ? "In stock" : "Out of stock"}
        </Badge>

        {optionNames.map((name) => {
          const values = Array.from(
            new Set(
              variants.flatMap((v) =>
                v.selectedOptions
                  .filter((o) => o.name === name)
                  .map((o) => o.value)
              )
            )
          );
          if (values.length <= 1) return null;
          return (
            <div key={name} className="flex flex-col gap-2">
              <span className="text-sm font-medium">{name}</span>
              <div className="flex flex-wrap gap-2">
                {values.map((value) => (
                  <button
                    key={value}
                    onClick={() =>
                      setSelected((s) => ({ ...s, [name]: value }))
                    }
                    className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                      selected[name] === value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background hover:bg-muted"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        <Button size="lg" disabled={!inStock} className="mt-2 w-full sm:w-auto">
          {inStock ? "Add to cart" : "Out of stock"}
        </Button>

        {Boolean(product.descriptionHtml) && (
          <div
            className="prose prose-sm mt-4 max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{
              __html: product.descriptionHtml as string,
            }}
          />
        )}
      </div>
    </div>
  );
}
