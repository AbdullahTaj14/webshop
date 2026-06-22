export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductImage {
  id: string;
  tone: string;
  toneDark: string;
  icon: string;
  alt: string;
}

export interface ProductFeature {
  title: string;
  description: string;
  icon: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  collection?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  shortDescription: string;
  description: string;
  rating: number;
  reviewCount: number;
  colors: ProductColor[];
  sizes: string[];
  tags: string[];
  images: ProductImage[];
  features: ProductFeature[];
  stock: number;
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  createdAt: string;
}

export interface ProductVariantSelection {
  color?: string;
  size?: string;
}

export type SortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating";

export interface ProductFilters {
  category?: string[];
  brand?: string[];
  color?: string[];
  size?: string[];
  minPrice?: number;
  maxPrice?: number;
  query?: string;
  sort?: SortOption;
  page?: number;
  perPage?: number;
}

export interface ProductListResult {
  items: Product[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  tone: string;
  toneDark: string;
}
