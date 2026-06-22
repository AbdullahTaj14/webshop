import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SavedPaymentMethod } from "@/types";

interface PaymentMethodsState {
  methods: SavedPaymentMethod[];
  addMethod: (method: Omit<SavedPaymentMethod, "id">) => void;
  removeMethod: (id: string) => void;
  setDefault: (id: string) => void;
}

const seedMethods: SavedPaymentMethod[] = [
  {
    id: "pm_seed_visa",
    brand: "visa",
    last4: "4242",
    expiry: "08/28",
    isDefault: true,
  },
];

export const usePaymentMethodsStore = create<PaymentMethodsState>()(
  persist(
    (set, get) => ({
      methods: seedMethods,
      addMethod: (method) =>
        set({
          methods: [
            ...get().methods.map((m) => ({ ...m, isDefault: method.isDefault ? false : m.isDefault })),
            { ...method, id: `pm_${Math.random().toString(36).slice(2, 10)}` },
          ],
        }),
      removeMethod: (id) => set({ methods: get().methods.filter((m) => m.id !== id) }),
      setDefault: (id) =>
        set({ methods: get().methods.map((m) => ({ ...m, isDefault: m.id === id })) }),
    }),
    { name: "aro-payment-methods", skipHydration: true }
  )
);
