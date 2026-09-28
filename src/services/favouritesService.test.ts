import { addFavourite, fetchFavourites, removeFavourite } from "./favouritesService";
import { del, get, post } from "./apiService";
import { makeDrink } from "@/test/fixtures";

vi.mock("./apiService", () => ({
  get: vi.fn(),
  post: vi.fn(),
  del: vi.fn(),
}));

describe("favouritesService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("addFavourite posts an empty body to the drink's favourite endpoint", async () => {
    vi.mocked(post).mockResolvedValue(undefined);

    await addFavourite("11007");

    expect(post).toHaveBeenCalledWith("/drinks/11007/favourite", {});
  });

  it("removeFavourite deletes the drink's favourite", async () => {
    vi.mocked(del).mockResolvedValue(undefined);

    await removeFavourite("11007");

    expect(del).toHaveBeenCalledWith("/drinks/11007/favourite");
  });

  it("encodes drink ids so they can't break out of the path", async () => {
    await addFavourite("a/b c");
    await removeFavourite("a/b c");

    expect(post).toHaveBeenCalledWith("/drinks/a%2Fb%20c/favourite", {});
    expect(del).toHaveBeenCalledWith("/drinks/a%2Fb%20c/favourite");
  });

  it("fetchFavourites returns the signed-in user's drinks", async () => {
    const drinks = [makeDrink()];
    vi.mocked(get).mockResolvedValue(drinks);

    await expect(fetchFavourites()).resolves.toBe(drinks);
    expect(get).toHaveBeenCalledWith("/drinks/favourites");
  });
});
