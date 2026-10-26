"use client";

import React, { useEffect, useId, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Product } from "@/lib/types";
import type { CollectionFilterOptions } from "@/lib/products";
import { loadCollectionProducts } from "@/lib/collection-actions";
import { CATEGORIES } from "@/lib/categories";
import {
  DEFAULT_QUERY,
  PRICE_PRESETS,
  SORT_OPTIONS,
  countFilters,
  parseCollectionQuery,
  toSearchString,
  type CollectionQuery,
  type SortValue,
} from "@/lib/collection-query";
import { useDialog } from "@/lib/use-dialog";
import { ProductCard } from "./product-card";

interface CollectionBrowserProps {
  handle: string;
  /** First page in the default order with no filters (the statically rendered view). */
  initialProducts: Product[];
  initialCursor: string | null;
  filterOptions: CollectionFilterOptions;
}

/**
 * Collection grid with sort + filters kept in the URL. Reads the URL on the client, so the page
 * itself stays static (ISR); the page renders `CollectionBrowser` without a URL as the Suspense
 * fallback, which is what lands in the static HTML.
 */
export function CollectionBrowserFromUrl(props: CollectionBrowserProps) {
  const searchParams = useSearchParams();
  return <CollectionBrowser {...props} initialSearch={searchParams.toString()} />;
}

/**
 * Sidebar filters (desktop) / filter drawer (mobile), sort select, product grid and "Load more".
 * Any non-default sort/filter is fetched through a server action; the default view uses the
 * server-rendered first page.
 */
