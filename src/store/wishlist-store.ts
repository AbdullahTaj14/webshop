import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, WishlistItem } from "@/types";

interface WishlistState {
  items: WishlistItem[];
  toggle: (product: Product) => void;
  remove: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const exists = get().items.some((i) => i.product.id === product.id);
        if (exists) {
          set({ items: get().items.filter((i) => i.product.id !== product.id) });
        } else {
          set({ items: [{ product, addedAt: new Date().toISOString() }, ...get().items] });
        }
      },
      remove: (productId) =>
        set({ items: get().items.filter((i) => i.product.id !== productId) }),
      isWishlisted: (productId) => get().items.some((i) => i.product.id === productId),
    }),
    { name: "aro-wishlist", skipHydration: true }
  )
);

export function useWishlistCount() {
  return useWishlistStore((s) => s.items.length);
}
