import { Hero } from "@/pages/homePage/components/Hero";
import { RandomDrink } from "@/pages/homePage/components/RandomDrink/RandomDrinkCard";
import { useRandomDrink } from "./hooks/useRandomDrink";
import { useTopRated } from "./hooks/useTopRated";
import { useRouteHistoryStore } from "@/store/routeHistoryStore";
import { useEffect } from "react";
import { TopRatedSection } from "./components/TopRated/TopRatedSection";
import { IngredientShowcaseSection } from "./components/IngredientShowcase/IngredientShowcaseSection";

export function HomePage() {
  const { topDrink, loading: topLoading, error: topError } = useTopRated();
  const {
    randomDrink: randomDrink,
    loading: randLoading,
    fetching: randFetching,
    error: randError,
    shuffle,
  } = useRandomDrink();

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
      <IngredientShowcaseSection />
    </div>
  );
}
