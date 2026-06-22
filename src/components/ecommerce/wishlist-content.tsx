"use client";

import Link from "next/link";
import { Heart, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ProductImage } from "./product-image";
import { Rating } from "./rating";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";
import { useHasHydrated } from "@/hooks/use-has-hydrated";
import { formatPrice } from "@/lib/utils";

export function WishlistContent() {
  const hasHydrated = useHasHydrated(useWishlistStore.persist);
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  const addItem = useCartStore((s) => s.addItem);

  if (!hasHydrated) return null;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <Heart className="size-10 text-muted" strokeWidth={1.25} />
        <div>
          <p className="text-base font-medium text-foreground">Your wishlist is empty</p>
          <p className="mt-1 text-sm text-secondary">Save products you love to find them here.</p>
        </div>
        <Button asChild>
          <Link href="/shop">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence initial={false}>
        {items.map(({ product }) => {
          const image = product.images[0];
          return (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Link href={`/product/${product.slug}`}>
                  <ProductImage
                    tone={image.tone}
                    toneDark={image.toneDark}
                    icon={image.icon}
                    alt={product.name}
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => remove(product.id)}
                  aria-label={`Remove ${product.name} from wishlist`}
                  className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-surface/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-surface"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="mt-4 flex flex-1 flex-col gap-1">
                <Link href={`/product/${product.slug}`} className="text-[15px] font-medium text-foreground hover:underline">
                  {product.name}
                </Link>
                <p className="text-sm text-muted">{product.brand}</p>
                <span className="mt-1 text-[15px] font-medium text-foreground">
                  {formatPrice(product.price)}
                </span>
                <Rating value={product.rating} count={product.reviewCount} className="mt-1" />
              </div>
              <Button
                variant="secondary"
                className="mt-4 w-full"
                onClick={() =>
                  addItem(product, { color: product.colors[0]?.name, size: product.sizes[0] }, 1)
                }
              >
                Move to cart
              </Button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
