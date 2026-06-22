import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Pagination } from "@/components/ui/pagination";
import { ProductCard } from "@/components/ecommerce/product-card";
import { FiltersSidebar } from "@/components/shop/filters-sidebar";
import { MobileFiltersDrawer } from "@/components/shop/mobile-filters-drawer";
import { SortSelect } from "@/components/shop/sort-select";
import { ShopSearchInput } from "@/components/shop/shop-search-input";
import { productRepository } from "@/lib/data-source";
import { categories } from "@/constants/categories";
import type { ProductFilters, SortOption } from "@/types";

interface ShopPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function toArray(value: string | string[] | undefined): string[] | undefined {
  if (!value) return undefined;
  const arr = Array.isArray(value) ? value : value.split(",");
  return arr.filter(Boolean);
}

export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata> {
  const params = await searchParams;
  const categorySlug = toArray(params.category)?.[0];
  const category = categories.find((c) => c.slug === categorySlug);
  return {
    title: category ? category.name : "Shop all",
    description: category?.description ?? "Browse the full Aro catalog of audio, carry, wearables, apparel, home, and eyewear.",
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const filters: ProductFilters = {
    category: toArray(params.category),
    brand: toArray(params.brand),
    color: toArray(params.color),
    size: toArray(params.size),
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    query: typeof params.q === "string" ? params.q : undefined,
    sort: (typeof params.sort === "string" ? params.sort : "featured") as SortOption,
    page: params.page ? Number(params.page) : 1,
    perPage: 12,
  };

  const result = await productRepository.list(filters);
  const categorySlug = filters.category?.[0];
  const category = categories.find((c) => c.slug === categorySlug);

  function buildHref(page: number) {
    const next = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (!value) return;
      next.set(key, Array.isArray(value) ? value.join(",") : value);
    });
    next.set("page", String(page));
    return `/shop?${next.toString()}`;
  }

  return (
    <Container size="shell" className="py-10 lg:py-14">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: category ? "/shop" : undefined },
          ...(category ? [{ label: category.name }] : []),
        ]}
      />

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {category ? category.name : "All products"}
          </h1>
          <p className="mt-2 text-sm text-secondary">
            {result.total} {result.total === 1 ? "product" : "products"}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Suspense>
          <ShopSearchInput />
        </Suspense>
        <div className="flex items-center gap-3">
          <Suspense>
            <MobileFiltersDrawer />
          </Suspense>
          <Suspense>
            <SortSelect />
          </Suspense>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <Suspense>
              <FiltersSidebar />
            </Suspense>
          </div>
        </aside>

        <div>
          {result.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-24 text-center">
              <p className="text-base font-medium text-foreground">No products found</p>
              <p className="text-sm text-secondary">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
              {result.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            buildHref={buildHref}
            className="mt-16"
          />
        </div>
      </div>
    </Container>
  );
}
