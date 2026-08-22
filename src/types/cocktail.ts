export interface DbDrink {
  id: number;
  name: string;
  description: string;
  rating: number;
  createdAt: string;
}

export interface DbDrinkDetails {
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
  favourite?: boolean;
}

/**
 * The fields a cocktail card / favourite toggle needs — the common ground
 * between CocktailDbDrink and CocktailDetail, both of which satisfy it.
 */
export type DrinkSummary = Pick<
  DbDrinkDetails,
  "idDrink" | "strDrink" | "strDrinkThumb" | "strCategory" | "strAlcoholic"
> & { favourite?: boolean };

export interface EnrichedCocktail extends DbDrink {
  thumbUrl?: string;
}

export type TopRatedResponse = {
  drink: DrinkDetail;
  avgRating: number;
  numRatings: number;
};

export type TrendingResponse = {
  drink: DrinkDetail;
  avgRating: number;
  numRatings: number;
  numClients: number;
};

/** An ingredient in the showcase tab rail. Mirrors the server's IngredientSearchTerm. */
export type TopIngredient = {
  name: string;
  alternatives: string[];
  /** Number of drinks poured with it — not sent by the server yet. */
  count?: number;
};

export type IngredientShowcaseResponse = {
  drinks: {
    value: DrinkDetail;
    avgRating: number;
    numRatings: number;
  }[];
  ingredient: string;
  avgRating: number;
  numRatings: number;
};

/**
 * Full CocktailDB drink as returned by the server's `/api/cocktails/id/:id`
 * lookup. Ingredients and measures are sparse string fields (1..15).
 */
export interface DrinkDetail {
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
  favourite?: boolean;
}

export interface Ingredient {
  name: string;
  measure: string | null;
}

export type Rating = {
  avgRating: number;
  numRatings: number;
};

export type Drink = {
  id: string;
  name: string;
  image: string;
  category: string;
  alcoholic: boolean;
  glass: string;
  instructions: string;
  tags: string | null;
  ingredients: Ingredient[];
  favourite?: boolean;
  rating?: Rating;
};

/** Collapse the sparse strIngredientN / strMeasureN pairs into a clean list. */
export function extractIngredients(drink: DrinkDetail): Ingredient[] {
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
