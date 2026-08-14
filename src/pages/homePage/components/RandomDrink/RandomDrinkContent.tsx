import { DrinkDetail } from "@/types/cocktail";
import { DrinkDescription } from "../DrinkDescription";
import { DrinkIngredients } from "../DrinkIngredients";

interface RandomDrinkContentProps {
  drink: DrinkDetail;
}

export function RandomDrinkContent({ drink }: RandomDrinkContentProps) {
  return (
    <>
      <h3 className="font-serif text-4xl font-normal italic leading-none">
        {drink.strDrink}
      </h3>
      <DrinkDescription
        alcoholic={drink.strAlcoholic}
        category={drink.strCategory}
      />
      <div className="mt-4 max-w-[48ch]">
        <DrinkIngredients cocktail={drink} />
      </div>

      {drink.strInstructions && (
        <p className="max-w-[48ch] text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {drink.strInstructions}
        </p>
      )}
    </>
  );
}
