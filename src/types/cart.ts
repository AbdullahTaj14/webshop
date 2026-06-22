import type { Product, ProductVariantSelection } from "./product";

export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariantSelection;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}
