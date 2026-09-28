import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchFilters } from "./SearchFilters";
import { renderWithProviders } from "@/test/utils";

function renderFilters(
  props: Partial<React.ComponentProps<typeof SearchFilters>> = {},
) {
  const handlers = { onFilterChange: vi.fn(), onCategoryChange: vi.fn() };

  renderWithProviders(
    <SearchFilters
      filter="all"
      category="All"
      resultCount={12}
      {...handlers}
      {...props}
    />,
  );

  return handlers;
}

describe("SearchFilters", () => {
  it.each([
    [0, "0 results"],
    [1, "1 result"],
    [12, "12 results"],
  ])("shows the count for %i", (resultCount, text) => {
    renderFilters({ resultCount });

    expect(screen.getByTestId("search-filters-result-count")).toHaveTextContent(
      text,
    );
  });

  it("marks the active alcohol filter as pressed", () => {
    renderFilters({ filter: "non-alcoholic" });

    expect(screen.getByTestId("alcohol-filter-non-alcoholic")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByTestId("alcohol-filter-all")).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it.each(["all", "alcoholic", "non-alcoholic"])(
    "reports the %s filter when clicked",
    async (value) => {
      const { onFilterChange } = renderFilters();

      await userEvent.click(screen.getByTestId(`alcohol-filter-${value}`));

      expect(onFilterChange).toHaveBeenCalledWith(value);
    },
  );

  it("labels the category trigger with the active category", () => {
    renderFilters({ category: "Shot" });

    expect(screen.getByTestId("category-filter-active")).toHaveTextContent(
      "Shot",
    );
    expect(screen.getByTestId("category-filter-trigger")).toHaveAccessibleName(
      "Category: Shot. Change category filter",
    );
  });

  it("falls back to All for an unknown category", () => {
    renderFilters({ category: "Nonsense" });

    expect(screen.getByTestId("category-filter-active")).toHaveTextContent(
      "All",
    );
  });

  it("picks a category from the dropdown", async () => {
    const { onCategoryChange } = renderFilters();

    await userEvent.click(screen.getByTestId("category-filter-trigger"));
    await userEvent.click(
      await screen.findByTestId("category-filter-option-coffee-tea"),
    );

    expect(onCategoryChange).toHaveBeenCalledWith("Coffee / Tea");
  });
});
