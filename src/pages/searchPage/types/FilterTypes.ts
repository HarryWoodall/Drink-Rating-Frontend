export const drinkCategories = [
  "All",
  "Beer",
  "Cocktail",
  "Cocoa",
  "Coffee / Tea",
  "Homemade Liqueur",
  "Ordinary Drink",
  "Other / Unknown",
  "Punch / Party Drink",
  "Shake",
  "Shot",
  "Soft Drink",
] as const;

export type DrinkCategory = (typeof drinkCategories)[number];
