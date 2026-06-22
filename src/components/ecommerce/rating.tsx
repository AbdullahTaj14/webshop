import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}

export function Rating({ value, count, size = "sm", className }: RatingProps) {
  const starSize = size === "sm" ? "size-3.5" : "size-4";
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div
        className="flex items-center gap-0.5"
        role="img"
        aria-label={`Rated ${value} out of 5 stars`}
      >
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i + 1 <= Math.round(value);
          return (
            <Star
              key={i}
              className={cn(starSize, filled ? "fill-foreground text-foreground" : "fill-none text-border-strong")}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          );
        })}
      </div>
      {typeof count === "number" && (
        <span className="text-xs text-muted">({count})</span>
      )}
    </div>
  );
}
