import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

export function FeaturedCollections({ categories }: { categories: Category[] }) {
  return (
    <section className="py-20 lg:py-28" id="collections">
      <Container size="shell">
        <div className="mb-10 flex flex-col gap-3 sm:mb-14">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Shop by collection
          </span>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Six categories, one standard.
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:grid-rows-2">
          {categories.map((category, i) => {
            const Icon = getIcon(category.icon);
            const isLarge = i === 0;
            return (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className={cn(
                  "group relative flex aspect-square flex-col justify-between overflow-hidden rounded-2xl p-5 transition-transform duration-300 hover:scale-[1.01] sm:p-7",
                  isLarge && "col-span-2 row-span-2 aspect-auto"
                )}
              >
                <div className="absolute inset-0 dark:hidden" style={{ backgroundColor: category.tone }} />
                <div
                  className="absolute inset-0 hidden dark:block"
                  style={{ backgroundColor: category.toneDark }}
                />
                <Icon
                  aria-hidden="true"
                  strokeWidth={1}
                  className={cn(
                    "absolute -bottom-6 -right-6 text-foreground/[0.08] transition-transform duration-500 group-hover:scale-110",
                    isLarge ? "size-56" : "size-28"
                  )}
                />
                <div className="relative flex items-center justify-between">
                  <Icon className="size-6 text-foreground/70" strokeWidth={1.5} />
                  <ArrowUpRight className="size-4 text-foreground/50 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <div className="relative">
                  <h3
                    className={cn(
                      "font-semibold text-foreground",
                      isLarge ? "text-2xl sm:text-3xl" : "text-base sm:text-lg"
                    )}
                  >
                    {category.name}
                  </h3>
                  {isLarge && (
                    <p className="mt-2 max-w-xs text-sm text-foreground/70">{category.description}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
