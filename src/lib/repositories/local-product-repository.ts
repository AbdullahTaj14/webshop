import { products } from "@/constants/products";
import { getReviewsForProduct } from "@/constants/reviews";
import type { Product, ProductFilters, ProductListResult, Review } from "@/types";
import type { ProductRepository } from "./product-repository";

function sortProducts(items: Product[], sort: ProductFilters["sort"]) {
  const sorted = [...items];
  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "featured":
    default:
      return sorted.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }
}

export class LocalProductRepository implements ProductRepository {
  async list(filters: ProductFilters): Promise<ProductListResult> {
    let items = [...products];

    if (filters.category?.length) {
      items = items.filter((p) => filters.category!.includes(p.category));
    }
    if (filters.brand?.length) {
      items = items.filter((p) => filters.brand!.includes(p.brand));
    }
    if (filters.color?.length) {
      items = items.filter((p) => p.colors.some((c) => filters.color!.includes(c.name)));
    }
    if (filters.size?.length) {
      items = items.filter((p) => p.sizes.some((s) => filters.size!.includes(s)));
    }
    if (typeof filters.minPrice === "number") {
      items = items.filter((p) => p.price >= filters.minPrice!);
    }
    if (typeof filters.maxPrice === "number") {
      items = items.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    items = sortProducts(items, filters.sort);

    const total = items.length;
    const perPage = filters.perPage ?? 12;
    const page = filters.page ?? 1;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const start = (page - 1) * perPage;
    const paged = items.slice(start, start + perPage);

    return { items: paged, total, page, perPage, totalPages };
  }

  async getBySlug(slug: string): Promise<Product | null> {
    return products.find((p) => p.slug === slug) ?? null;
  }

  async getFeatured(limit = 8): Promise<Product[]> {
    return products.filter((p) => p.isFeatured).slice(0, limit);
  }

  async getBestSellers(limit = 8): Promise<Product[]> {
    return products.filter((p) => p.isBestSeller).slice(0, limit);
  }

  async getNewArrivals(limit = 8): Promise<Product[]> {
    return sortProducts(products.filter((p) => p.isNew), "newest").slice(0, limit);
  }

  async getRelated(product: Product, limit = 4): Promise<Product[]> {
    return products
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, limit);
  }

  async search(query: string, limit = 8): Promise<Product[]> {
    const result = await this.list({ query, perPage: limit, page: 1 });
    return result.items;
  }

  async getReviews(productId: string): Promise<Review[]> {
    return getReviewsForProduct(productId);
  }
}
