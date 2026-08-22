import { useState } from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { searchPath } from "@/lib/paths";
import { useIngredientShowcase } from "../../hooks/useIngredientShowcase";
import { useTopIngredients } from "../../hooks/useTopIngredients";
import { DrinkShowcaseCard } from "../DrinkShowcaseCard";
import { SectionHeading } from "../SectionHeading";
import { IngredientTabs } from "./IngredientTabs";
import { useSearchResults } from "@/pages/searchPage/hooks/useSearchResults";

const GRID = "grid gap-4 md:grid-cols-[1.35fr_1fr_1fr]";

export function IngredientShowcaseSection() {
  const {
    ingredients,
    loading: ingredientsLoading,
    error: ingredientsError,
  } = useTopIngredients();

  const [picked, setPicked] = useState<string>();
  // Fall back to the first ingredient until the user picks one themselves.
  const selected = picked ?? ingredients[0]?.name;

  // const { showcase, loading, error } = useIngredientShowcase(selected);
  const { results, loading, error } = useSearchResults(
    selected,
    "ingredient",
    "alcoholic",
  );

  return (
    <section id="by-ingredient" className="scroll-mt-24 py-8">
      <SectionHeading
        num="04"
        title="Top Drink by Ingredient"
        blurb="Pick a bottle. See what the room pours best with it."
      />

      {ingredients.length > 0 && (
        <IngredientTabs
          ingredients={ingredients}
          selected={selected}
          onSelect={setPicked}
        />
      )}

      {results && (
        <p className="my-4 text-[11px] uppercase tracking-[0.2em] text-amber/65">
          Poured in {results.length} drinks{" "}
          <span className="text-faded-foreground">
            · ranked by community score
          </span>
        </p>
      )}

      <div id="ingredient-showcase-panel" role="tabpanel" tabIndex={0}>
        {ingredientsError || error ? (
          <p className="text-sm text-destructive">
            Failed to load the top drinks by ingredient.
          </p>
        ) : ingredientsLoading || loading ? (
          <div className={GRID}>
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-lg border border-border bg-card"
              >
                <Skeleton className="h-48 w-full" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : !selected ? (
          <div className="rounded-lg border border-dashed border-border bg-black/15 p-11 text-center">
            <p className="text-sm text-muted-foreground">
              No ingredients to pick from yet.
            </p>
          </div>
        ) : !results || results.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-black/15 p-11 text-center">
            <p className="text-sm text-muted-foreground">
              No one has rated a {selected.toLowerCase()} drink yet.
            </p>
            <Link
              to={searchPath(selected, "ingredient")}
              className="mt-1.5 inline-block border-b border-amber/40 pb-0.5 text-sm text-amber"
            >
              Be the first to pour one
            </Link>
          </div>
        ) : (
          <div className={GRID}>
            {results.map((d) => (
              <DrinkShowcaseCard
                key={d.idDrink}
                drink={d}
                avgRating={2.5}
                numRatings={3}
                ingredient="test"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
