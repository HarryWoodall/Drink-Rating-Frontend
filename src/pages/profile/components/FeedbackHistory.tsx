import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { cocktailPath } from "@/lib/paths";
import { useUserFeedback } from "../hooks/useUserFeedback";
import { StarRating } from "@/pages/homePage/components/StarRating";

export function FeedbackHistory() {
  const { data, loading, error } = useUserFeedback();

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-400">{error}</p>;
  }

  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        You haven't left any feedback yet.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {data.map((item) => (
        <li
          key={item.id}
          className="rounded-lg border border-border p-4 space-y-1"
        >
          <div className="flex items-center justify-between gap-2">
            <Link
              to={cocktailPath(item.drinkId)}
              className="font-medium hover:text-amber transition-colors truncate"
            >
              {item.drink.name}
            </Link>
            {item.rating !== null && (
              <StarRating rating={item.rating} showValue={false} />
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.comment}
          </p>
          <p className="text-xs text-muted-foreground/60">
            {new Date(item.updatedAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </li>
      ))}
    </ul>
  );
}
