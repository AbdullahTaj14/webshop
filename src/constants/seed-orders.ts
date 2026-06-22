import { products } from "./products";
import type { Order, OrderLineItem } from "@/types";

function toLineItem(slug: string, quantity: number, overrides: Partial<OrderLineItem> = {}): OrderLineItem {
  const product = products.find((p) => p.slug === slug);
  if (!product) throw new Error(`Unknown seed product: ${slug}`);
  const image = product.images[0];
  return {
    productSlug: product.slug,
    name: product.name,
    brand: product.brand,
    price: product.price,
    currency: product.currency,
    quantity,
    color: product.colors[0]?.name,
    size: product.sizes[0],
    imageTone: image.tone,
    imageToneDark: image.toneDark,
    imageIcon: image.icon,
    ...overrides,
  };
}

export const seedOrders: Order[] = [
  {
    id: "ord_seed_001",
    number: "ARO-482190",
    createdAt: "2026-05-02T10:00:00.000Z",
    status: "delivered",
    items: [toLineItem("merino-crew", 2), toLineItem("daily-tote", 1)],
    subtotal: 405,
    shipping: 0,
    tax: 32.4,
    total: 437.4,
    shippingAddress: {
      id: "addr_seed",
      label: "Home",
      fullName: "Jordan Avery",
      line1: "128 Spring Street",
      city: "New York",
      state: "NY",
      postalCode: "10012",
      country: "United States",
      phone: "+1 (212) 555-0148",
      isDefault: true,
    },
    estimatedDelivery: "2026-05-08T00:00:00.000Z",
    paymentMethodLabel: "Card ending in 4242",
  },
  {
    id: "ord_seed_002",
    number: "ARO-317625",
    createdAt: "2026-06-10T14:30:00.000Z",
    status: "shipped",
    items: [toLineItem("aro-ring", 1)],
    subtotal: 145,
    shipping: 8,
    tax: 11.6,
    total: 164.6,
    shippingAddress: {
      id: "addr_seed",
      label: "Home",
      fullName: "Jordan Avery",
      line1: "128 Spring Street",
      city: "New York",
      state: "NY",
      postalCode: "10012",
      country: "United States",
      phone: "+1 (212) 555-0148",
      isDefault: true,
    },
    estimatedDelivery: "2026-06-16T00:00:00.000Z",
    paymentMethodLabel: "PayPal",
  },
];
