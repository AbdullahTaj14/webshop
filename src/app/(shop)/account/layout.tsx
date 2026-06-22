import { redirect } from "next/navigation";
import { Container } from "@/components/layout/container";
import { AccountNav } from "@/components/account/account-nav";
import { getSession } from "@/lib/auth";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <Container size="shell" className="py-10 lg:py-14">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Account</h1>
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <aside>
          <AccountNav />
        </aside>
        <div>{children}</div>
      </div>
    </Container>
  );
}
