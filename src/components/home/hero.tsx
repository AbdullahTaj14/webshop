import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { ProductImage } from "@/components/ecommerce/product-image";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";

export function Hero({ feature, accent }: { feature: Product; accent: Product }) {
  const featureImage = feature.images[0];
  const accentImage = accent.images[1] ?? accent.images[0];

  return (
    <section className="overflow-hidden border-b border-border">
      <Container size="shell" className="grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2 lg:gap-8 lg:py-24">
        <div
          className="flex flex-col gap-7 [animation-fill-mode:both]"
          style={{ animation: "fade-up 0.7s ease-out" }}
        >
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            New season, considered
          </span>
          <h1 className="text-balance text-[44px] font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Objects built to outlast the trend they arrived in.
          </h1>
          <p className="max-w-md text-balance text-base leading-relaxed text-secondary sm:text-lg">
            Aro designs audio, carry, and everyday essentials with one rule: every material,
            seam, and hinge has to earn its place. Shop the new collection.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <Link href="/shop">
                Shop the collection
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/shop?sort=newest">New arrivals</Link>
            </Button>
          </div>
        </div>

        <div
          className="relative aspect-[4/5] w-full [animation-fill-mode:both] sm:aspect-square lg:aspect-[4/5]"
          style={{ animation: "fade-up 0.8s ease-out 0.1s" }}
        >
          <div className="absolute inset-0 overflow-hidden rounded-[28px]">
            <ProductImage
              tone={featureImage.tone}
              toneDark={featureImage.toneDark}
              icon={featureImage.icon}
              alt={feature.name}
            />
          </div>
          <div className="absolute -bottom-6 -left-6 size-32 overflow-hidden rounded-2xl border-4 border-background shadow-[0_12px_32px_-8px_rgba(0,0,0,0.2)] sm:size-40">
            <ProductImage
              tone={accentImage.tone}
              toneDark={accentImage.toneDark}
              icon={accentImage.icon}
              alt={accent.name}
              index={1}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
