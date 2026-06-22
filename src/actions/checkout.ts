"use server";

import { getPaymentProvider } from "@/services/payment";
import { orderInputSchema, type OrderInput } from "@/lib/checkout-schemas";
import type { Order } from "@/types/order";

const SHIPPING_RATES: Record<string, number> = {
  standard: 8,
  express: 18,
  overnight: 35,
};

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 150;

export type PlaceOrderInput = OrderInput;

export interface PlaceOrderResult {
  success: boolean;
  order?: Order;
  error?: string;
}

const paymentLabels: Record<string, string> = {
  stripe: "Card",
  paypal: "PayPal",
  "apple-pay": "Apple Pay",
  "google-pay": "Google Pay",
};

export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const parsed = orderInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Some checkout details are invalid.",
    };
  }

  const { customer, shipping, payment, items } = parsed.data;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost =
    shipping.method === "standard" && subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_RATES[shipping.method];
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + shippingCost + tax;

  const provider = getPaymentProvider(payment.provider);
  const charge = await provider.charge({ amount: total, currency: items[0].currency });

  if (charge.status !== "succeeded") {
    return {
      success: false,
      error: "Payment could not be processed. Please try a different method.",
    };
  }

  const now = new Date();
  const estimatedDelivery = new Date(now);
  estimatedDelivery.setDate(
    now.getDate() + (shipping.method === "overnight" ? 1 : shipping.method === "express" ? 3 : 6)
  );

  const order: Order = {
    id: `ord_${Math.random().toString(36).slice(2, 11)}`,
    number: `ARO-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: now.toISOString(),
    status: "confirmed",
    items,
    subtotal,
    shipping: shippingCost,
    tax,
    total,
    shippingAddress: {
      id: "addr_checkout",
      label: "Shipping address",
      fullName: `${customer.firstName} ${customer.lastName}`,
      line1: shipping.address,
      line2: shipping.apartment,
      city: shipping.city,
      state: shipping.state,
      postalCode: shipping.postalCode,
      country: shipping.country,
      phone: customer.phone,
      isDefault: false,
    },
    estimatedDelivery: estimatedDelivery.toISOString(),
    paymentMethodLabel:
      payment.provider === "stripe" && charge.last4
        ? `${paymentLabels[payment.provider]} ending in ${charge.last4}`
        : paymentLabels[payment.provider],
  };

  return { success: true, order };
}
