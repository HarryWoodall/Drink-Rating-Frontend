import { useState } from "react";
import { useTopIngredients } from "../../hooks/useTopIngredients";
import { SectionHeading } from "../SectionHeading";
import { IngredientTabs } from "./IngredientTabs";
import { TopIngredient } from "@/types/cocktail";
import { IngredientDrinkList } from "./IngredientDrinkList";

export function IngredientShowcaseSection() {
  const { ingredients, loading, error } = useTopIngredients();

  const [picked, setPicked] = useState<TopIngredient>();

  function onIngredientSelection(ingredient: TopIngredient) {
    setPicked(ingredient);
  }

  if (ingredients.length > 0 && picked === undefined) {
    setPicked(ingredients[0]);
  }

  return (
    <section id="by-ingredient" className="scroll-mt-24 py-8">
      <SectionHeading
        num="04"
        title="Top Drink by Ingredient"
        blurb="Pick a bottle. See what the room pours best with it."
      />

      {/* TODO - Create a skelington for this component on load */}
      {ingredients.length > 0 && (
        <IngredientTabs
          ingredients={ingredients}
          selected={picked}
          onSelect={onIngredientSelection}
        />
      )}

      {picked && <IngredientDrinkList picked={picked} />}
    </section>
  );
}
