"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  hideTitle?: boolean;
  side?: "left" | "right";
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Drawer({
  open,
  onOpenChange,
  title,
  hideTitle = false,
  side = "right",
  children,
  footer,
  className,
}: DrawerProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                className={cn(
                  "fixed top-0 z-50 flex h-dvh w-full max-w-md flex-col bg-surface-raised shadow-[0_0_60px_-12px_rgba(0,0,0,0.3)] focus:outline-none",
                  side === "right" ? "right-0" : "left-0",
                  className
                )}
                initial={{ x: side === "right" ? "100%" : "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: side === "right" ? "100%" : "-100%" }}
                transition={{ type: "spring", stiffness: 380, damping: 38 }}
              >
                <div className="flex items-center justify-between border-b border-border px-6 py-5">
                  {hideTitle ? (
                    <VisuallyHidden asChild>
                      <DialogPrimitive.Title>{title}</DialogPrimitive.Title>
                    </VisuallyHidden>
                  ) : (
                    <DialogPrimitive.Title className="text-lg font-semibold text-foreground">
                      {title}
                    </DialogPrimitive.Title>
                  )}
                  <DialogPrimitive.Close
                    className="rounded-full p-1.5 text-secondary transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Close"
                  >
                    <X className="size-5" />
                  </DialogPrimitive.Close>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
                {footer && <div className="border-t border-border px-6 py-5">{footer}</div>}
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
