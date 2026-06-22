"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";

/**
 * Checks once whether the cart is empty when a checkout step mounts.
 * Reads state imperatively (not a reactive subscription) so a later
 * clearCart() on successful order placement doesn't bounce the user
 * back to /shop while they're navigating to the confirmation page.
 */
export function EmptyCartGuard() {
  const router = useRouter();
  const hasChecked = React.useRef(false);

  React.useEffect(() => {
    function check() {
      if (hasChecked.current) return;
      hasChecked.current = true;
      if (useCartStore.getState().items.length === 0) {
        router.replace("/shop");
      }
    }

    if (useCartStore.persist.hasHydrated()) {
      check();
      return;
    }
    return useCartStore.persist.onFinishHydration(check);
  }, [router]);

  return null;
}
