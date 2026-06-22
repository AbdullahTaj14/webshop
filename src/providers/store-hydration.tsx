"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCheckoutStore } from "@/store/checkout-store";
import { useOrdersStore } from "@/store/orders-store";
import { useAddressesStore } from "@/store/addresses-store";
import { usePaymentMethodsStore } from "@/store/payment-methods-store";
import { useSearchStore } from "@/store/search-store";

/**
 * All persisted stores use `skipHydration: true` so the first client render
 * matches the server's (empty) output — see each store for why. This pulls
 * the real localStorage state in once, after that first render is safely
 * committed, so the UI then updates normally instead of mismatching it.
 */
export function StoreHydration() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
    useWishlistStore.persist.rehydrate();
    useCheckoutStore.persist.rehydrate();
    useOrdersStore.persist.rehydrate();
    useAddressesStore.persist.rehydrate();
    usePaymentMethodsStore.persist.rehydrate();
    useSearchStore.persist.rehydrate();
  }, []);

  return null;
}