export function CollectionBrowser({
  handle,
  initialProducts,
  initialCursor,
  filterOptions,
  initialSearch = "",
}: CollectionBrowserProps & { initialSearch?: string }) {
  const [query, setQuery] = useState(() => parseCollectionQuery(new URLSearchParams(initialSearch)));
  const startsFiltered = toSearchString(query) !== "";
  // null while the first page of a filtered URL is loading.
  const [products, setProducts] = useState<Product[] | null>(startsFiltered ? null : initialProducts);
  const [cursor, setCursor] = useState(startsFiltered ? null : initialCursor);
  const [error, setError] = useState(false);
  const [appending, setAppending] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  // Responses for an outdated query are dropped.
  const requestId = useRef(0);

  const fetchPage = (q: CollectionQuery, after?: string) => {
    const id = ++requestId.current;
    setAppending(Boolean(after));
    startTransition(async () => {
      setError(false);
      try {
        const page = await loadCollectionProducts(handle, toSearchString(q), after);
        if (id !== requestId.current) return;
        setProducts((prev) => (after && prev ? [...prev, ...page.products] : page.products));
        setCursor(page.nextCursor);
      } catch {
        if (id === requestId.current) setError(true);
      }
    });
  };

  // A shared/reloaded filtered URL: the static HTML has the default view, so fetch once on mount.
  const initialQuery = useRef(startsFiltered ? query : null);
  useEffect(() => {
    if (initialQuery.current) fetchPage(initialQuery.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyQuery = (next: CollectionQuery) => {
    setQuery(next);
    const search = toSearchString(next);
    window.history.replaceState(null, "", search ? `?${search}` : window.location.pathname);
    if (search) {
      fetchPage(next);
    } else {
      requestId.current++;
      setError(false);
      setProducts(initialProducts);
      setCursor(initialCursor);
    }
  };

  const clearAll = () => applyQuery({ ...DEFAULT_QUERY, sort: query.sort });
  const activeFilters = countFilters(query);
  const refreshing = isPending && !appending;

  return (
    <div className="lg:grid lg:grid-cols-[13rem_1fr] lg:gap-8">
      <aside aria-labelledby="filters-heading" className="hidden lg:block">
        <div className="flex items-baseline justify-between mb-4">
          <h2 id="filters-heading" className="text-sm font-black tracking-wider uppercase text-[#4A1A25]">
            Filters
          </h2>
          {activeFilters > 0 && <ClearButton onClick={clearAll} />}
        </div>
        <FilterPanel handle={handle} options={filterOptions} query={query} onChange={applyQuery} />
      </aside>

      <div>
        <div className="flex items-center justify-between gap-3 mb-5">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-haspopup="dialog"
            className="lg:hidden inline-flex items-center gap-2 border border-[#4A1A25]/30 rounded-full px-4 py-2 text-sm font-bold text-[#4A1A25] hover:bg-[#4A1A25]/5"
          >
            <SlidersHorizontal aria-hidden className="w-4 h-4" />
            Filters
            {activeFilters > 0 && (
              <span className="bg-[#4A1A25] text-white text-xs rounded-full min-w-5 h-5 px-1.5 inline-flex items-center justify-center">
                {activeFilters}
                <span className="sr-only"> active</span>
              </span>
            )}
          </button>

          <label className="ml-auto flex items-center gap-2 text-sm text-stone-600">
            <span>Sort by</span>
            <select
              value={query.sort}
              onChange={(e) => applyQuery({ ...query, sort: e.target.value as SortValue })}
              className="border border-stone-300 rounded-full bg-white px-3 py-2 text-sm font-semibold text-[#4A1A25]"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p role="status" className="sr-only">
          {refreshing ? "Loading products" : products ? `${products.length} products shown` : ""}
        </p>

        {error && (
          <p role="alert" className="mb-5 text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
            Couldn&apos;t load products. Please try again.
          </p>
        )}

        {products === null ? (
          !error && <p className="text-center text-stone-600 py-16">Loading products…</p>
        ) : products.length === 0 ? (
          activeFilters > 0 ? (
            <div className="text-center py-16">
              <p className="text-stone-600">No products match these filters.</p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-4 text-sm font-bold text-[#4A1A25] underline underline-offset-4"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-16">No products here yet — check back soon.</p>
          )
        ) : (
          <>
            <div
              aria-busy={refreshing}
              className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 transition-opacity ${refreshing ? "opacity-50" : ""}`}
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {cursor && (
              <div className="flex justify-center mt-8">
                <button
                  type="button"
                  onClick={() => fetchPage(query, cursor)}
                  disabled={isPending}
                  className="bg-[#4A1A25] hover:bg-[#662A37] text-white font-bold text-sm tracking-wider uppercase px-8 py-3 rounded-full shadow transition-colors disabled:opacity-60"
                >
                  {isPending && appending ? "Loading…" : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {drawerOpen && (
        <FilterDrawer
          onClose={() => setDrawerOpen(false)}
          onClear={activeFilters > 0 ? clearAll : undefined}
        >
          <FilterPanel handle={handle} options={filterOptions} query={query} onChange={applyQuery} />
        </FilterDrawer>
      )}
    </div>
  );
}

function ClearButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="text-xs font-bold text-[#4A1A25] underline underline-offset-4">
      Clear all
    </button>
  );
}

interface FilterPanelProps {
  /** Current collection, highlighted in the category list. */
  handle: string;
  options: CollectionFilterOptions;
  query: CollectionQuery;
  onChange: (query: CollectionQuery) => void;
}

const SECTION_HEADING = "text-xs font-black tracking-wider uppercase text-stone-600 mb-3";

/**
 * Availability, price (quick ranges + custom min/max), product type and category links.
 * Type is hidden until the collection has 2+ types.
 */
function FilterPanel({ handle, options, query, onChange }: FilterPanelProps) {
  const id = useId();
  // Selected types stay listed (so they can be unticked) even if Shopify no longer reports them.
  const types = [...new Set([...options.types, ...query.types])];

  const applyPrice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    params.set("min", String(form.get("min") ?? ""));
    params.set("max", String(form.get("max") ?? ""));
    const { minPrice, maxPrice } = parseCollectionQuery(params);
    onChange({ ...query, minPrice, maxPrice });
  };

  const toggleType = (type: string, checked: boolean) =>
    onChange({ ...query, types: checked ? [...query.types, type] : query.types.filter((t) => t !== type) });

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className={SECTION_HEADING}>Availability</legend>
        <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
          <input
            type="checkbox"
            checked={query.inStock}
            onChange={(e) => onChange({ ...query, inStock: e.target.checked })}
            className="w-4 h-4 accent-[#4A1A25]"
          />
          In stock only
        </label>
      </fieldset>

      <form onSubmit={applyPrice} aria-labelledby={`${id}-price`}>
        <h3 id={`${id}-price`} className={SECTION_HEADING}>
          Price (Rs.)
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {PRICE_PRESETS.map((preset) => {
            const minPrice = "minPrice" in preset ? preset.minPrice : undefined;
            const maxPrice = "maxPrice" in preset ? preset.maxPrice : undefined;
            const active = query.minPrice === minPrice && query.maxPrice === maxPrice;
            return (
              <button
                key={preset.label}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  onChange({ ...query, minPrice: active ? undefined : minPrice, maxPrice: active ? undefined : maxPrice })
                }
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-[#4A1A25] border-[#4A1A25] text-white"
                    : "border-stone-300 bg-white text-stone-700 hover:border-[#4A1A25]"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        {/* Keyed on the applied range so "Clear all" resets the inputs. */}
        <div key={`${query.minPrice}-${query.maxPrice}`} className="flex items-center gap-2">
          <PriceInput
            name="min"
            label="Minimum price"
            defaultValue={query.minPrice}
            placeholder={options.priceRange ? Math.floor(options.priceRange.min) : 0}
          />
          <span aria-hidden className="text-stone-500">–</span>
          <PriceInput
            name="max"
            label="Maximum price"
            defaultValue={query.maxPrice}
            placeholder={options.priceRange ? Math.ceil(options.priceRange.max) : undefined}
          />
        </div>
        <button
          type="submit"
          className="mt-3 w-full border border-[#4A1A25] text-[#4A1A25] hover:bg-[#4A1A25] hover:text-white rounded-full py-1.5 text-xs font-bold tracking-wider uppercase transition-colors"
        >
          Apply
        </button>
      </form>

      {types.length >= 2 && (
        <fieldset>
          <legend className={SECTION_HEADING}>Product type</legend>
          <div className="space-y-2">
            {types.map((type) => (
              <label key={type} className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={query.types.includes(type)}
                  onChange={(e) => toggleType(type, e.target.checked)}
                  className="w-4 h-4 accent-[#4A1A25]"
                />
                {type}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <nav aria-labelledby={`${id}-categories`}>
        <h3 id={`${id}-categories`} className={SECTION_HEADING}>
          Categories
        </h3>
        <ul className="space-y-1.5">
          {CATEGORIES.map((category) => {
            const current = category.handle === handle;
            return (
              <li key={category.handle}>
                <Link
                  href={`/collections/${category.handle}`}
                  aria-current={current ? "page" : undefined}
                  className={`text-sm capitalize ${
                    current ? "font-bold text-[#4A1A25]" : "text-stone-700 hover:text-[#4A1A25] hover:underline"
                  }`}
                >
                  {category.title.toLowerCase()}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

function PriceInput({
  name,
  label,
  defaultValue,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: number;
  placeholder?: number;
}) {
  return (
    <input
      type="number"
      name={name}
      aria-label={label}
      inputMode="numeric"
      min={0}
      defaultValue={defaultValue}
      placeholder={placeholder === undefined ? (name === "min" ? "Min" : "Max") : String(placeholder)}
      className="w-full min-w-0 border border-stone-300 rounded-lg bg-white px-2 py-1.5 text-sm"
    />
  );
}

/** Mobile filter panel, slides in from the left. */
function FilterDrawer({
  onClose,
  onClear,
  children,
}: {
  onClose: () => void;
  onClear?: () => void;
  children: React.ReactNode;
}) {
  const panelRef = useDialog<HTMLDivElement>(true, onClose);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
      <div onClick={onClose} aria-hidden className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-drawer-title"
        tabIndex={-1}
        className="fixed inset-y-0 left-0 w-[85vw] max-w-xs bg-[#FAF7F2] focus:outline-none shadow-2xl flex flex-col animate-in slide-in-from-left duration-300"
      >
        <div data-focus="light" className="px-5 py-4 bg-[#662A37] text-white flex items-center justify-between">
          <h2 id="filter-drawer-title" className="text-base font-black tracking-wider uppercase">
            Filters
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:text-amber-300 transition-colors"
            aria-label="Close filters"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        <div className="p-4 border-t border-stone-200 flex items-center gap-3">
          {onClear && <ClearButton onClick={onClear} />}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto bg-[#4A1A25] hover:bg-[#662A37] text-white font-bold text-sm tracking-wider uppercase px-6 py-2.5 rounded-full"
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
}
