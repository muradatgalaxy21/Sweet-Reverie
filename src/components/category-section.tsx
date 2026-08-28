import Link from "next/link";
import { getCollectionByHandle } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export async function CategorySection({
  handle,
  title,
}: {
  handle: string;
  title: string;
}) {
  const collection = await getCollectionByHandle({ handle, first: 4 });
  const products = collection?.products.edges ?? [];

  if (products.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between rounded-2xl bg-primary px-5 py-3 text-primary-foreground">
        <h2 className="text-lg font-bold tracking-tight sm:text-xl">
          {title}
        </h2>
        <Link
          href={`/collections/${handle}`}
          className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground"
        >
          View all &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {products.map(({ node }) => (
          <ProductCard key={node.id} product={node} />
        ))}
      </div>
    </section>
  );
}
