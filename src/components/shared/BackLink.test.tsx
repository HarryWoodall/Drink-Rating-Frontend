import { renderWithProviders } from "@/test/utils";
import { BackLink } from "./BackLink";
import { screen } from "@testing-library/react";
import { useRouteHistoryStore } from "@/store/routeHistoryStore";

describe("BackLink", () => {
  const { resetPath, setPath } = useRouteHistoryStore.getState();

  beforeEach(() => {
    resetPath("/", "Home");
  });

  it("BankLink links to the previous page using its label", async () => {
    setPath("/about", "About");
    setPath("/drink", "Drink");

    renderWithProviders(<BackLink />);

    const backlink = screen.getByTestId("back-link");

    expect(backlink).toBeInTheDocument();
    expect(backlink).toHaveTextContent("About");
    expect(backlink).toHaveAttribute("href", "/about");
  });

  it("BankLink links to the previous page with its query string", async () => {
    setPath("/about", "About", "?drinkid=99");
    setPath("/drink", "Drink");

    renderWithProviders(<BackLink />);

    const backlink = screen.getByTestId("back-link");

    expect(backlink).toBeInTheDocument();
    expect(backlink).toHaveTextContent("About");
    expect(backlink).toHaveAttribute("href", "/about?drinkid=99");
  });

  it("BankLink links back to home when no history", async () => {
    renderWithProviders(<BackLink />);

    const backlink = screen.getByTestId("back-link");

    expect(backlink).toBeInTheDocument();
    expect(backlink).toHaveTextContent("Home");
    expect(backlink).toHaveAttribute("href", "/");
  });
});
