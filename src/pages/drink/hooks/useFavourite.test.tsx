import { act, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { useToggleFavourite } from "./useFavourite";
import { addFavourite, removeFavourite } from "@/services/favouritesService";
import { createTestQueryClient, renderHookWithProviders } from "@/test/utils";
import { makeDrink } from "@/test/fixtures";
import type { Drink } from "@/types/cocktail";

vi.mock("@/services/favouritesService", () => ({
  addFavourite: vi.fn(),
  removeFavourite: vi.fn(),
}));

vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));

/** A promise the test resolves or rejects by hand, to observe the in-flight state. */
function deferred() {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("useToggleFavourite", () => {
  const margarita = makeDrink({ id: "11007", favourite: false });
  const negroni = makeDrink({ id: "11003", name: "Negroni", favourite: true });

  /** A client seeded with a cocktail page and a favourites list. */
  function seededClient() {
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(["cocktail", "11007"], margarita);
    queryClient.setQueryData(["cocktail", "11003"], negroni);
    queryClient.setQueryData(["favourites"], [
      { ...margarita, favourite: true },
      negroni,
    ]);
    return queryClient;
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds the favourite when toggled on and removes it when toggled off", async () => {
    vi.mocked(addFavourite).mockResolvedValue();
    vi.mocked(removeFavourite).mockResolvedValue();

    const { result } = renderHookWithProviders(() =>
      useToggleFavourite("11007"),
    );

    await act(() => result.current.mutateAsync(true));
    expect(addFavourite).toHaveBeenCalledWith("11007");

    await act(() => result.current.mutateAsync(false));
    expect(removeFavourite).toHaveBeenCalledWith("11007");
  });

  it("flips the flag in both caches before the request settles", async () => {
    const request = deferred();
    vi.mocked(addFavourite).mockReturnValue(request.promise);
    const queryClient = seededClient();

    const { result } = renderHookWithProviders(
      () => useToggleFavourite("11007"),
      { queryClient },
    );

    act(() => result.current.mutate(true));

    await waitFor(() =>
      expect(
        queryClient.getQueryData<Drink>(["cocktail", "11007"])?.favourite,
      ).toBe(true),
    );

    // Other drinks are untouched.
    expect(queryClient.getQueryData<Drink>(["cocktail", "11003"])).toEqual(
      negroni,
    );
    // On the favourites list the card is flipped, not dropped.
    const favourites = queryClient.getQueryData<Drink[]>(["favourites"]);
    expect(favourites).toHaveLength(2);
    expect(favourites?.find((d) => d.id === "11007")?.favourite).toBe(true);

    await act(async () => request.resolve());
  });

  it("rolls both caches back and toasts when the request fails", async () => {
    vi.mocked(removeFavourite).mockRejectedValue(new Error("500"));
    const queryClient = seededClient();
    const favouritesBefore = queryClient.getQueryData(["favourites"]);

    const { result } = renderHookWithProviders(
      () => useToggleFavourite("11003"),
      { queryClient },
    );

    await act(async () => {
      await result.current.mutateAsync(false).catch(() => {});
    });

    expect(queryClient.getQueryData(["cocktail", "11003"])).toEqual(negroni);
    expect(queryClient.getQueryData(["favourites"])).toEqual(favouritesBefore);
    expect(toast.error).toHaveBeenCalledWith("Couldn't update your favourites");
  });

  it("refetches the cocktail and favourites queries once settled", async () => {
    vi.mocked(addFavourite).mockResolvedValue();
    const queryClient = seededClient();
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHookWithProviders(
      () => useToggleFavourite("11007"),
      { queryClient },
    );

    await act(() => result.current.mutateAsync(true));

    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["cocktail"] });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["favourites"] });
  });
});
