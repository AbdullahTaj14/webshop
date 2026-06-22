"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PriceRangeSlider } from "./price-range-slider";
import { categories } from "@/constants/categories";
import { brands, allColors, allSizes, priceBounds } from "@/constants/products";
import { cn } from "@/lib/utils";

function useFilterParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return { searchParams, update };
}

export function FiltersSidebar() {
  const { searchParams, update } = useFilterParams();

  const selectedCategories = searchParams.get("category")?.split(",").filter(Boolean) ?? [];
  const selectedBrands = searchParams.get("brand")?.split(",").filter(Boolean) ?? [];
  const selectedColors = searchParams.get("color")?.split(",").filter(Boolean) ?? [];
  const selectedSizes = searchParams.get("size")?.split(",").filter(Boolean) ?? [];
  const minPrice = Number(searchParams.get("minPrice") ?? priceBounds.min);
  const maxPrice = Number(searchParams.get("maxPrice") ?? priceBounds.max);

  function toggleValue(key: string, value: string, current: string[]) {
    update((params) => {
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      if (next.length) params.set(key, next.join(","));
      else params.delete(key);
    });
  }

  function clearAll() {
    update((params) => {
      ["category", "brand", "color", "size", "minPrice", "maxPrice", "q"].forEach((k) =>
        params.delete(k)
      );
    });
  }

  const hasActiveFilters = Boolean(
    selectedCategories.length ||
      selectedBrands.length ||
      selectedColors.length ||
      selectedSizes.length ||
      searchParams.get("minPrice") ||
      searchParams.get("maxPrice")
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground">Filters</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-muted underline-offset-2 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterGroup title="Category">
        {categories.map((c) => (
          <FilterCheckbox
            key={c.id}
            id={`category-${c.slug}`}
            label={c.name}
            checked={selectedCategories.includes(c.slug)}
            onChange={() => toggleValue("category", c.slug, selectedCategories)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Price">
        <PriceRangeSlider
          min={priceBounds.min}
          max={priceBounds.max}
          value={[minPrice, maxPrice]}
          onChange={([nextMin, nextMax]) =>
            update((params) => {
              params.set("minPrice", String(nextMin));
              params.set("maxPrice", String(nextMax));
            })
          }
        />
      </FilterGroup>

      <FilterGroup title="Brand">
        {brands.map((b) => (
          <FilterCheckbox
            key={b}
            id={`brand-${b}`}
            label={b}
            checked={selectedBrands.includes(b)}
            onChange={() => toggleValue("brand", b, selectedBrands)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Color">
        <div className="flex flex-wrap gap-2">
          {allColors.map((c) => {
            const active = selectedColors.includes(c.name);
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => toggleValue("color", c.name, selectedColors)}
                aria-pressed={active}
                aria-label={c.name}
                title={c.name}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full ring-1 ring-border transition-all",
                  active && "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                )}
              >
                <span
                  className="size-6 rounded-full border border-black/10"
                  style={{ backgroundColor: c.hex }}
                />
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Size">
        <div className="flex flex-wrap gap-2">
          {allSizes.map((s) => {
            const active = selectedSizes.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleValue("size", s, selectedSizes)}
                aria-pressed={active}
                className={cn(
                  "flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm transition-colors",
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-foreground hover:border-border-strong"
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border pb-8 last:border-b-0 last:pb-0">
      <h3 className="mb-4 text-sm font-medium text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function FilterCheckbox({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      <Label htmlFor={id} className="cursor-pointer text-sm font-normal text-secondary">
        {label}
      </Label>
    </div>
  );
}
