import type { MetadataRoute } from "next";
import { products } from "@/constants/products";
import { categories } from "@/constants/categories";
import { siteConfig } from "@/constants/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = ["", "/shop", "/wishlist"].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteConfig.url}/shop?category=${category.slug}`,
    lastModified: new Date(),
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.url}/product/${product.slug}`,
    lastModified: product.createdAt,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
