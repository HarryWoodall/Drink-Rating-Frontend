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

export type TopRatedResponse = {
  drink: CocktailDetail;
  avgRating: number;
  numRatings: number;
};

export type TrendingResponse = {
  drink: CocktailDetail;
  avgRating: number;
  numRatings: number;
  numClients: number;
};

/**
 * Full CocktailDB drink as returned by the server's `/api/cocktails/id/:id`
 * lookup. Ingredients and measures are sparse string fields (1..15).
 */
export interface CocktailDetail {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strCategory: string;
  strAlcoholic: string;
  strGlass: string;
  strInstructions: string;
  strTags?: string | null;
  [key: `strIngredient${number}`]: string | null | undefined;
  [key: `strMeasure${number}`]: string | null | undefined;
}

export interface Ingredient {
  name: string;
  measure: string | null;
}

/** Collapse the sparse strIngredientN / strMeasureN pairs into a clean list. */
export function extractIngredients(drink: CocktailDetail): Ingredient[] {
  const out: Ingredient[] = [];
  for (let i = 1; i <= 15; i++) {
    const name = drink[`strIngredient${i}`];
    if (name && name.trim()) {
      const measure = drink[`strMeasure${i}`];
      out.push({ name: name.trim(), measure: measure?.trim() || null });
    }
  }
  return out;
}

export type User = {
  id: string;
  name: string;
  image: string | null;
};

export type Comment = {
  id: number;
  drinkId: number;
  userId: string | null;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  user: User | null;
};

export type Rating = {
  id: number;
  drinkId: number;
  userId: string | null;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
  user: User | null;
};

export type AverageRating = {
  avgRating: number;
  numRatings: number;
};

export type FeedbackResponse = {
  userHasCommented: boolean;
  feedback: Feedback[];
};

export type Feedback = {
  id: number;
  drinkId: number;
  userId: string | null;
  comment: string;
  rating: number | null;
  createdAt: Date;
  updatedAt: Date;
  user: User | null;
};
