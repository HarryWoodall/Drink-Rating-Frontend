import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { TopIngredient } from "@/types/cocktail";

interface IngredientTabsProps {
  ingredients: TopIngredient[];
  selected: TopIngredient | undefined;
  onSelect: (name: TopIngredient) => void;
}

export function IngredientTabs({
  ingredients,
  selected,
  onSelect,
}: IngredientTabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeIndex = ingredients.findIndex((x) => x.name === selected?.name);

  function move(index: number) {
    const next = ingredients[index];
    if (!next) return;
    onSelect(next);
    tabRefs.current[index]?.focus();
  }

  return (
    <div className="relative">
      <div
        role="tablist"
        aria-label="Popular ingredients"
        className="reel-scroll flex gap-2 overflow-x-auto pb-2.5"
      >
        {ingredients.map((ingredient, i) => {
          const isSelected = ingredient.name === selected?.name;
          return (
            <button
              key={ingredient.name}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`ingredient-tab-${i}`}
              aria-selected={isSelected}
              aria-controls="ingredient-showcase-panel"
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onSelect(ingredient)}
              className={cn(
                "shrink-0 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors",
                "hover:border-foreground/25 hover:text-foreground",
                isSelected &&
                  "border-amber bg-amber text-background hover:text-background",
              )}
            >
              {ingredient.name}
              {ingredient.count !== undefined && (
                <span className="ml-2 text-[11px] tabular-nums tracking-[0.06em] opacity-60">
                  {ingredient.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
