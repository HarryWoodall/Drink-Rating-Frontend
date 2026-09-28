import type { authClient } from "@/lib/auth";
import type { UserFeedbackItem } from "@/types/auth";
import type { Drink, Feedback, TopRatedResponse } from "@/types/cocktail";

/** A complete drink; override just the fields a test cares about. */
export function makeDrink(overrides: Partial<Drink> = {}): Drink {
  return {
    id: "11007",
    name: "Margarita",
    image: "https://example.test/margarita.jpg",
    category: "Ordinary Drink",
    alcoholic: true,
    glass: "Cocktail glass",
    instructions: "Shake with ice, strain into a salt-rimmed glass.",
    tags: null,
    ingredients: [
      { id: 1, name: "Tequila", measure: "50ml" },
      { id: 2, name: "Lime juice", measure: "15ml" },
    ],
    ...overrides,
  };
}

export function makeFeedback(overrides: Partial<Feedback> = {}): Feedback {
  return {
    id: 1,
    drinkId: 11007,
    userId: "u2",
    comment: "Lovely and sharp.",
    rating: 4,
    createdAt: new Date("2026-03-14T12:00:00Z"),
    updatedAt: new Date("2026-03-14T12:00:00Z"),
    user: { id: "u2", name: "Sam Taylor", image: null },
    ...overrides,
  };
}

export function makeTopRated(
  drink: Partial<Drink> = {},
  avgRating = 4.5,
  numRatings = 10,
): TopRatedResponse {
  return { drink: makeDrink(drink), avgRating, numRatings };
}

export function makeUserFeedback(
  overrides: Partial<UserFeedbackItem> = {},
): UserFeedbackItem {
  return {
    id: 1,
    drinkId: "11007",
    comment: "Lovely and sharp.",
    rating: 4,
    createdAt: "2026-03-14T12:00:00Z",
    updatedAt: "2026-03-14T12:00:00Z",
    drink: makeDrink(),
    ...overrides,
  };
}

type SessionState = ReturnType<typeof authClient.useSession>;

export const testUser = {
  id: "u1",
  name: "Alex Morgan",
  email: "user@example.test",
  image: null,
};

/**
 * A value for a mocked `authClient.useSession`. Pass `null` for a signed-out
 * visitor; `pending` for the first render before the session has loaded.
 */
export function sessionState(
  user: Partial<typeof testUser> | null = testUser,
  { pending = false } = {},
): SessionState {
  return {
    data: user ? { user: { ...testUser, ...user } } : null,
    isPending: pending,
  } as unknown as SessionState;
}
