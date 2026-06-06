import { useTopRated } from "@/hooks/useTopRated";
import { useRecentlyRated } from "@/hooks/useRecentlyRated";
import { useRandomCocktails } from "@/hooks/useRandomCocktails";
import { Hero } from "@/components/home/Hero";
import { TopRatedCard } from "@/components/home/TopRated/TopRatedCard";
import { RandomCocktailGrid } from "@/components/home/RandomCocktailGrid";
import { TrendingReel } from "@/components/home/TrendingReel";
import { TopRatedSection } from "@/components/home/TopRated/TopRatedSection";

export function HomePage() {
  const {
    topDrink: topCocktail,
    loading: topLoading,
    error: topError,
  } = useTopRated();
  const {
    randomCocktails,
    loading: randLoading,
    fetching: randFetching,
    error: randError,
    shuffle,
  } = useRandomCocktails(6);
  const {
    recentCocktails,
    loading: recentLoading,
    error: recentError,
  } = useRecentlyRated();

  return (
    <div>
      <Hero />
      <RandomCocktailGrid
        drinks={randomCocktails}
        loading={randLoading}
        fetching={randFetching}
        error={randError}
        onShuffle={() => shuffle()}
      />
      <TopRatedSection
        cocktail={topCocktail}
        loading={topLoading}
        error={topError}
      />
      <TrendingReel
        cocktails={recentCocktails}
        loading={recentLoading}
        error={recentError}
      />
    </div>
  );
}
