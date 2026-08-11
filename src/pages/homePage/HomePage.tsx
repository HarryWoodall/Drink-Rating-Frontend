import { Hero } from "@/components/home/Hero";
import { RandomCocktailGrid } from "@/components/home/RandomCocktailGrid";
import { TrendingReel } from "@/components/home/TrendingReel";
import { TopRatedSection } from "@/components/home/TopRated/TopRatedSection";
import { useRandomCocktails } from "./hooks/useRandomCocktails";
import { useRecentlyRated } from "./hooks/useRecentlyRated";
import { useTopRated } from "./hooks/useTopRated";
import { useRouteHistoryStore } from "@/store/routeHistoryStore";
import { useEffect } from "react";

export function HomePage() {
  const { topDrink, loading: topLoading, error: topError } = useTopRated();
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

  const { resetPath } = useRouteHistoryStore((state) => state);

  useEffect(() => {
    resetPath(location.pathname, "Home");
  }, [resetPath]);

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
        topRatedResponseList={topDrink}
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
