import type { Metadata } from "next";
import { OrderConfirmationContent } from "@/components/ecommerce/order-confirmation-content";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return <OrderConfirmationContent orderId={orderId} />;
}
