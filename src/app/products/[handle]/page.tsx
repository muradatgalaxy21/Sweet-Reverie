import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductByHandle } from "@/lib/products";
import { ProductDetail } from "@/components/product-detail";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle({ handle });
  if (!product) return {};

  const title = product.seo?.title || product.title;
  const description =
    product.seo?.description || product.description || undefined;

  return {
    title,
    description,
    alternates: { canonical: `/products/${handle}` },
    openGraph: {
      title,
      description,
      images: product.featuredImage?.url
        ? [product.featuredImage.url as string]
        : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductByHandle({ handle });

  if (!product) notFound();

  const price = product.priceRange.minVariantPrice;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || undefined,
    image: product.featuredImage?.url ? [product.featuredImage.url as string] : undefined,
    url: `${SITE_URL}/products/${product.handle}`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: price.currencyCode,
      lowPrice: price.amount,
      availability: product.variants.edges.some((e) => e.node.availableForSale)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <main id="main-content" className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} />
    </main>
  );
}
