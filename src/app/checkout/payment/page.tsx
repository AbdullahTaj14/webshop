import type { Metadata } from "next";
import { PaymentForm } from "@/components/checkout/payment-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { EmptyCartGuard } from "@/components/checkout/empty-cart-guard";

export const metadata: Metadata = {
  title: "Checkout — Payment",
};

export default function CheckoutPaymentPage() {
  return (
    <>
      <EmptyCartGuard />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
        <PaymentForm />
        <OrderSummary />
      </div>
    </>
  );
}
