import { describe, expect, it } from "vitest";
import {
  baseImageStore,
  cocktailPageEvents,
  cocktailPath,
  favouritesPath,
  loginPath,
  profilePath,
  registerPath,
  resetPasswordRequest,
  searchPath,
} from "./paths";

describe("cocktailPath", () => {
  it("builds a cocktail route from a name", () => {
    expect(cocktailPath("Margarita")).toBe("/cocktail/Margarita");
  });

  it("encodes characters that would otherwise break the path", () => {
    expect(cocktailPath("Gin & Tonic")).toBe("/cocktail/Gin%20%26%20Tonic");
    expect(cocktailPath("50/50 Martini")).toBe("/cocktail/50%2F50%20Martini");
  });
});

describe("searchPath", () => {
  it("defaults to a name search across everything", () => {
    expect(searchPath("negroni")).toBe(
      "/search?q=negroni&type=name&filter=all",
    );
  });

  it("carries an explicit type and filter", () => {
    expect(searchPath("gin", "ingredient", "non-alcoholic")).toBe(
      "/search?q=gin&type=ingredient&filter=non-alcoholic",
    );
  });

  it("encodes the query string", () => {
    expect(searchPath("gin & it")).toBe(
      "/search?q=gin+%26+it&type=name&filter=all",
    );
  });
});

describe("static routes", () => {
  it("returns the fixed auth and account paths", () => {
    expect(loginPath()).toBe("/login");
    expect(registerPath()).toBe("/register");
    expect(profilePath()).toBe("/profile");
    expect(favouritesPath()).toBe("/favourites");
    expect(resetPasswordRequest()).toBe("/reset-password-request");
  });
});

describe("cocktailPageEvents", () => {
  it("builds the SSE endpoint for a drink", () => {
    expect(cocktailPageEvents("11007")).toBe("/api/events/cocktail/11007");
  });

  // useEvents skips opening an EventSource when this is undefined, so an
  // absent id must not produce a URL pointing at nothing.
  it("returns undefined without an id", () => {
    expect(cocktailPageEvents(undefined)).toBeUndefined();
    expect(cocktailPageEvents("")).toBeUndefined();
  });
});

describe("baseImageStore", () => {
  it("points at the public blob store", () => {
    expect(baseImageStore()).toBe(
      "https://blobs.harry-woodall-development.uk/public/image",
    );
  });
});
