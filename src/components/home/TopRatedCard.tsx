import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { EnrichedCocktail } from "@/types/cocktail";
import { StarRating } from "./StarRating";

interface TopRatedCardProps {
  cocktail: EnrichedCocktail | null;
  loading: boolean;
  error: string | null;
}

export function TopRatedCard({ cocktail, loading, error }: TopRatedCardProps) {
  if (loading) {
    return (
      <div>
        <SectionHeading />
        <Card className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <Skeleton className="h-56 w-full md:h-auto md:w-72 shrink-0" />
            <div className="flex flex-col gap-3 p-6 flex-1">
              <Skeleton className="h-7 w-2/3" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <SectionHeading />
        <p className="text-sm text-destructive">Failed to load top rated cocktail.</p>
      </div>
    );
  }

  if (!cocktail) {
    return (
      <div>
        <SectionHeading />
        <Card className="flex items-center justify-center py-16 text-center">
          <CardContent>
            <Trophy className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="font-medium">No cocktails rated yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Be the first to rate a cocktail!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const date = new Date(cocktail.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <SectionHeading />
      <Card className="overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {cocktail.thumbUrl ? (
            <img
              src={cocktail.thumbUrl}
              alt={cocktail.name}
              className="h-56 w-full object-cover md:h-auto md:w-72 shrink-0"
            />
          ) : (
            <div className="flex h-56 w-full items-center justify-center bg-muted md:h-auto md:w-72 shrink-0">
              <Trophy className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <div className="flex flex-col justify-center gap-3 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold">{cocktail.name}</h2>
              <Badge variant="secondary">Top Rated</Badge>
            </div>
            <StarRating rating={cocktail.rating} />
            {cocktail.description && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {cocktail.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground">Rated on {date}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function SectionHeading() {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Trophy className="h-5 w-5 text-indigo-500" />
      <h2 className="text-lg font-semibold">Top Rated</h2>
    </div>
  );
}
