"use client";

import { formatPrice } from "@/lib/utils";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function PriceRangeSlider({ min, max, value, onChange }: PriceRangeSliderProps) {
  const [localMin, localMax] = value;

  return (
    <div>
      <div className="relative h-1.5 w-full rounded-full bg-border">
        <div
          className="absolute h-1.5 rounded-full bg-foreground"
          style={{
            left: `${((localMin - min) / (max - min)) * 100}%`,
            right: `${100 - ((localMax - min) / (max - min)) * 100}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localMin}
          onChange={(e) => onChange([Math.min(Number(e.target.value), localMax - 10), localMax])}
          className="range-thumb absolute inset-0 h-1.5 w-full appearance-none bg-transparent"
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localMax}
          onChange={(e) => onChange([localMin, Math.max(Number(e.target.value), localMin + 10)])}
          className="range-thumb absolute inset-0 h-1.5 w-full appearance-none bg-transparent"
          aria-label="Maximum price"
        />
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-secondary">
        <span>{formatPrice(localMin)}</span>
        <span>{formatPrice(localMax)}</span>
      </div>
    </div>
  );
}
