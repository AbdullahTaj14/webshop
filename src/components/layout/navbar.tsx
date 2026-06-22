"use client";

import Link from "next/link";
import { Menu, Search, Heart, ShoppingBag, User } from "lucide-react";
import { Container } from "./container";
import { ThemeToggle } from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useScrolled } from "@/hooks/use-scrolled";
import { useCartCount, useCartStore } from "@/store/cart-store";
import { useWishlistCount } from "@/store/wishlist-store";
import { useUIStore } from "@/store/ui-store";
import { mainNav, siteConfig } from "@/constants/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const scrolled = useScrolled();
  const cartCount = useCartCount();
  const wishlistCount = useWishlistCount();
  const openCart = useCartStore((s) => s.open);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const setMobileMenuOpen = useUIStore((s) => s.setMobileMenuOpen);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-transparent bg-background/90 backdrop-blur-md transition-[border-color,box-shadow] duration-300",
        scrolled && "border-border shadow-[0_1px_0_0_rgba(0,0,0,0.02)]"
      )}
    >
      <Container size="shell">
        <div
          className={cn(
            "flex items-center justify-between transition-[padding] duration-300",
            scrolled ? "py-3" : "py-5"
          )}
        >
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="-ml-2 flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5 lg:hidden"
            >
              <Menu className="size-5" strokeWidth={1.5} />
            </button>

            <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
              {siteConfig.name}
            </Link>

            <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-secondary transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5"
            >
              <Search className="size-4.75" strokeWidth={1.5} />
            </button>

            <Link
              href="/wishlist"
              aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ""}`}
              className="relative flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5"
            >
              <Heart className="size-4.75" strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-action text-[10px] font-medium text-action-foreground">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={openCart}
              aria-label={`Cart${cartCount ? `, ${cartCount} items` : ""}`}
              className="relative flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5"
            >
              <ShoppingBag className="size-4.75" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-action text-[10px] font-medium text-action-foreground">
                  {cartCount}
                </span>
              )}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Account"
                  className="flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5"
                >
                  <User className="size-4.75" strokeWidth={1.5} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={12}>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/login">Sign in</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/register">Create account</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account/orders">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wishlist">Wishlist</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/addresses">Addresses</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Container>
    </header>
  );
}
