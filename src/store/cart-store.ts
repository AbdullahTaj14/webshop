import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, ProductVariantSelection } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, variant: ProductVariantSelection, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

function cartItemId(productId: string, variant: ProductVariantSelection) {
  return `${productId}::${variant.color ?? ""}::${variant.size ?? ""}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product, variant, quantity = 1) => {
        const id = cartItemId(product.id, variant);
        const existing = get().items.find((i) => i.id === id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + quantity } : i
            ),
          });
        } else {
          set({ items: [...get().items, { id, product, variant, quantity }] });
        }
        if (typeof window !== "undefined") {
          console.log("ADD TO CART FIRED", product.name);
  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event: "add_to_cart",
    ecommerce: {
      currency: product.currency,
      value: product.price * quantity,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_brand: product.brand,
          item_category: product.category,
          item_variant: `${variant.color ?? ""}-${variant.size ?? ""}`,
          price: product.price,
          quantity,
        },
      ],
    },
  });
}
        set({ isOpen: true });
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, quantity) =>
        set({
          items: get()
            .items.map((i) => (i.id === id ? { ...i, quantity } : i))
            .filter((i) => i.quantity > 0),
        }),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set({ isOpen: !get().isOpen }),
    }),
    {
      name: "aro-cart",
      partialize: (state) => ({ items: state.items }),
      // Persisted state must not apply until after the first client render
      // matches the server's (empty) output — see providers/store-hydration.
      skipHydration: true,
    }
  )
);

export function useCartCount() {
  return useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
}

export function useCartSubtotal() {
  return useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity * i.product.price, 0));
}
