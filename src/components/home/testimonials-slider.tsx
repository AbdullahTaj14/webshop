"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Rating } from "@/components/ecommerce/rating";
import type { Testimonial } from "@/types";

export function TestimonialsSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(1);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  function go(dir: 1 | -1) {
    setDirection(dir);
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);
  }

  const active = testimonials[index];

  return (
    <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
      <Quote className="size-8 text-muted" strokeWidth={1.25} />

      <div className="relative mt-6 min-h-40 w-full overflow-hidden sm:min-h-32">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex flex-col items-center gap-4"
          >
            <p className="text-balance text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
              &ldquo;{active.quote}&rdquo;
            </p>
            <div className="flex flex-col items-center gap-1">
              <Rating value={active.rating} />
              <p className="text-sm text-secondary">
                {active.author} · {active.role}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous testimonial"
          className="flex size-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-border-strong"
        >
          <ChevronLeft className="size-4" />
        </button>
        <div className="flex items-center gap-1.5">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              aria-label={`Go to testimonial ${i + 1}`}
              aria-current={i === index}
              className={`size-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-foreground" : "bg-border-strong"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next testimonial"
          className="flex size-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-border-strong"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
