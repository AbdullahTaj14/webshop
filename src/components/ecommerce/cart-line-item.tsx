"use client";

import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import { ProductImage } from "./product-image";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types";

export function CartLineItem({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const image = item.product.images[0];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="flex gap-4 overflow-hidden"
    >
      <Link
        href={`/product/${item.product.slug}`}
        className="size-20 shrink-0 overflow-hidden rounded-xl"
      >
        <ProductImage
          tone={image.tone}
          toneDark={image.toneDark}
          icon={image.icon}
          alt={item.product.name}
        />
      </Link>

      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={`/product/${item.product.slug}`}
              className="text-sm font-medium text-foreground hover:underline"
            >
              {item.product.name}
            </Link>
            {(item.variant.color || item.variant.size) && (
              <p className="mt-0.5 text-xs text-muted">
                {[item.variant.color, item.variant.size].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.product.name} from cart`}
            className="shrink-0 rounded-full p-1 text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-full border border-border">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
              className="flex size-7 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5"
            >
              <Minus className="size-3" />
            </button>
            <span className="w-7 text-center text-sm tabular-nums" aria-live="polite">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
              className="flex size-7 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5"
            >
              <Plus className="size-3" />
            </button>
          </div>
          <span className="text-sm font-medium text-foreground">
            {formatPrice(item.product.price * item.quantity, item.product.currency)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
