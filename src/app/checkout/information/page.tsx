import type { Metadata } from "next";
import { InformationForm } from "@/components/checkout/information-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { EmptyCartGuard } from "@/components/checkout/empty-cart-guard";

export const metadata: Metadata = {
  title: "Checkout — Information",
};

export default function CheckoutInformationPage() {
  return (
    <>
      <EmptyCartGuard />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
        <InformationForm />
        <OrderSummary />
      </div>
    </>
  );
}
