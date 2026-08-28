import { notFound } from "next/navigation";
import { getCollectionByHandle } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = await getCollectionByHandle({ handle, first: 50 });

  if (!collection) notFound();

  const products = collection.products.edges;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {collection.title}
        </h1>
        {collection.description && (
          <p className="mt-1 text-muted-foreground">
            {collection.description}
          </p>
        )}
      </div>

      {products.length === 0 ? (
        <p className="text-muted-foreground">
          No products in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.map(({ node }) => (
            <ProductCard key={node.id} product={node} />
          ))}
        </div>
      )}
    </main>
  );
}
