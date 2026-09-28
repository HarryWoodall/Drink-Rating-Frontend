import { act, screen } from "@testing-library/react";
import { Banner } from "./Banner";
import { authClient } from "@/lib/auth";
import { renderWithProviders } from "@/test/utils";
import { sessionState } from "@/test/fixtures";

vi.mock("@/lib/auth", () => ({
  authClient: { useSession: vi.fn(), signOut: vi.fn() },
}));

function scrollTo(y: number) {
  act(() => {
    Object.defineProperty(window, "scrollY", { value: y, configurable: true });
    window.dispatchEvent(new Event("scroll"));
  });
}

describe("Banner", () => {
  beforeEach(() => {
    vi.mocked(authClient.useSession).mockReturnValue(sessionState(null));
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  });

  it("links the wordmark home", () => {
    renderWithProviders(<Banner />);

    expect(screen.getByTestId("header-home-link")).toHaveAttribute("href", "/");
  });

  it("renders the nav", () => {
    renderWithProviders(<Banner />);

    expect(screen.getByTestId("nav-link-browse")).toBeInTheDocument();
  });

  it("gains a solid background once the page scrolls", () => {
    renderWithProviders(<Banner />);
    const banner = screen.getByTestId("banner");

    expect(banner).toHaveAttribute("data-scrolled", "false");
    expect(banner).not.toHaveClass("backdrop-blur");

    scrollTo(100);

    expect(banner).toHaveAttribute("data-scrolled", "true");
    expect(banner).toHaveClass("backdrop-blur");
  });
});
