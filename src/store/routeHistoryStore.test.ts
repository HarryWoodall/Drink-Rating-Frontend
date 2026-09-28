import { beforeEach, describe, expect, it } from "vitest";
import { useRouteHistoryStore } from "./routeHistoryStore";

/** The store is a module singleton, so each test starts from a clean slate. */
const initialState = useRouteHistoryStore.getState();

function state() {
  return useRouteHistoryStore.getState();
}

beforeEach(() => {
  useRouteHistoryStore.setState(initialState, true);
});

describe("setPath", () => {
  it("records the first visit without inventing a previous page", () => {
    state().setPath("/favourites", "Back to favourites");

    expect(state().currentPath).toBe("/favourites");
    expect(state().currentBackText).toBe("Back to favourites");
    expect(state().previousPath).toBeNull();
    expect(state().previousBackText).toBeNull();
  });

  it("shifts the current page into previous when the path changes", () => {
    state().setPath("/favourites", "Back to favourites");
    state().setPath("/cocktail/11007", "Back to cocktail");

    expect(state().currentPath).toBe("/cocktail/11007");
    expect(state().currentBackText).toBe("Back to cocktail");
    expect(state().previousPath).toBe("/favourites");
    expect(state().previousBackText).toBe("Back to favourites");
  });

  it("carries the query alongside each path", () => {
    state().setPath("/search", "Back to search", "?q=gin");
    state().setPath("/cocktail/11007", "Back to cocktail");

    expect(state().previousPath).toBe("/search");
    expect(state().previousQuery).toBe("?q=gin");
    expect(state().currentQuery).toBeUndefined();
  });

  // Pages call setPath from an effect on every render, so a repeat call for
  // the same path must not push the page into its own history.
  it("ignores a repeat call for the same path and query", () => {
    state().setPath("/search", "Back to search", "?q=gin");
    state().setPath("/cocktail/11007", "Back to cocktail");
    state().setPath("/cocktail/11007", "Back to cocktail");

    expect(state().previousPath).toBe("/search");
    expect(state().previousQuery).toBe("?q=gin");
  });

  it("updates the query in place when only the query changes", () => {
    state().setPath("/favourites", "Back to favourites");
    state().setPath("/search", "Back to search", "?q=gin");
    state().setPath("/search", "Back to search", "?q=rum");

    expect(state().currentPath).toBe("/search");
    expect(state().currentQuery).toBe("?q=rum");
    // Paging through search results shouldn't make "back" point at search.
    expect(state().previousPath).toBe("/favourites");
    expect(state().previousBackText).toBe("Back to favourites");
  });
});

describe("resetPath", () => {
  // The home page resets rather than sets, so BackLink has nowhere to go back to.
  it("clears the previous page", () => {
    state().setPath("/favourites", "Back to favourites");
    state().setPath("/cocktail/11007", "Back to cocktail");
    state().resetPath("/", "Home");

    expect(state().currentPath).toBe("/");
    expect(state().currentBackText).toBe("Home");
    expect(state().previousPath).toBeNull();
    expect(state().previousQuery).toBeNull();
    expect(state().previousBackText).toBeNull();
  });
});

describe("fullPreviousPath", () => {
  it("is empty when there is nowhere to go back to", () => {
    expect(state().fullPreviousPath()).toBe("");

    state().setPath("/cocktail/11007", "Back to cocktail");
    expect(state().fullPreviousPath()).toBe("");
  });

  it("returns the previous path on its own when it had no query", () => {
    state().setPath("/favourites", "Back to favourites");
    state().setPath("/cocktail/11007", "Back to cocktail");

    expect(state().fullPreviousPath()).toBe("/favourites");
  });

  it("re-joins the previous path with its query", () => {
    state().setPath("/search", "Back to search", "?q=gin&type=ingredient");
    state().setPath("/cocktail/11007", "Back to cocktail");

    expect(state().fullPreviousPath()).toBe("/search?q=gin&type=ingredient");
  });
});
