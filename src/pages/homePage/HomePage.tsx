import { Hero } from "@/components/home/Hero";
import { RandomCocktailGrid } from "@/components/home/RandomCocktailGrid";
import { TrendingReel } from "@/components/home/TrendingReel";
import { TopRatedSection } from "@/components/home/TopRated/TopRatedSection";
import { authClient } from "@/lib/auth";
import { useRandomCocktails } from "./hooks/useRandomCocktails";
import { useRecentlyRated } from "./hooks/useRecentlyRated";
import { useTopRated } from "./hooks/useTopRated";

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
  const { data: session } = authClient.useSession();

  console.log(session);

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
