import type { Metadata } from "next";
import { OrdersList } from "@/components/account/orders-list";

export const metadata: Metadata = {
  title: "Orders",
};

export default function OrdersPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">Orders</h2>
      <p className="mt-1.5 text-sm text-secondary">Track and review your past orders.</p>
      <div className="mt-8">
        <OrdersList />
      </div>
    </div>
  );
}
