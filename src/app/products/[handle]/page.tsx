import { notFound } from "next/navigation";
import { getProductByHandle } from "@/lib/products";
import { ProductDetail } from "@/components/product-detail";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductByHandle({ handle });

  if (!product) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
      <ProductDetail product={product} />
    </main>
  );
}
