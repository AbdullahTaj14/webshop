"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { User, Heart, Search, Moon, Sun } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { useUIStore } from "@/store/ui-store";
import { mainNav } from "@/constants/site";

export function MobileNav() {
  const open = useUIStore((s) => s.mobileMenuOpen);
  const setOpen = useUIStore((s) => s.setMobileMenuOpen);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Drawer open={open} onOpenChange={setOpen} title="Menu" side="left">
      <nav aria-label="Mobile" className="flex flex-col gap-1">
        {mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className="rounded-lg px-2 py-3 text-lg font-medium text-foreground transition-colors hover:bg-foreground/5"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="my-6 h-px bg-border" />

      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setSearchOpen(true);
          }}
          className="flex items-center gap-3 rounded-lg px-2 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
        >
          <Search className="size-4.5" strokeWidth={1.5} />
          Search
        </button>
        <Link
          href="/wishlist"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 rounded-lg px-2 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
        >
          <Heart className="size-4.5" strokeWidth={1.5} />
          Wishlist
        </Link>
        <Link
          href="/account"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 rounded-lg px-2 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
        >
          <User className="size-4.5" strokeWidth={1.5} />
          Account
        </Link>
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="flex items-center gap-3 rounded-lg px-2 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
        >
          {isDark ? (
            <Sun className="size-4.5" strokeWidth={1.5} />
          ) : (
            <Moon className="size-4.5" strokeWidth={1.5} />
          )}
          {isDark ? "Light mode" : "Dark mode"}
        </button>
      </div>
    </Drawer>
  );
}
