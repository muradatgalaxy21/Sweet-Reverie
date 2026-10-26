import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollectionPage } from "@/lib/products";
import { CollectionBrowser, CollectionBrowserFromUrl } from "@/components/collection-browser";

// Render each collection on first visit, then serve it statically with ISR (refreshed by the Shopify webhook, see api/revalidate).
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata(props: PageProps<"/collections/[handle]">): Promise<Metadata> {
  const { handle } = await props.params;
  // Same arguments as the page, so the two calls share one Storefront request.
  const collection = await getCollectionPage(handle, { withFilters: true });
  if (!collection) return {};
  return {
    title: collection.title,
    description: collection.description || undefined,
    alternates: { canonical: `/collections/${handle}` },
  };
}

/** Collection (PLP) page: burgundy title strip + filters/sort + product grid with "Load more". */
export default async function CollectionPage(props: PageProps<"/collections/[handle]">) {
  const { handle } = await props.params;
  const collection = await getCollectionPage(handle, { withFilters: true });
  if (!collection) notFound();

  const browserProps = {
    handle,
    initialProducts: collection.products,
    initialCursor: collection.nextCursor,
    filterOptions: collection.filterOptions ?? { types: [], priceRange: null },
  };

  return (
    <div className="pb-10">
      <section className="relative bg-[#4A1A25] border-b-2 border-amber-500/40 bg-[radial-gradient(circle_at_center,rgba(212,175,122,0.18)_1.5px,transparent_1.5px)] bg-[length:22px_22px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 text-center">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs font-bold uppercase tracking-widest text-amber-100/70">
            <Link href="/" className="hover:text-[#D4AF7A]">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#D4AF7A]" aria-current="page">{collection.title}</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-serif text-[#D4AF7A] tracking-tight">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="mt-3 max-w-2xl mx-auto text-sm md:text-base text-amber-100/80">
              {collection.description}
            </p>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Sort/filters live in the URL, read on the client so the page stays static (ISR). */}
        <Suspense fallback={<CollectionBrowser {...browserProps} />}>
          <CollectionBrowserFromUrl key={handle} {...browserProps} />
        </Suspense>
      </section>
    </div>
  );
}
