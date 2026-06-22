import { LocalProductRepository } from "./repositories/local-product-repository";
import type { ProductRepository } from "./repositories/product-repository";

// Single seam for swapping the commerce backend (Shopify, Medusa, Commerce
// Layer, custom API) without touching any UI code — implement
// ProductRepository and swap the instance below.
export const productRepository: ProductRepository = new LocalProductRepository();
