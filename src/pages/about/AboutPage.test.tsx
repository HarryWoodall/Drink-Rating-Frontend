import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/utils";
import { AboutPage } from "./AboutPage";

describe("AboutPage", () => {
  it("renders the heading", () => {
    renderWithProviders(<AboutPage />);

    expect(screen.getByTestId("about-page")).toBeInTheDocument();
    expect(screen.getByTestId("about-page-heading")).toHaveTextContent("About");
  });

  it.each([
    ["about-row-author", "Made by", "about-link-linkedin"],
    ["about-row-source", "Source", "about-link-github"],
    ["about-row-data-source", "Data source", "about-link-cocktaildb"],
  ])("labels the %s row and puts its link inside it", (row, label, link) => {
    renderWithProviders(<AboutPage />);

    expect(screen.getByTestId(`${row}-label`)).toHaveTextContent(label);
    expect(screen.getByTestId(`${row}-value`)).toContainElement(
      screen.getByTestId(link),
    );
  });

  it.each([
    ["about-link-linkedin", "LinkedIn", /^https:\/\/www\.linkedin\.com\/in\//],
    ["about-link-github", "Github", /^https:\/\/github\.com\//],
    ["about-link-cocktaildb", "TheCocktailDB", /^https:\/\/www\.thecocktaildb\.com\//],
  ])("links %s to its external site", (testId, name, href) => {
    renderWithProviders(<AboutPage />);

    const link = screen.getByTestId(testId);
    expect(link.getAttribute("href")).toMatch(href);
    // The arrow icon is decorative, so it stays out of the accessible name.
    expect(link).toHaveAccessibleName(name);
  });

  it("opens every external link in a new tab without leaking the opener", () => {
    renderWithProviders(<AboutPage />);

    for (const testId of [
      "about-link-linkedin",
      "about-link-github",
      "about-link-cocktaildb",
    ]) {
      const link = screen.getByTestId(testId);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});
