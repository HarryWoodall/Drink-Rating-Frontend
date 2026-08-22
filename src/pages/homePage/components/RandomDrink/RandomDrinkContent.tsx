import { CardTitle } from "@/components/ui/card";
import { Drink } from "@/types/cocktail";
import { DrinkDescription } from "../DrinkDescription";
import { DrinkIngredients } from "../DrinkIngredients";

interface RandomDrinkContentProps {
  drink: Drink;
}

/** Name + category line — belongs in the card's header slot. */
export function RandomDrinkHeading({ drink }: RandomDrinkContentProps) {
  return (
    <>
      <CardTitle className="font-serif text-2xl md:text-4xl font-normal italic leading-none">
        {drink.name}
      </CardTitle>
      <DrinkDescription
        alcoholic={drink.alcoholic}
        category={drink.category}
      />
    </>
  );
}

/** Ingredients + instructions — belongs in the card's content slot. */
export function RandomDrinkDetails({ drink }: RandomDrinkContentProps) {
  return (
    <>
      <div className="mt-1 max-w-[48ch]">
        <DrinkIngredients cocktail={drink} />
      </div>

      {drink.instructions && (
        <p className="max-w-[48ch] text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {drink.instructions}
        </p>
      )}
    </>
  );
}
