import type { Product, ProductFilters, ProductListResult, Review } from "@/types";

export interface ProductRepository {
  list(filters: ProductFilters): Promise<ProductListResult>;
  getBySlug(slug: string): Promise<Product | null>;
  getFeatured(limit?: number): Promise<Product[]>;
  getBestSellers(limit?: number): Promise<Product[]>;
  getNewArrivals(limit?: number): Promise<Product[]>;
  getRelated(product: Product, limit?: number): Promise<Product[]>;
  search(query: string, limit?: number): Promise<Product[]>;
  getReviews(productId: string): Promise<Review[]>;
}
