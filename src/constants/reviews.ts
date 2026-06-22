import type { Review, Testimonial } from "@/types";
import { products } from "./products";

const reviewTemplates: Array<Omit<Review, "id" | "productId">> = [
  {
    author: "Maya T.",
    rating: 5,
    title: "Exceeded expectations",
    body: "The build quality is obvious the second you pick it up. Worth every dollar and then some.",
    date: "2026-05-02",
    verified: true,
    helpfulCount: 24,
  },
  {
    author: "Daniel K.",
    rating: 4,
    title: "Great, with one small note",
    body: "Really happy with this — the only thing I'd change is the packaging could be a bit more compact for travel.",
    date: "2026-04-18",
    verified: true,
    helpfulCount: 11,
  },
  {
    author: "Priya S.",
    rating: 5,
    title: "Better than the photos",
    body: "I was skeptical ordering online but this looks and feels even better in person. Already ordered a second.",
    date: "2026-03-29",
    verified: true,
    helpfulCount: 31,
  },
  {
    author: "Oliver B.",
    rating: 5,
    title: "Considered design, top to bottom",
    body: "You can tell every detail was thought through. Packaging, instructions, the product itself — all just right.",
    date: "2026-03-11",
    verified: false,
    helpfulCount: 8,
  },
  {
    author: "Hannah R.",
    rating: 4,
    title: "Solid daily driver",
    body: "Been using this every day for two months now and it's holding up beautifully.",
    date: "2026-02-20",
    verified: true,
    helpfulCount: 14,
  },
];

export const reviews: Review[] = products.flatMap((product, productIndex) =>
  reviewTemplates.slice(0, 3 + (productIndex % 3)).map((template, i) => ({
    ...template,
    id: `${product.id}-review-${i}`,
    productId: product.id,
  }))
);

export function getReviewsForProduct(productId: string) {
  return reviews.filter((r) => r.productId === productId);
}

export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    author: "Clara Whitfield",
    role: "Product Designer",
    quote:
      "Every piece I've bought feels like it was made by someone who actually cares. Nothing feels disposable.",
    rating: 5,
  },
  {
    id: "t-2",
    author: "Marcus Lindqvist",
    role: "Architect",
    quote:
      "The restraint in the design language is rare. It's the first store I've shopped where I trust every product page.",
    rating: 5,
  },
  {
    id: "t-3",
    author: "Sofia Alvarez",
    role: "Photographer",
    quote:
      "Shipping was fast, packaging was minimal but protective, and the product matched the listing exactly.",
    rating: 5,
  },
  {
    id: "t-4",
    author: "James Okafor",
    role: "Software Engineer",
    quote:
      "I've returned almost nothing I've bought here, which says a lot. The sizing guides and photos are honest.",
    rating: 4,
  },
];
