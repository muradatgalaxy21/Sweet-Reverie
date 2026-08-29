import { getProducts } from "@/lib/products";
import { CATEGORIES } from "@/lib/categories";
import { HeroCarousel } from "@/components/hero-carousel";
import { ProductCard } from "@/components/product-card";
import { CategorySection } from "@/components/category-section";

export default async function Home() {
  const { edges } = await getProducts({ first: 8 });
  const featured = edges.slice(0, 4);
  const popular = edges.slice(4, 8);

  return (
    <main id="main-content" className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-6 sm:px-6">
      <HeroCarousel />

      {featured.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            Featured Products
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {featured.map(({ node }) => (
              <ProductCard key={node.id} product={node} />
            ))}
          </div>
        </section>
      )}

      {popular.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            Popular Right Now
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {popular.map(({ node }) => (
              <ProductCard key={node.id} product={node} />
            ))}
          </div>
        </section>
      )}

      {CATEGORIES.map((category) => (
        <CategorySection
          key={category.handle}
          handle={category.handle}
          title={category.title}
        />
      ))}
    </main>
  );
}
