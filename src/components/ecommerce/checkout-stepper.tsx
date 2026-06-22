"use client";

import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: "information", label: "Information", href: "/checkout/information" },
  { id: "shipping", label: "Shipping", href: "/checkout/shipping" },
  { id: "payment", label: "Payment", href: "/checkout/payment" },
];

export function CheckoutStepper() {
  const pathname = usePathname();
  const currentIndex = steps.findIndex((s) => pathname?.startsWith(s.href));

  return (
    <ol className="flex items-center">
      {steps.map((step, i) => {
        const isComplete = currentIndex > i;
        const isCurrent = currentIndex === i;
        return (
          <li key={step.id} className="flex items-center">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors duration-200",
                  isComplete && "border-foreground bg-foreground text-background",
                  isCurrent && "border-foreground text-foreground",
                  !isComplete && !isCurrent && "border-border text-muted"
                )}
              >
                {isComplete ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:inline",
                  isCurrent ? "text-foreground" : "text-muted"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && <span className="mx-3 h-px w-6 bg-border sm:w-16" />}
          </li>
        );
      })}
    </ol>
  );
}
