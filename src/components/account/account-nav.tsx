"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, Heart, MapPin, CreditCard, LogOut } from "lucide-react";
import { logout } from "@/actions/auth";
import { cn } from "@/lib/utils";

const links = [
  { href: "/account/profile", label: "Profile", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/payment-methods", label: "Payment methods", icon: CreditCard },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Account" className="flex flex-col gap-1">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-foreground text-background" : "text-secondary hover:bg-foreground/5 hover:text-foreground"
            )}
          >
            <link.icon className="size-4" strokeWidth={1.5} />
            {link.label}
          </Link>
        );
      })}
      <form action={logout} className="mt-2">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <LogOut className="size-4" strokeWidth={1.5} />
          Sign out
        </button>
      </form>
    </nav>
  );
}
