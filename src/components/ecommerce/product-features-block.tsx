import { getIcon } from "@/lib/icons";
import type { ProductFeature } from "@/types";

export function ProductFeaturesBlock({ features }: { features: ProductFeature[] }) {
  if (features.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
      {features.map((feature) => {
        const Icon = getIcon(feature.icon);
        return (
          <div key={feature.title} className="flex flex-col gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-foreground/5">
              <Icon className="size-5 text-foreground" strokeWidth={1.25} />
            </div>
            <div>
              <h3 className="text-[15px] font-medium text-foreground">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-secondary">{feature.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
