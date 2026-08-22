import { DrinkDetail, extractIngredients } from "@/types/cocktail";

interface DrinkIngredientsProps {
  cocktail: DrinkDetail;
}

export function DrinkIngredients({ cocktail }: DrinkIngredientsProps) {
  const ingredients = extractIngredients(cocktail);
  return (
    <p className="text-[0.8em] font-bold italic uppercase tracking-[0.16em] text-amber-bright">
      {ingredients
        .filter(Boolean)
        .map((x) => x.name)
        .join(", ")}
    </p>
  );
}
