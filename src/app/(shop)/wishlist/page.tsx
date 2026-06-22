import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { WishlistContent } from "@/components/ecommerce/wishlist-content";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Products you've saved for later.",
};

export default function WishlistPage() {
  return (
    <Container size="shell" className="py-10 lg:py-14">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Wishlist
      </h1>
      <div className="mt-10">
        <WishlistContent />
      </div>
    </Container>
  );
}
