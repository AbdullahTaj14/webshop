import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ProductCard } from "@/components/ecommerce/product-card";
import { HorizontalScroller } from "@/components/ecommerce/horizontal-scroller";
import type { Product } from "@/types";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="py-20 lg:py-28">
      <Container size="shell">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 sm:mb-14">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
              Editor&rsquo;s picks
            </span>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Featured this season.
            </h2>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-secondary"
          >
            View all products
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <HorizontalScroller>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </HorizontalScroller>
      </Container>
    </section>
  );
}
