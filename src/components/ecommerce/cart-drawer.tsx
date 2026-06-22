"use client";

import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { CartLineItem } from "./cart-line-item";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD = 150;
const STANDARD_SHIPPING = 8;

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const items = useCartStore((s) => s.items);

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.product.price, 0);
  const shipping = items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => !open && close()}
      title={`Cart${items.length ? ` (${items.length})` : ""}`}
      footer={
        items.length > 0 ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary">Subtotal</span>
              <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary">Shipping</span>
              <span className="font-medium text-foreground">
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </span>
            </div>
            {remainingForFreeShipping > 0 && (
              <p className="text-xs text-muted">
                Add {formatPrice(remainingForFreeShipping)} more for free shipping.
              </p>
            )}
            <Button asChild size="lg" className="w-full" onClick={close}>
              <Link href="/checkout/information">Checkout · {formatPrice(subtotal + shipping)}</Link>
            </Button>
          </div>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
          <ShoppingBag className="size-10 text-muted" strokeWidth={1.25} />
          <p className="text-sm text-secondary">Your cart is empty.</p>
          <Button variant="secondary" size="sm" asChild onClick={close}>
            <Link href="/shop">Continue shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <CartLineItem key={item.id} item={item} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </Drawer>
  );
}
