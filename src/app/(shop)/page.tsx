import { Hero } from "@/components/home/hero";
import { FeaturedCollections } from "@/components/home/featured-collections";
import { FeaturedProducts } from "@/components/home/featured-products";
import { WhyShop } from "@/components/home/why-shop";
import { TestimonialsSlider } from "@/components/home/testimonials-slider";
import { Newsletter } from "@/components/home/newsletter";
import { Container } from "@/components/layout/container";
import { productRepository } from "@/lib/data-source";
import { categories } from "@/constants/categories";
import { testimonials } from "@/constants/reviews";

export default async function HomePage() {
  const featured = await productRepository.getFeatured(8);
  const [feature, accent] = featured;

  return (
    <>
      <Hero feature={feature} accent={accent ?? feature} />
      <FeaturedCollections categories={categories} />
      <FeaturedProducts products={featured} />
      <WhyShop />
      <section className="py-20 lg:py-28">
        <Container size="content">
          <TestimonialsSlider testimonials={testimonials} />
        </Container>
      </section>
      <Newsletter />
    </>
  );
}
