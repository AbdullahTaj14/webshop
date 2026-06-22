import type { Address } from "./user";

export type OrderStatus =
  | "processing"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderLineItem {
  productSlug: string;
  name: string;
  brand: string;
  price: number;
  currency: string;
  quantity: number;
  color?: string;
  size?: string;
  imageTone: string;
  imageToneDark: string;
  imageIcon: string;
}

export interface Order {
  id: string;
  number: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderLineItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  estimatedDelivery: string;
  paymentMethodLabel: string;
}

export type PaymentProviderId = "stripe" | "paypal" | "apple-pay" | "google-pay";

export interface CheckoutCustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface CheckoutShippingInfo {
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  method: "standard" | "express" | "overnight";
}

export interface CheckoutPaymentInfo {
  provider: PaymentProviderId;
  cardholderName?: string;
  cardNumber?: string;
  expiry?: string;
  cvc?: string;
}
