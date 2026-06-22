"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { AnimatePresence, motion } from "framer-motion";
import { Command } from "cmdk";
import { Search, Clock, ArrowRight } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { useUIStore } from "@/store/ui-store";
import { useSearchStore } from "@/store/search-store";
import { products } from "@/constants/products";
import { categories } from "@/constants/categories";
import { formatPrice, cn } from "@/lib/utils";

export function CommandPalette() {
  const open = useUIStore((s) => s.searchOpen);
  const setOpen = useUIStore((s) => s.setSearchOpen);
  const recentQueries = useSearchStore((s) => s.recentQueries);
  const addQuery = useSearchStore((s) => s.addQuery);
  const clearQueries = useSearchStore((s) => s.clear);
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);

  // Centralize close handling so the query always resets — covers the esc
  // button, overlay click/Escape (via Radix's onOpenChange), and selecting
  // a result, without resetting state from render or an effect.
  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setQuery("");
  }

  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [query]);

  function goTo(href: string, recordQuery?: string) {
    if (recordQuery) addQuery(recordQuery);
    handleOpenChange(false);
    router.push(href);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-60 bg-black/40 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                className="fixed left-1/2 top-24 z-60 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-[0_24px_60px_-12px_rgba(0,0,0,0.3)] focus:outline-none"
                initial={{ opacity: 0, scale: 0.97, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -4 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              >
                <VisuallyHidden asChild>
                  <DialogPrimitive.Title>Search products</DialogPrimitive.Title>
                </VisuallyHidden>
                <Command shouldFilter={false} label="Search products">
                  <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                    <Search className="size-4.5 shrink-0 text-muted" />
                    <Command.Input
                      autoFocus
                      value={query}
                      onValueChange={setQuery}
                      placeholder="Search products, brands, categories…"
                      className="flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleOpenChange(false)}
                      aria-label="Close search"
                      className="rounded-md border border-border px-1.5 py-0.5 text-[11px] text-muted transition-colors hover:text-foreground"
                    >
                      esc
                    </button>
                  </div>

                  <Command.List className="max-h-[60vh] overflow-y-auto p-3">
                    <Command.Empty className="px-3 py-10 text-center text-sm text-muted">
                      No results for &ldquo;{query}&rdquo;
                    </Command.Empty>

                    {query.trim() ? (
                      results.length > 0 && (
                        <Command.Group
                          heading="Products"
                          className="px-2 pb-1 pt-3 text-[11px] font-medium uppercase tracking-wide text-muted **:[[cmdk-group-items]]:mt-2"
                        >
                          {results.map((product) => (
                            <Command.Item
                              key={product.id}
                              value={product.id}
                              onSelect={() => goTo(`/product/${product.slug}`, query)}
                              className={cn(
                                "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground",
                                "data-[selected=true]:bg-foreground/5"
                              )}
                            >
                              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-background text-secondary">
                                {React.createElement(getIcon(product.images[0].icon), {
                                  className: "size-4",
                                  strokeWidth: 1.5,
                                })}
                              </span>
                              <span className="flex-1">
                                <span className="block font-medium">{product.name}</span>
                                <span className="block text-xs text-muted">{product.brand}</span>
                              </span>
                              <span className="text-sm text-secondary">
                                {formatPrice(product.price)}
                              </span>
                            </Command.Item>
                          ))}
                        </Command.Group>
                      )
                    ) : (
                      <>
                        {recentQueries.length > 0 && (
                          <Command.Group
                            heading="Recent searches"
                            className="px-2 pb-1 pt-1 text-[11px] font-medium uppercase tracking-wide text-muted **:[[cmdk-group-items]]:mt-2"
                          >
                            <div className="mb-1 flex items-center justify-end px-3">
                              <button
                                type="button"
                                onClick={clearQueries}
                                className="text-[11px] text-muted underline-offset-2 hover:underline"
                              >
                                Clear
                              </button>
                            </div>
                            {recentQueries.map((q) => (
                              <Command.Item
                                key={q}
                                value={q}
                                onSelect={() => setQuery(q)}
                                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground data-[selected=true]:bg-foreground/5"
                              >
                                <Clock className="size-4 text-muted" />
                                <span className="flex-1">{q}</span>
                              </Command.Item>
                            ))}
                          </Command.Group>
                        )}

                        <Command.Group
                          heading="Browse categories"
                          className="px-2 pb-1 pt-3 text-[11px] font-medium uppercase tracking-wide text-muted **:[[cmdk-group-items]]:mt-2"
                        >
                          {categories.map((category) => {
                            const Icon = getIcon(category.icon);
                            return (
                              <Command.Item
                                key={category.id}
                                value={category.slug}
                                onSelect={() => goTo(`/shop?category=${category.slug}`)}
                                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground data-[selected=true]:bg-foreground/5"
                              >
                                <Icon className="size-4 text-muted" strokeWidth={1.5} />
                                <span className="flex-1">{category.name}</span>
                                <ArrowRight className="size-3.5 text-muted" />
                              </Command.Item>
                            );
                          })}
                        </Command.Group>
                      </>
                    )}
                  </Command.List>
                </Command>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
