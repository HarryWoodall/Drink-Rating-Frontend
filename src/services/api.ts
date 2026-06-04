import { CocktailServerResult } from "@/hooks/types/api";
import type { CocktailDbDrink, DbCocktail } from "@/types/cocktail";

const BASE_URL = "http://localhost:3000/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export async function fetchDbCocktails(): Promise<DbCocktail[]> {
  return get<DbCocktail[]>("/cocktails");
}

export async function getRandomCocktail(): Promise<CocktailDbDrink> {
  const res = await get<CocktailDbDrink>("/cocktails/random");
  return res;
}

export async function searchCocktailByName(
  name: string,
): Promise<CocktailDbDrink | null> {
  const data = await get<{ drinks: CocktailDbDrink[] | null }>(
    `/cocktails/name}`,
  );
  return data.drinks?.[0] ?? null;
}

// Stub until backend implements /api/cocktails/random
const MOCK_COCKTAILS: CocktailDbDrink[] = [
  {
    idDrink: "11007",
    strDrink: "Margarita",
    strDrinkThumb:
      "https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg",
    strCategory: "Ordinary Drink",
    strAlcoholic: "Alcoholic",
    strInstructions:
      "Rub the rim of the glass with the lime slice to make the salt stick to it. Take care to moisten only the outer rim and sprinkle the salt on it.",
    strIngredient1: "Tequila",
    strIngredient2: "Triple sec",
    strIngredient3: "Lime juice",
    strIngredient4: "Salt",
    strIngredient5: null,
  },
  {
    idDrink: "11001",
    strDrink: "Old Fashioned",
    strDrinkThumb:
      "https://www.thecocktaildb.com/images/media/drink/vrwquq1478252802.jpg",
    strCategory: "Cocktail",
    strAlcoholic: "Alcoholic",
    strInstructions:
      "Place sugar cube in old fashioned glass and saturate with bitters, add a dash of plain water.",
    strIngredient1: "Bourbon",
    strIngredient2: "Angostura bitters",
    strIngredient3: "Sugar",
    strIngredient4: "Water",
    strIngredient5: null,
  },
  {
    idDrink: "178332",
    strDrink: "Negroni",
    strDrinkThumb:
      "https://www.thecocktaildb.com/images/media/drink/qgdu971561574065.jpg",
    strCategory: "Cocktail",
    strAlcoholic: "Alcoholic",
    strInstructions:
      "Stir into glass over ice, garnish and serve. If the olives are big, add three.",
    strIngredient1: "Gin",
    strIngredient2: "Sweet Vermouth",
    strIngredient3: "Campari",
    strIngredient4: null,
    strIngredient5: null,
  },
  {
    idDrink: "11728",
    strDrink: "Mojito",
    strDrinkThumb:
      "https://www.thecocktaildb.com/images/media/drink/metwgh1606770327.jpg",
    strCategory: "Cocktail",
    strAlcoholic: "Alcoholic",
    strInstructions:
      "Muddle mint leaves with sugar and lime juice. Add a splash of soda water and fill the glass with cracked ice.",
    strIngredient1: "Light rum",
    strIngredient2: "Lime",
    strIngredient3: "Sugar",
    strIngredient4: "Mint",
    strIngredient5: "Soda water",
  },
  {
    idDrink: "14229",
    strDrink: "Aperol Spritz",
    strDrinkThumb:
      "https://www.thecocktaildb.com/images/media/drink/iloasq1587661731.jpg",
    strCategory: "Cocktail",
    strAlcoholic: "Alcoholic",
    strInstructions:
      "Build into a wine glass with ice. Add Aperol, then prosecco, then a splash of soda. Stir gently.",
    strIngredient1: "Aperol",
    strIngredient2: "Prosecco",
    strIngredient3: "Soda water",
    strIngredient4: "Orange slice",
    strIngredient5: null,
  },
  {
    idDrink: "17222",
    strDrink: "Dark 'N' Stormy",
    strDrinkThumb:
      "https://www.thecocktaildb.com/images/media/drink/aymfwe1504819901.jpg",
    strCategory: "Cocktail",
    strAlcoholic: "Alcoholic",
    strInstructions:
      "Fill glass with ice cubes. Squeeze lime juice over ice. Pour ginger beer, then float rum on top.",
    strIngredient1: "Dark rum",
    strIngredient2: "Ginger beer",
    strIngredient3: "Lime juice",
    strIngredient4: null,
    strIngredient5: null,
  },
];

export async function fetchRandomCocktails(
  count: number,
): Promise<CocktailDbDrink> {
  return await getRandomCocktail();
}
