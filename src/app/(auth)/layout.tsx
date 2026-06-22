import Link from "next/link";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/constants/site";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="py-6">
        <Container size="content">
          <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
            {siteConfig.name}
          </Link>
        </Container>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
