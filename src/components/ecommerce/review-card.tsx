import { BadgeCheck } from "lucide-react";
import { Rating } from "./rating";
import { formatDate } from "@/lib/utils";
import type { Review } from "@/types";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-6 first:pt-0 last:border-b-0">
      <div className="flex items-center justify-between">
        <Rating value={review.rating} />
        <span className="text-xs text-muted">{formatDate(review.date)}</span>
      </div>
      <h4 className="text-[15px] font-medium text-foreground">{review.title}</h4>
      <p className="text-sm leading-relaxed text-secondary">{review.body}</p>
      <div className="flex items-center gap-1.5 text-xs text-muted">
        <span className="font-medium text-foreground">{review.author}</span>
        {review.verified && (
          <span className="flex items-center gap-1 text-success">
            <BadgeCheck className="size-3.5" />
            Verified purchase
          </span>
        )}
      </div>
    </div>
  );
}
