"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function HorizontalScroller({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  function updateScrollState() {
    const el = ref.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }

  React.useEffect(() => {
    updateScrollState();
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function scrollBy(direction: 1 | -1) {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={ref}
        onScroll={updateScrollState}
        className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth pb-2"
      >
        {React.Children.map(children, (child) => (
          <div className="w-[72%] shrink-0 snap-start sm:w-[42%] lg:w-[23%]">{child}</div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollBy(-1)}
        aria-label="Scroll left"
        disabled={!canScrollLeft}
        className={cn(
          "absolute -left-4 top-[38%] hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-md transition-opacity duration-200 lg:flex",
          !canScrollLeft && "pointer-events-none opacity-0"
        )}
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => scrollBy(1)}
        aria-label="Scroll right"
        disabled={!canScrollRight}
        className={cn(
          "absolute -right-4 top-[38%] hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-md transition-opacity duration-200 lg:flex",
          !canScrollRight && "pointer-events-none opacity-0"
        )}
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
