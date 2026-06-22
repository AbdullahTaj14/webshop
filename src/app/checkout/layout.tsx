import Link from "next/link";
import { Lock } from "lucide-react";
import { Container } from "@/components/layout/container";
import { CheckoutStepper } from "@/components/ecommerce/checkout-stepper";
import { siteConfig } from "@/constants/site";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border py-5">
        <Container size="content" className="flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
            {siteConfig.name}
          </Link>
          <CheckoutStepper />
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Lock className="size-3.5" />
            <span className="hidden sm:inline">Secure checkout</span>
          </div>
        </Container>
      </header>
      <main className="flex-1 py-10 lg:py-14">
        <Container size="content">{children}</Container>
      </main>
    </div>
  );
}
