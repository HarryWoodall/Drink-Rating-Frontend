import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchResultsPagination } from "./SearchResultsPagination";
import { renderWithProviders } from "@/test/utils";

function renderPagination(currentPageNumber: number, totalPages: number) {
  const onClick = vi.fn();

  renderWithProviders(
    <SearchResultsPagination
      currentPageNumber={currentPageNumber}
      totalPages={totalPages}
      offsetAmmount={2}
      onClick={onClick}
    />,
  );

  return onClick;
}

/**
 * Every page number on offer, in document order: neighbours, the current
 * page, and the last-page jump. jsdom ignores the md: breakpoints.
 */
function pageNumbers() {
  return screen
    .getAllByTestId(/^pagination-(page-\d+|current|last)$/)
    .map((link) => link.textContent);
}

describe("SearchResultsPagination", () => {
  // The pagination spams console.log(offset) on render.
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("shows the neighbouring pages and a jump to the last page", () => {
    renderPagination(5, 20);

    expect(pageNumbers()).toEqual(["3", "4", "5", "6", "7", "20"]);
  });

  it("marks the current page", () => {
    renderPagination(5, 20);

    const current = screen.getByTestId("pagination-current");
    expect(current).toHaveTextContent("5");
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("drops Previous and lower pages on the first page", () => {
    renderPagination(1, 20);

    expect(screen.queryByTestId("pagination-previous")).not.toBeInTheDocument();
    expect(pageNumbers()).toEqual(["1", "2", "3", "20"]);
  });

  it("drops Next and the last-page jump on the last page", () => {
    renderPagination(20, 20);

    expect(screen.queryByTestId("pagination-next")).not.toBeInTheDocument();
    expect(screen.queryByTestId("pagination-last")).not.toBeInTheDocument();
    expect(pageNumbers()).toEqual(["18", "19", "20"]);
  });

  it("drops the ellipsis when the last page is next in line", () => {
    renderPagination(17, 20);

    expect(pageNumbers()).toEqual(["15", "16", "17", "18", "19", "20"]);
    expect(screen.queryByTestId("pagination-ellipsis")).not.toBeInTheDocument();
  });

  it("shows an ellipsis when pages are skipped before the last", () => {
    renderPagination(5, 20);

    expect(screen.getByTestId("pagination-ellipsis")).toBeInTheDocument();
  });

  it("shows only the pages that exist for a short result set", () => {
    renderPagination(1, 2);

    expect(pageNumbers()).toEqual(["1", "2"]);
  });

  it("labels the previous and next links", () => {
    renderPagination(5, 20);

    expect(screen.getByTestId("pagination-previous")).toHaveAccessibleName(
      /previous/i,
    );
    expect(screen.getByTestId("pagination-next")).toHaveAccessibleName(/next/i);
  });

  it.each([
    ["pagination-previous", 4],
    ["pagination-next", 6],
    ["pagination-page-3", 3],
    ["pagination-page-7", 7],
    ["pagination-last", 20],
  ])("jumps to the right page from %s", async (testId, page) => {
    const onClick = renderPagination(5, 20);

    await userEvent.click(screen.getByTestId(testId));

    expect(onClick).toHaveBeenCalledWith(page);
  });
});
