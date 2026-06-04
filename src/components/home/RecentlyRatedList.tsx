import { Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { DbCocktail } from "@/types/cocktail";
import { StarRating } from "./StarRating";

interface RecentlyRatedListProps {
  cocktails: DbCocktail[];
  loading: boolean;
  error: string | null;
}

export function RecentlyRatedList({ cocktails, loading, error }: RecentlyRatedListProps) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Clock className="h-5 w-5 text-indigo-500" />
        <h2 className="text-lg font-semibold">Recently Rated</h2>
      </div>

      {error && (
        <p className="text-sm text-destructive">Failed to load recent cocktails.</p>
      )}

      <div className="flex flex-col">
        {loading
          ? Array.from({ length: 5 }, (_, i) => (
              <div key={i}>
                {i > 0 && <Separator />}
                <div className="flex items-center gap-3 py-3">
                  <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                  <Skeleton className="h-4 w-20 shrink-0" />
                </div>
              </div>
            ))
          : cocktails.length === 0
          ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No cocktails rated yet.
            </p>
          )
          : cocktails.map((cocktail, i) => (
              <div key={cocktail.id}>
                {i > 0 && <Separator />}
                <div className="flex items-center gap-3 py-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 text-sm font-medium">
                      {cocktail.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{cocktail.name}</p>
                    {cocktail.description && (
                      <p className="truncate text-xs text-muted-foreground">
                        {cocktail.description}
                      </p>
                    )}
                  </div>
                  <StarRating rating={cocktail.rating} size="sm" />
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
