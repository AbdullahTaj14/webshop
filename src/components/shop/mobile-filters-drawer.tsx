"use client";

import * as React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { FiltersSidebar } from "./filters-sidebar";

export function MobileFiltersDrawer() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-foreground transition-colors hover:border-border-strong lg:hidden"
      >
        <SlidersHorizontal className="size-4" strokeWidth={1.5} />
        Filters
      </button>
      <Drawer open={open} onOpenChange={setOpen} title="Filters" side="left">
        <FiltersSidebar />
      </Drawer>
    </>
  );
}
