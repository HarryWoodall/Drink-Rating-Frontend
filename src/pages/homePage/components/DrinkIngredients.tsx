import { Drink } from "@/types/cocktail";

interface DrinkIngredientsProps {
  cocktail: Drink;
}

export function DrinkIngredients({ cocktail }: DrinkIngredientsProps) {
  return (
    <p className="text-[0.8em] font-bold italic uppercase tracking-[0.16em] text-amber-bright">
      {cocktail.ingredients.map((x) => x.name).join(", ")}
    </p>
  );
}
