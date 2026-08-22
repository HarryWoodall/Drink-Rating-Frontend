import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { TopIngredient } from "@/types/cocktail";

interface IngredientTabsProps {
  ingredients: TopIngredient[];
  selected: string | undefined;
  onSelect: (name: string) => void;
}

export function IngredientTabs({
  ingredients,
  selected,
  onSelect,
}: IngredientTabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeIndex = ingredients.findIndex((x) => x.name === selected);

  function move(index: number) {
    const next = ingredients[index];
    if (!next) return;
    onSelect(next.name);
    tabRefs.current[index]?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const last = ingredients.length - 1;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      move(activeIndex === last ? 0 : activeIndex + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      move(activeIndex === 0 ? last : activeIndex - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      move(0);
    } else if (e.key === "End") {
      e.preventDefault();
      move(last);
    }
  }

  return (
    <div className="relative">
      <div
        role="tablist"
        aria-label="Popular ingredients"
        onKeyDown={handleKeyDown}
        className="reel-scroll flex gap-2 overflow-x-auto pb-2.5"
      >
        {ingredients.map((ingredient, i) => {
          const isSelected = ingredient.name === selected;
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
              onClick={() => onSelect(ingredient.name)}
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

      {/* Fades the rail out at the right edge to hint that it scrolls. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-r from-transparent to-background" />
    </div>
  );
}
