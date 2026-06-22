import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "content" | "shell";
  as?: "div" | "section";
}

export function Container({ children, className, size = "content", as = "div" }: ContainerProps) {
  const Comp = as;
  return (
    <Comp
      className={cn(
        "mx-auto w-full px-6 sm:px-8 lg:px-12",
        size === "content" ? "max-w-(--container-content)" : "max-w-(--container-shell)",
        className
      )}
    >
      {children}
    </Comp>
  );
}
