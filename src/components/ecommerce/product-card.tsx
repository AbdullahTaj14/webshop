import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Rating } from "./rating";
import { ProductImage } from "./product-image";
import { WishlistButton } from "./wishlist-button";
import { QuickAddButton } from "./quick-add-button";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const primaryImage = product.images[0];
  const onSale = Boolean(product.compareAtPrice && product.compareAtPrice > product.price);

  return (
    <div className="group relative flex flex-col">
      <Link href={`/product/${product.slug}`} className="block" tabIndex={-1}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
          <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.04]">
            <ProductImage
              tone={primaryImage.tone}
              toneDark={primaryImage.toneDark}
              icon={primaryImage.icon}
              alt={`${product.name} by ${product.brand}`}
            />
          </div>

          {(product.isNew || onSale || product.isBestSeller) && (
            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {product.isNew && <Badge variant="default">New</Badge>}
              {onSale && <Badge variant="error">Sale</Badge>}
              {!product.isNew && !onSale && product.isBestSeller && (
                <Badge variant="muted">Bestseller</Badge>
              )}
            </div>
          )}

          <div className="absolute right-3 top-3 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            <WishlistButton product={product} />
          </div>

          <div className="absolute inset-x-3 bottom-3 translate-y-0 opacity-100 transition-all duration-200 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100">
            <QuickAddButton product={product} />
          </div>
        </div>
      </Link>

      <div className="mt-4 flex flex-1 flex-col gap-1">
        <Link
          href={`/product/${product.slug}`}
          className="text-[15px] font-medium text-foreground transition-colors hover:text-secondary focus-visible:outline-none focus-visible:underline"
        >
          {product.name}
        </Link>
        <p className="text-sm text-muted">{product.brand}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[15px] font-medium text-foreground">
            {formatPrice(product.price, product.currency)}
          </span>
          {onSale && (
            <span className="text-sm text-muted line-through">
              {formatPrice(product.compareAtPrice as number, product.currency)}
            </span>
          )}
        </div>
        <Rating value={product.rating} count={product.reviewCount} className="mt-1" />
      </div>
    </div>
  );
}
