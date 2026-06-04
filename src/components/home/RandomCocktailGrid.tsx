import { Shuffle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { CocktailDbDrink } from "@/types/cocktail";
import { RandomCocktailCard } from "./RandomCocktailCard";

interface RandomCocktailGridProps {
  drinks: CocktailDbDrink | null;
  loading: boolean;
  error: string | null;
}

export function RandomCocktailGrid({
  drinks: drink,
  loading,
  error,
}: RandomCocktailGridProps) {
  console.log(drink);
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Shuffle className="h-5 w-5 text-indigo-500" />
        <h2 className="text-lg font-semibold">Discover Something New</h2>
      </div>

      {error && (
        <p className="text-sm text-destructive">Failed to load cocktails.</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {loading
          ? Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="overflow-hidden rounded-lg">
                <Skeleton className="aspect-square w-full" />
                <div className="p-3 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))
          : drink && <RandomCocktailCard key={drink.idDrink} drink={drink} />}
      </div>
    </div>
  );
}
