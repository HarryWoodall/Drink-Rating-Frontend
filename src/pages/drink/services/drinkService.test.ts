import {
  fetchCocktailById,
  fetchFeedback,
  postFeedback,
  putFeedback,
} from "./drinkService";
import { get, post, put } from "@/services/apiService";
import { makeDrink } from "@/test/fixtures";

vi.mock("@/services/apiService", () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}));

describe("drinkService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetchCocktailById gets the drink by encoded id", async () => {
    const drink = makeDrink();
    vi.mocked(get).mockResolvedValue(drink);

    await expect(fetchCocktailById("Pina Colada")).resolves.toBe(drink);
    expect(get).toHaveBeenCalledWith("/drinks/id/Pina%20Colada");
  });

  it("postFeedback sends the comment and rating", async () => {
    await postFeedback("11007", "Great", 5);

    expect(post).toHaveBeenCalledWith("/drinks/11007/feedback", {
      comment: "Great",
      rating: 5,
    });
  });

  it("putFeedback updates the given feedback entry", async () => {
    await putFeedback("11007", 42, "Changed my mind", 2);

    expect(put).toHaveBeenCalledWith("/drinks/11007/feedback/42", {
      comment: "Changed my mind",
      rating: 2,
    });
  });

  it("fetchFeedback gets the drink's feedback", async () => {
    const response = { userHasCommented: false, feedback: [] };
    vi.mocked(get).mockResolvedValue(response);

    await expect(fetchFeedback("11007")).resolves.toBe(response);
    expect(get).toHaveBeenCalledWith("/drinks/11007/feedback");
  });
});
