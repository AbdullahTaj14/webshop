"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { ProductImage } from "./product-image";
import { cn } from "@/lib/utils";
import type { ProductImage as ProductImageType } from "@/types";

interface ProductGalleryProps {
  images: ProductImageType[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [zoom, setZoom] = React.useState({ origin: "center", scale: 1 });

  const active = images[activeIndex];

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoom({ origin: `${x}% ${y}%`, scale: 1.6 });
  }

  function resetZoom() {
    setZoom({ origin: "center", scale: 1 });
  }

  const next = React.useCallback(() => {
    setActiveIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const prev = React.useCallback(() => {
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:w-20 sm:flex-col sm:overflow-visible">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-label={`View image ${i + 1} of ${images.length}`}
            aria-current={i === activeIndex}
            className={cn(
              "size-16 shrink-0 overflow-hidden rounded-lg ring-1 ring-border transition-all sm:size-20",
              i === activeIndex && "ring-2 ring-foreground"
            )}
          >
            <ProductImage tone={img.tone} toneDark={img.toneDark} icon={img.icon} alt={img.alt} index={i} />
          </button>
        ))}
      </div>

      <div className="relative order-1 flex-1 sm:order-2">
        <div
          className="relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl"
          onMouseMove={handleMouseMove}
          onMouseLeave={resetZoom}
        >
          <div
            className="absolute inset-0 transition-transform duration-200 ease-out"
            style={{ transform: `scale(${zoom.scale})`, transformOrigin: zoom.origin }}
          >
            <ProductImage
              tone={active.tone}
              toneDark={active.toneDark}
              icon={active.icon}
              alt={active.alt}
              index={activeIndex}
            />
          </div>
          <button
            type="button"
            onClick={() => setFullscreen(true)}
            aria-label="View fullscreen"
            className="absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full bg-surface/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-surface"
          >
            <Maximize2 className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <FullscreenViewer
        open={fullscreen}
        onOpenChange={setFullscreen}
        images={images}
        activeIndex={activeIndex}
        onNext={next}
        onPrev={prev}
        productName={productName}
      />
    </div>
  );
}

function FullscreenViewer({
  open,
  onOpenChange,
  images,
  activeIndex,
  onNext,
  onPrev,
  productName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: ProductImageType[];
  activeIndex: number;
  onNext: () => void;
  onPrev: () => void;
  productName: string;
}) {
  const active = images[activeIndex];

  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onNext, onPrev]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-background/95 backdrop-blur"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                className="fixed inset-4 z-50 flex flex-col items-center justify-center sm:inset-10 focus:outline-none"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <VisuallyHidden asChild>
                  <DialogPrimitive.Title>{productName} gallery</DialogPrimitive.Title>
                </VisuallyHidden>
                <DialogPrimitive.Close
                  aria-label="Close gallery"
                  className="absolute right-0 top-0 flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5"
                >
                  <X className="size-5" />
                </DialogPrimitive.Close>

                <div className="relative flex w-full max-w-2xl flex-1 items-center justify-center">
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={onPrev}
                      aria-label="Previous image"
                      className="absolute left-0 z-10 flex size-10 items-center justify-center rounded-full bg-surface text-foreground shadow-sm transition-colors hover:bg-foreground/5 sm:-left-14"
                    >
                      <ChevronLeft className="size-5" />
                    </button>
                  )}
                  <div className="aspect-square w-full max-w-xl overflow-hidden rounded-2xl">
                    <ProductImage
                      tone={active.tone}
                      toneDark={active.toneDark}
                      icon={active.icon}
                      alt={active.alt}
                      index={activeIndex}
                    />
                  </div>
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={onNext}
                      aria-label="Next image"
                      className="absolute right-0 z-10 flex size-10 items-center justify-center rounded-full bg-surface text-foreground shadow-sm transition-colors hover:bg-foreground/5 sm:-right-14"
                    >
                      <ChevronRight className="size-5" />
                    </button>
                  )}
                </div>

                <p className="mt-4 text-sm text-muted">
                  {activeIndex + 1} / {images.length}
                </p>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
