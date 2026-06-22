import { ProductCard } from "./product-card";
import { HorizontalScroller } from "./horizontal-scroller";
import type { Product } from "@/types";

export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <div>
      <h2 className="mb-8 text-2xl font-semibold tracking-tight text-foreground">
        You may also like
      </h2>
      <HorizontalScroller>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </HorizontalScroller>
    </div>
  );
}
