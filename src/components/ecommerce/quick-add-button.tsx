"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export function QuickAddButton({ product, className }: { product: Product; className?: string }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(
          product,
          { color: product.colors[0]?.name, size: product.sizes[0] },
          1
        );
      }}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-full bg-surface/95 py-2.5 text-[13px] font-medium text-foreground shadow-sm backdrop-blur transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <ShoppingBag className="size-3.5" strokeWidth={1.75} />
      Add to cart
    </button>
  );
}
