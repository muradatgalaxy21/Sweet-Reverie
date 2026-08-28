import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-primary"
        >
          MAW-Choco-Shop
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 overflow-x-auto lg:flex">
          <Link
            href="/"
            className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
          >
            Home
          </Link>
          {CATEGORIES.map((category) => (
            <Link
              key={category.handle}
              href={`/collections/${category.handle}`}
              className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
            >
              {category.title}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Cart"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 hover:bg-secondary hover:text-foreground"
        >
          <ShoppingCart className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t px-4 py-2 sm:px-6 lg:hidden">
        <Link
          href="/"
          className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-foreground/70 hover:bg-secondary hover:text-foreground"
        >
          Home
        </Link>
        {CATEGORIES.map((category) => (
          <Link
            key={category.handle}
            href={`/collections/${category.handle}`}
            className="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-foreground/70 hover:bg-secondary hover:text-foreground"
          >
            {category.title}
          </Link>
        ))}
      </nav>
    </header>
  );
}
