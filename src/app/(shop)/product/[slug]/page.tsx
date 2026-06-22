import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProductGallery } from "@/components/ecommerce/product-gallery";
import { ProductPurchasePanel } from "@/components/ecommerce/product-purchase-panel";
import { ProductFeaturesBlock } from "@/components/ecommerce/product-features-block";
import { ProductReviews } from "@/components/ecommerce/product-reviews";
import { RelatedProducts } from "@/components/ecommerce/related-products";
import { productRepository } from "@/lib/data-source";
import { categories } from "@/constants/categories";
import { siteConfig } from "@/constants/site";
import { productJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await productRepository.getBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} — ${siteConfig.name}`,
      description: product.shortDescription,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await productRepository.getBySlug(slug);
  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    productRepository.getReviews(product.id),
    productRepository.getRelated(product),
  ]);

  const category = categories.find((c) => c.slug === product.category);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    ...(category ? [{ label: category.name, href: `/shop?category=${category.slug}` }] : []),
    { label: product.name },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(
              breadcrumbItems.map((item) => ({
                name: item.label,
                url: `${siteConfig.url}${item.href ?? `/product/${product.slug}`}`,
              }))
            )
          ),
        }}
      />

      <Container size="shell" className="py-10 lg:py-14">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} productName={product.name} />
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductPurchasePanel product={product} />
          </div>
        </div>

        <div className="mt-20 max-w-3xl border-t border-border pt-16">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Description</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-secondary">{product.description}</p>
        </div>

        <div className="mt-16 border-t border-border pt-16">
          <h2 className="mb-10 text-2xl font-semibold tracking-tight text-foreground">
            Why it&rsquo;s built this way
          </h2>
          <ProductFeaturesBlock features={product.features} />
        </div>

        <div className="mt-16 border-t border-border pt-16">
          <h2 className="mb-10 text-2xl font-semibold tracking-tight text-foreground">Reviews</h2>
          <ProductReviews reviews={reviews} rating={product.rating} reviewCount={product.reviewCount} />
        </div>

        <div className="mt-20 border-t border-border pt-16">
          <RelatedProducts products={related} />
        </div>
      </Container>
    </>
  );
}
