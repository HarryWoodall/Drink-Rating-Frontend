import { get } from "@/services/apiService";
import { DrinkSearchResponse } from "@/types/cocktail";
import { DrinkCategory } from "../types/FilterTypes";

export async function browseDrinks(
  alcoholic?: boolean,
  category?: DrinkCategory,
  page?: number,
  limit?: number,
): Promise<DrinkSearchResponse> {
  const searchParams = new URLSearchParams();

  if (alcoholic !== undefined) {
    searchParams.append("alcoholic", alcoholic.toString());
  }

  if (category !== undefined) {
    searchParams.append("category", category);
  }

  const queryParams = paginationQueryParams(searchParams, page, limit);
  const baseUrl = `/drinks`;

  return await get<DrinkSearchResponse>(
    appendSearchParms(baseUrl, queryParams),
  );
}

export async function searchCocktailsByName(
  name: string,
  alcoholic?: boolean,
  category?: DrinkCategory,
  page?: number,
  limit?: number,
): Promise<DrinkSearchResponse> {
  const searchParams = new URLSearchParams();

  if (alcoholic !== undefined) {
    searchParams.append("alcoholic", alcoholic.toString());
  }

  if (category !== undefined) {
    searchParams.append("category", category);
  }

  const queryParams = paginationQueryParams(searchParams, page, limit);
  const baseUrl = `/drinks/name/${encodeURIComponent(name)}`;

  return await get<DrinkSearchResponse>(
    appendSearchParms(baseUrl, queryParams),
  );
}

export async function searchCocktailsByIngredient(
  ingredient: string,
  alcoholic?: boolean,
  category?: DrinkCategory,
  page?: number,
  limit?: number,
): Promise<DrinkSearchResponse> {
  const searchParams = new URLSearchParams();

  if (alcoholic !== undefined) {
    searchParams.append("alcoholic", alcoholic.toString());
  }

  if (category !== undefined) {
    searchParams.append("category", category);
  }

  const queryParams = paginationQueryParams(searchParams, page, limit);
  const baseUrl = `/drinks/ingredient/${encodeURIComponent(ingredient)}`;

  console.log(
    JSON.stringify(
      {
        ingredient: ingredient,
        alcoholic: alcoholic,
        page: page,
        limit: limit,
      },
      null,
      2,
    ),
  );

  return await get<DrinkSearchResponse>(
    appendSearchParms(baseUrl, queryParams),
  );
}

function paginationQueryParams(
  currentSearchParams: URLSearchParams,
  page?: number,
  limit?: number,
) {
  if (page) {
    currentSearchParams.append("page", page.toString());
  }

  if (limit) {
    currentSearchParams.append("page", limit.toString());
  }

  return currentSearchParams;
}

function appendSearchParms(baseUrl: string, searchParams: URLSearchParams) {
  if (searchParams.toString() === "") {
    return baseUrl;
  }

  return `${baseUrl}?${searchParams.toString()}`;
}
