import type { Metadata } from "next";
import { ShippingForm } from "@/components/checkout/shipping-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { EmptyCartGuard } from "@/components/checkout/empty-cart-guard";

export const metadata: Metadata = {
  title: "Checkout — Shipping",
};

export default function CheckoutShippingPage() {
  return (
    <>
      <EmptyCartGuard />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
        <ShippingForm />
        <OrderSummary />
      </div>
    </>
  );
}
