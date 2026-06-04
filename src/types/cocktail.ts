export interface DbCocktail {
  id: number;
  name: string;
  description: string;
  rating: number;
  createdAt: string;
}

export interface CocktailDbDrink {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strCategory: string;
  strAlcoholic: string;
  strInstructions: string;
  strIngredient1: string | null;
  strIngredient2: string | null;
  strIngredient3: string | null;
  strIngredient4: string | null;
  strIngredient5: string | null;
}

export interface EnrichedCocktail extends DbCocktail {
  thumbUrl?: string;
}
