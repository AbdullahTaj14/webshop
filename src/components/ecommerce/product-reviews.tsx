import { Rating } from "./rating";
import { ReviewCard } from "./review-card";
import type { Review } from "@/types";

export function ProductReviews({
  reviews,
  rating,
  reviewCount,
}: {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}) {
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    return { star, count, pct: reviews.length ? (count / reviews.length) * 100 : 0 };
  });

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr]">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-5xl font-semibold tracking-tight text-foreground">
            {rating.toFixed(1)}
          </p>
          <Rating value={rating} className="mt-2" />
          <p className="mt-1 text-sm text-muted">Based on {reviewCount} reviews</p>
        </div>

        <div className="flex flex-col gap-2">
          {distribution.map(({ star, count, pct }) => (
            <div key={star} className="flex items-center gap-3 text-sm">
              <span className="w-10 text-muted">{star} star</span>
              <div className="h-1.5 flex-1 rounded-full bg-border">
                <div className="h-1.5 rounded-full bg-foreground" style={{ width: `${pct}%` }} />
              </div>
              <span className="w-6 text-right text-muted">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        {reviews.length === 0 ? (
          <p className="text-sm text-secondary">Be the first to review this product.</p>
        ) : (
          reviews.map((review) => <ReviewCard key={review.id} review={review} />)
        )}
      </div>
    </div>
  );
}
