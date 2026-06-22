import Link from "next/link";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/constants/site";

export default function OrderConfirmationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border py-5">
        <Container size="content">
          <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
            {siteConfig.name}
          </Link>
        </Container>
      </header>
      <main className="flex-1 py-14 lg:py-20">
        <Container size="content">{children}</Container>
      </main>
    </div>
  );
}
