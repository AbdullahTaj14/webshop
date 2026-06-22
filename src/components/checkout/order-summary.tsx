"use client";

import { ProductImage } from "@/components/ecommerce/product-image";
import { useCartStore } from "@/store/cart-store";
import { useCheckoutStore } from "@/store/checkout-store";
import { formatPrice } from "@/lib/utils";

const SHIPPING_RATES: Record<string, number> = {
  standard: 8,
  express: 18,
  overnight: 35,
};

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 150;

export function OrderSummary() {
  const items = useCartStore((s) => s.items);
  const shippingMethod = useCheckoutStore((s) => s.shipping?.method);
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.product.price, 0);

  const shipping = shippingMethod
    ? shippingMethod === "standard" && subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_RATES[shippingMethod]
    : undefined;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + (shipping ?? 0) + tax;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="text-sm font-medium text-foreground">Order summary</h2>

      <div className="mt-5 flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg">
              <ProductImage
                tone={item.product.images[0].tone}
                toneDark={item.product.images[0].toneDark}
                icon={item.product.images[0].icon}
                alt={item.product.name}
              />
              <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{item.product.name}</p>
              {(item.variant.color || item.variant.size) && (
                <p className="text-xs text-muted">
                  {[item.variant.color, item.variant.size].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
            <span className="text-sm text-secondary">
              {formatPrice(item.product.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-2.5 border-t border-border pt-5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-secondary">Subtotal</span>
          <span className="text-foreground">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-secondary">Shipping</span>
          <span className="text-foreground">
            {shipping === undefined ? "Calculated at next step" : shipping === 0 ? "Free" : formatPrice(shipping)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-secondary">Tax</span>
          <span className="text-foreground">{formatPrice(tax)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-border pt-3 text-base font-medium">
          <span className="text-foreground">Total</span>
          <span className="text-foreground">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
