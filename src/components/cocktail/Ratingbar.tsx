import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

export function RatingBar() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="flex flex-wrap items-center justify-between gap-5 border-t border-border bg-black/20 p-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Your verdict
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {rating ? `You poured this ${rating} / 5` : "Tap a star to rate"}
        </p>
      </div>
      <div className="flex gap-1.5" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            aria-label={`Rate ${s} star${s > 1 ? "s" : ""}`}
            onMouseEnter={() => setHover(s)}
            onClick={() => setRating(s)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                "h-7 w-7",
                (hover || rating) >= s
                  ? "fill-amber text-amber"
                  : "fill-none text-amber/25",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
