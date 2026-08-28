import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/format";
import type { ProductCardFragment } from "@/lib/generated/storefront";

export function ProductCard({ product }: { product: ProductCardFragment }) {
  const price = product.priceRange.minVariantPrice;

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square w-full bg-muted">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url as string}
            alt={product.featuredImage.altText ?? product.title}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-contain p-4 transition-transform group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-foreground">
          {product.title}
        </h3>
        <p className="mt-auto text-sm font-semibold text-primary">
          {formatMoney(price.amount as string, price.currencyCode)}
        </p>
      </div>
    </Link>
  );
}
