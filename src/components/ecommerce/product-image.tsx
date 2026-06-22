import { createElement } from "react";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  tone: string;
  toneDark: string;
  icon: string;
  alt: string;
  index?: number;
  className?: string;
  iconClassName?: string;
}

export function ProductImage({
  tone,
  toneDark,
  icon,
  alt,
  index = 0,
  className,
  iconClassName,
}: ProductImageProps) {
  const Icon = getIcon(icon);
  const variant = index % 3;

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden",
        className
      )}
      style={
        {
          "--tone": tone,
          "--tone-dark": toneDark,
          backgroundColor: "var(--tone)",
        } as React.CSSProperties
      }
    >
      <div className="absolute inset-0 dark:hidden" style={{ backgroundColor: tone }} />
      <div className="absolute inset-0 hidden dark:block" style={{ backgroundColor: toneDark }} />
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-multiply dark:opacity-[0.12] dark:mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, currentColor 0, transparent 45%)",
        }}
      />
      {createElement(Icon, {
        "aria-hidden": "true",
        strokeWidth: 1,
        className: cn(
          "relative text-foreground/[0.32] transition-transform duration-500",
          variant === 0 && "size-[42%]",
          variant === 1 && "size-[34%] -translate-x-[8%] -translate-y-[4%] rotate-[-6deg]",
          variant === 2 && "size-[38%] translate-x-[6%] translate-y-[2%] rotate-[4deg]",
          iconClassName
        ),
      })}
    </div>
  );
}
