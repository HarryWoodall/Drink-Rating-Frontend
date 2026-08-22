export interface DbDrink {
  id: number;
  name: string;
  description: string;
  rating: number;
  createdAt: string;
}

export interface EnrichedCocktail extends DbDrink {
  thumbUrl?: string;
}

export type TopRatedResponse = {
  drink: Drink;
  avgRating: number;
  numRatings: number;
};

export type TrendingResponse = {
  drink: Drink;
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
    value: Drink;
    avgRating: number;
    numRatings: number;
  }[];
  ingredient: string;
  avgRating: number;
  numRatings: number;
};

export interface Ingredient {
  name: string;
  measure: string | null;
}

export type Rating = {
  avgRating: number;
  numRatings: number;
};

/**
 * A drink as returned by every server endpoint that serves one. The server has
 * already collapsed CocktailDB's sparse strIngredientN / strMeasureN pairs into
 * `ingredients`, so the client never has to.
 */
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

/** Display label for a drink's `alcoholic` flag. */
export function alcoholicLabel(alcoholic: boolean): string {
  return alcoholic ? "Alcoholic" : "Non-alcoholic";
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
