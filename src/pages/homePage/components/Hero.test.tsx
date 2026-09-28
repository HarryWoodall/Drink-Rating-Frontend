import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation } from "react-router-dom";
import { Hero } from "./Hero";
import { renderWithProviders } from "@/test/utils";

function LocationProbe() {
  const { pathname, search } = useLocation();
  return <output data-testid="location">{pathname + search}</output>;
}

function renderHero() {
  return renderWithProviders(
    <>
      <Hero />
      <LocationProbe />
    </>,
  );
}

describe("Hero", () => {
  it("renders the headline and an empty search bar", () => {
    renderHero();

    expect(screen.getByTestId("hero-heading")).toHaveTextContent(
      "Every great night starts with the right pour.",
    );
    expect(screen.getByTestId("search-bar-input")).toHaveValue("");
  });

  it("searches by name from the hero search", async () => {
    renderHero();

    await userEvent.type(
      screen.getByTestId("search-bar-input"),
      "  mojito {Enter}",
    );

    expect(screen.getByTestId("location")).toHaveTextContent(
      "/search?q=mojito&type=name&filter=all",
    );
  });

  it("searches by ingredient once the mode is switched", async () => {
    renderHero();

    await userEvent.click(screen.getByTestId("search-bar-type-trigger"));
    await userEvent.click(
      await screen.findByTestId("search-bar-type-option-ingredient"),
    );
    await userEvent.type(screen.getByTestId("search-bar-input"), "gin{Enter}");

    expect(screen.getByTestId("location")).toHaveTextContent(
      "/search?q=gin&type=ingredient&filter=all",
    );
  });

  it("stays put on an empty search", async () => {
    renderHero();

    await userEvent.type(screen.getByTestId("search-bar-input"), "   {Enter}");

    expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
  });
});
