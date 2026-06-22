"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { ProductImage } from "./product-image";
import { Button } from "@/components/ui/button";
import { useOrdersStore } from "@/store/orders-store";
import { useHasHydrated } from "@/hooks/use-has-hydrated";
import { formatDate, formatPrice } from "@/lib/utils";

export function OrderConfirmationContent({ orderId }: { orderId: string }) {
  const hasHydrated = useHasHydrated(useOrdersStore.persist);
  const order = useOrdersStore((s) => s.getOrder(orderId));

  if (!hasHydrated) return null;

  if (!order) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-lg font-medium text-foreground">We couldn&rsquo;t find that order</p>
        <p className="text-sm text-secondary">
          It may have already been viewed on a different device or session.
        </p>
        <Button asChild>
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center"
      >
        <CheckCircle2 className="size-14 text-success" strokeWidth={1.25} />
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Order confirmed
        </h1>
        <p className="mt-3 max-w-md text-secondary">
          Thank you, {order.shippingAddress.fullName.split(" ")[0]}. We&rsquo;ve received your
          order and will send a confirmation email shortly.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
          <div>
            <p className="text-muted">Order number</p>
            <p className="font-medium text-foreground">{order.number}</p>
          </div>
          <div>
            <p className="text-muted">Estimated delivery</p>
            <p className="font-medium text-foreground">{formatDate(order.estimatedDelivery)}</p>
          </div>
          <div>
            <p className="text-muted">Payment</p>
            <p className="font-medium text-foreground">{order.paymentMethodLabel}</p>
          </div>
        </div>
      </motion.div>

      <div className="mt-12 rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-col gap-4">
          {order.items.map((item, i) => (
            <div key={`${item.productSlug}-${i}`} className="flex items-center gap-3">
              <div className="size-14 shrink-0 overflow-hidden rounded-lg">
                <ProductImage
                  tone={item.imageTone}
                  toneDark={item.imageToneDark}
                  icon={item.imageIcon}
                  alt={item.name}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted">
                  {[item.color, item.size].filter(Boolean).join(" · ")} · Qty {item.quantity}
                </p>
              </div>
              <span className="text-sm text-secondary">
                {formatPrice(item.price * item.quantity, item.currency)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-border pt-5 text-sm">
          <Row label="Subtotal" value={formatPrice(order.subtotal)} />
          <Row label="Shipping" value={order.shipping === 0 ? "Free" : formatPrice(order.shipping)} />
          <Row label="Tax" value={formatPrice(order.tax)} />
          <div className="mt-2 flex items-center justify-between border-t border-border pt-3 text-base font-medium">
            <span className="text-foreground">Total</span>
            <span className="text-foreground">{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-5 text-sm">
          <p className="text-muted">Shipping to</p>
          <p className="mt-1 text-foreground">
            {order.shippingAddress.fullName}
            <br />
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.postalCode}
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button asChild size="lg">
          <Link href="/shop">Continue shopping</Link>
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link href="/account/orders">View order</Link>
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-secondary">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
