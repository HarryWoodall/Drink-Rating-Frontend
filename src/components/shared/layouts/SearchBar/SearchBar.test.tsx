import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "./SearchBar";
import { renderWithProviders } from "@/test/utils";
import type { SearchType } from "@/types/search";

function renderSearchBar(
  props: Partial<React.ComponentProps<typeof SearchBar>> = {},
) {
  const handlers = {
    onSubmit: vi.fn((e: React.FormEvent) => e.preventDefault()),
    onChange: vi.fn(),
    onTypeChange: vi.fn(),
  };

  const view = renderWithProviders(
    <SearchBar type="name" {...handlers} {...props} />,
  );

  return { ...view, ...handlers };
}

describe("SearchBar", () => {
  it.each([
    ["name", "Search a cocktail by name…"],
    ["ingredient", "Search a cocktail by ingredient…"],
  ] as [SearchType, string][])(
    "prompts for a %s search",
    (type, placeholder) => {
      renderSearchBar({ type });

      const input = screen.getByTestId("search-bar-input");
      expect(input).toHaveAttribute("placeholder", placeholder);
      expect(input).toHaveAccessibleName("Search cocktails");
    },
  );

  it("reports each change to the query", async () => {
    const { onChange } = renderSearchBar();

    await userEvent.type(screen.getByTestId("search-bar-input"), "gin");

    expect(onChange).toHaveBeenLastCalledWith("gin");
    expect(screen.getByTestId("search-bar-input")).toHaveValue("gin");
  });

  it("submits on Enter", async () => {
    const { onSubmit } = renderSearchBar();

    await userEvent.type(screen.getByTestId("search-bar-input"), "gin{Enter}");

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("submits from the search-mode button", async () => {
    const { onSubmit } = renderSearchBar();

    await userEvent.click(screen.getByTestId("search-bar-submit"));

    expect(onSubmit).toHaveBeenCalled();
  });

  it("follows changes to defaultValue, e.g. on back navigation", () => {
    const { rerender, onSubmit, onChange, onTypeChange } = renderSearchBar({
      defaultValue: "gin",
    });
    expect(screen.getByTestId("search-bar-input")).toHaveValue("gin");

    rerender(
      <SearchBar
        type="name"
        defaultValue="rum"
        onSubmit={onSubmit}
        onChange={onChange}
        onTypeChange={onTypeChange}
      />,
    );

    expect(screen.getByTestId("search-bar-input")).toHaveValue("rum");
  });

  it("switches the search mode from the dropdown", async () => {
    const { onTypeChange } = renderSearchBar();

    const trigger = screen.getByTestId("search-bar-type-trigger");
    expect(trigger).toHaveAccessibleName("Search name, change search mode");

    await userEvent.click(trigger);
    await userEvent.click(
      await screen.findByTestId("search-bar-type-option-ingredient"),
    );

    expect(onTypeChange).toHaveBeenCalledWith("ingredient");
  });

  it("labels the mode button with the active search type", () => {
    renderSearchBar({ type: "ingredient" });

    expect(screen.getByTestId("search-bar-submit")).toHaveTextContent(
      "Ingredient",
    );
  });
});
