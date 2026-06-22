import { create } from "zustand";
import { persist } from "zustand/middleware";
import { seedOrders } from "@/constants/seed-orders";
import type { Order } from "@/types";

interface OrdersState {
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrder: (id: string) => Order | undefined;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: seedOrders,
      addOrder: (order) => set({ orders: [order, ...get().orders] }),
      getOrder: (id) => get().orders.find((o) => o.id === id),
    }),
    { name: "aro-orders", skipHydration: true }
  )
);
