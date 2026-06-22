import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CheckoutCustomerInfo, CheckoutShippingInfo } from "@/types/order";

interface CheckoutState {
  customer: CheckoutCustomerInfo | null;
  shipping: CheckoutShippingInfo | null;
  setCustomer: (info: CheckoutCustomerInfo) => void;
  setShipping: (info: CheckoutShippingInfo) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      customer: null,
      shipping: null,
      setCustomer: (info) => set({ customer: info }),
      setShipping: (info) => set({ shipping: info }),
      reset: () => set({ customer: null, shipping: null }),
    }),
    { name: "aro-checkout-draft", skipHydration: true }
  )
);
