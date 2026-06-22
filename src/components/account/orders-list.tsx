"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { ProductImage } from "@/components/ecommerce/product-image";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrdersStore } from "@/store/orders-store";
import { useHasHydrated } from "@/hooks/use-has-hydrated";
import { formatDate, formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const statusVariant: Record<OrderStatus, BadgeProps["variant"]> = {
  processing: "muted",
  confirmed: "default",
  shipped: "outline",
  delivered: "success",
  cancelled: "error",
};

export function OrdersList() {
  const hasHydrated = useHasHydrated(useOrdersStore.persist);
  const orders = useOrdersStore((s) => s.orders);

  if (!hasHydrated) return null;

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <Package className="size-10 text-muted" strokeWidth={1.25} />
        <p className="text-sm text-secondary">You haven&rsquo;t placed any orders yet.</p>
        <Button asChild size="sm">
          <Link href="/shop">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <div key={order.id} className="rounded-2xl border border-border p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">{order.number}</p>
              <p className="text-xs text-muted">Placed {formatDate(order.createdAt)}</p>
            </div>
            <Badge variant={statusVariant[order.status]} className="capitalize">
              {order.status}
            </Badge>
          </div>

          <div className="mt-4 flex items-center gap-2">
            {order.items.slice(0, 4).map((item, i) => (
              <div key={`${item.productSlug}-${i}`} className="size-12 overflow-hidden rounded-lg">
                <ProductImage
                  tone={item.imageTone}
                  toneDark={item.imageToneDark}
                  icon={item.imageIcon}
                  alt={item.name}
                />
              </div>
            ))}
            {order.items.length > 4 && (
              <span className="text-xs text-muted">+{order.items.length - 4} more</span>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm text-secondary">{formatPrice(order.total)}</span>
            <Link
              href={`/order-confirmation/${order.id}`}
              className="text-sm font-medium text-foreground hover:underline"
            >
              View details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
