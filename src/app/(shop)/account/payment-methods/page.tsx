import type { Metadata } from "next";
import { PaymentMethodsContent } from "@/components/account/payment-methods-content";

export const metadata: Metadata = {
  title: "Payment methods",
};

export default function PaymentMethodsPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">Payment methods</h2>
      <div className="mt-6">
        <PaymentMethodsContent />
      </div>
    </div>
  );
}
