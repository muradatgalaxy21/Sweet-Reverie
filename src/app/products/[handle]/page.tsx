import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollectionProducts, getProductByHandle, PLACEHOLDER_IMAGE } from "@/lib/products";
import { ProductDetail } from "@/components/product-detail";
import { ProductCard } from "@/components/product-card";
import { OPEN_GRAPH_DEFAULTS, SITE_URL } from "@/lib/utils";

// Render each product on first visit, then serve it statically with ISR (refreshed by the Shopify webhook, see api/revalidate).
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata(props: PageProps<"/products/[handle]">): Promise<Metadata> {
  const { handle } = await props.params;
  const product = await getProductByHandle(handle);
  if (!product) return {};
  const image = product.images.nodes[0]?.url;
  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description || undefined,
    alternates: { canonical: `/products/${handle}` },
    openGraph: { ...OPEN_GRAPH_DEFAULTS, ...(image && { images: [image] }) },
  };
}

/** Product detail page: breadcrumb, gallery + buy box, related products from the same collection. */
export default async function ProductPage(props: PageProps<"/products/[handle]">) {
  const { handle } = await props.params;
  const product = await getProductByHandle(handle);
  if (!product) notFound();

  const collection = product.collections.nodes[0];
  const related = collection
    ? (await getCollectionProducts(collection.handle, 6)).filter((p) => p.handle !== handle).slice(0, 5)
    : [];
  const images = product.images.nodes.length ? product.images.nodes : [{ url: PLACEHOLDER_IMAGE }];

  // Structured data for the default (first) variant.
  const variant = product.variants.nodes[0];
  const url = new URL(`/products/${handle}`, SITE_URL).href;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images.nodes.map((img) => img.url),
    description: product.description || undefined,
    sku: variant?.sku || undefined,
    url,
    offers: variant && {
      "@type": "Offer",
      price: variant.price.amount,
      priceCurrency: variant.price.currencyCode,
      availability: `https://schema.org/${variant.availableForSale ? "InStock" : "OutOfStock"}`,
      url,
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <script
        type="application/ld+json"
        // Escape "<" so store-authored text can't close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 text-xs md:text-sm text-stone-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-[#662A37]">
              Home
            </Link>
          </li>
          {collection && (
            <>
              <li aria-hidden>/</li>
              <li>
                <Link href={`/collections/${collection.handle}`} className="hover:text-[#662A37]">
                  {collection.title}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-stone-800 font-semibold line-clamp-1">
            {product.title}
          </li>
        </ol>
      </nav>

      <ProductDetail key={handle} product={product} images={images} />

      {collection && related.length > 0 && (
        <section className="mt-14">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-xl md:text-2xl font-serif text-[#4A1A25]">You may also like</h2>
            <Link
              href={`/collections/${collection.handle}`}
              className="text-sm font-bold text-[#662A37] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
