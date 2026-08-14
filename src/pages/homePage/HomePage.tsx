import { Hero } from "@/pages/homePage/components/Hero";
import { RandomDrink } from "@/pages/homePage/components/RandomDrink/RandomDrinkCard";
import { TrendingReel } from "@/pages/homePage/components/TrendingReel";
import { useRandomDrink } from "./hooks/useRandomDrink";
import { useRecentlyRated } from "./hooks/useRecentlyRated";
import { useTopRated } from "./hooks/useTopRated";
import { useRouteHistoryStore } from "@/store/routeHistoryStore";
import { useEffect } from "react";
import { TopRatedSection } from "./components/TopRated/TopRatedSection";

export function HomePage() {
  const { topDrink, loading: topLoading, error: topError } = useTopRated();
  const {
    randomDrink: randomDrink,
    loading: randLoading,
    fetching: randFetching,
    error: randError,
    shuffle,
  } = useRandomDrink();
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
      <RandomDrink
        drink={randomDrink}
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
