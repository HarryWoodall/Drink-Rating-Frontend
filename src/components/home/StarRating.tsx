import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md";
  showValue?: boolean;
}

export function StarRating({ rating, size = "md", showValue = true }: StarRatingProps) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-[18px] w-[18px]";

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const filled = rating >= i + 0.5;
        return (
          <Star
            key={i}
            className={cn(
              iconSize,
              filled
                ? "fill-amber text-amber"
                : "fill-none text-amber/25",
            )}
          />
        );
      })}
      {showValue && (
        <span
          className={cn(
            "ml-1.5 tabular-nums text-muted-foreground",
            size === "sm" ? "text-xs" : "text-sm",
          )}
        >
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
