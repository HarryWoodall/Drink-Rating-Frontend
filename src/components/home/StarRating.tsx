import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md";
}

export function StarRating({ rating, size = "md" }: StarRatingProps) {
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const filled = rating >= i + 1;
        const half = !filled && rating >= i + 0.5;
        return (
          <Star
            key={i}
            className={cn(
              iconSize,
              filled || half
                ? "fill-indigo-500 text-indigo-500"
                : "fill-none text-muted-foreground"
            )}
          />
        );
      })}
      <span className={cn("ml-1 tabular-nums text-muted-foreground", size === "sm" ? "text-xs" : "text-sm")}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}
