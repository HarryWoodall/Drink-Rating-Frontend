import { useTopRated } from "@/hooks/useTopRated";
import { useRecentlyRated } from "@/hooks/useRecentlyRated";
import { useRandomCocktails } from "@/hooks/useRandomCocktails";
import { TopRatedCard } from "@/components/home/TopRatedCard";
import { RandomCocktailGrid } from "@/components/home/RandomCocktailGrid";
import { RecentlyRatedList } from "@/components/home/RecentlyRatedList";

export function HomePage() {
  const { topRated, loading: topLoading, error: topError } = useTopRated();
  const { randomCocktails, loading: randLoading, error: randError } = useRandomCocktails(6);
  const { recentCocktails, loading: recentLoading, error: recentError } = useRecentlyRated();

  return (
    <div className="space-y-10">
      <TopRatedCard cocktail={topRated} loading={topLoading} error={topError} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <RandomCocktailGrid drinks={randomCocktails} loading={randLoading} error={randError} />
        <RecentlyRatedList cocktails={recentCocktails} loading={recentLoading} error={recentError} />
      </div>
    </div>
  );
}
