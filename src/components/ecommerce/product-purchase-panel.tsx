"use client";

import * as React from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WishlistButton } from "./wishlist-button";
import { useCartStore } from "@/store/cart-store";
import { formatPrice, cn } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [color, setColor] = React.useState(product.colors[0]?.name);
  const [size, setSize] = React.useState<string | undefined>(undefined);
  const [quantity, setQuantity] = React.useState(1);
  const [sizeError, setSizeError] = React.useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const inStock = product.stock > 0;
  const requiresSize = product.sizes.length > 0;

  function handleAddToCart() {
    if (requiresSize && !size) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addItem(product, { color, size }, quantity);
  }

  return (
    <div className="flex flex-col gap-7">
      <div>
        <p className="text-sm font-medium text-secondary">{product.brand}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {product.name}
        </h1>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-xl font-medium text-foreground">{formatPrice(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-base text-muted line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>

      <p className="text-[15px] leading-relaxed text-secondary">{product.shortDescription}</p>

      {product.colors.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-medium text-foreground">
            Color{color ? <span className="text-muted"> — {color}</span> : null}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {product.colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(c.name)}
                aria-pressed={color === c.name}
                aria-label={c.name}
                title={c.name}
                className={cn(
                  "flex size-9 items-center justify-center rounded-full ring-1 ring-border transition-all",
                  color === c.name && "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                )}
              >
                <span
                  className="size-7 rounded-full border border-black/10"
                  style={{ backgroundColor: c.hex }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {requiresSize && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Size</p>
            {sizeError && <p className="text-xs text-error">Select a size to continue</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSize(s);
                  setSizeError(false);
                }}
                aria-pressed={size === s}
                className={cn(
                  "flex h-11 min-w-11 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors",
                  size === s
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-foreground hover:border-border-strong",
                  sizeError && !size && "border-error"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p
          className={cn(
            "text-sm font-medium",
            inStock ? "text-success" : "text-error"
          )}
        >
          {inStock ? `In stock — ${product.stock} available` : "Out of stock"}
        </p>
      </div>

      <div className="hidden items-center gap-4 sm:flex">
        <div className="flex items-center rounded-full border border-border">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="flex size-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="w-10 text-center text-sm tabular-nums">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            aria-label="Increase quantity"
            className="flex size-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5"
          >
            <Plus className="size-3.5" />
          </button>
        </div>
        <Button size="lg" className="flex-1" disabled={!inStock} onClick={handleAddToCart}>
          <ShoppingBag className="size-4" />
          Add to cart
        </Button>
        <WishlistButton
          product={product}
          className="size-11 shrink-0 ring-1 ring-border"
        />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-border bg-surface-raised px-4 py-3 sm:hidden">
        <div className="flex-1">
          <p className="text-xs text-muted">Total</p>
          <p className="text-base font-medium text-foreground">
            {formatPrice(product.price * quantity)}
          </p>
        </div>
        <Button size="lg" disabled={!inStock} onClick={handleAddToCart}>
          <ShoppingBag className="size-4" />
          Add to cart
        </Button>
      </div>
      <div className="h-16 sm:hidden" aria-hidden="true" />
    </div>
  );
}
