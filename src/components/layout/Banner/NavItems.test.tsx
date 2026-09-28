import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NavItems } from "./NavItems";
import { authClient } from "@/lib/auth";
import { renderWithProviders } from "@/test/utils";
import { sessionState, testUser } from "@/test/fixtures";

vi.mock("@/lib/auth", () => ({
  authClient: { useSession: vi.fn(), signOut: vi.fn() },
}));

/**
 * NavItems renders the links twice — in the mobile drawer (closed, so not in
 * the DOM until opened) and inline for md+. jsdom ignores the responsive
 * `hidden` classes, so the inline desktop nav is always present.
 */
describe("NavItems", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("desktop nav", () => {
    it("shows the public links and the login/sign-up links when signed out", () => {
      vi.mocked(authClient.useSession).mockReturnValue(sessionState(null));

      renderWithProviders(<NavItems />);

      expect(screen.getByTestId("nav-link-browse")).toHaveAttribute(
        "href",
        "/search",
      );
      expect(screen.getByTestId("nav-link-about")).toHaveAttribute(
        "href",
        "/about",
      );
      expect(
        screen.queryByTestId("nav-link-favourites"),
      ).not.toBeInTheDocument();

      expect(screen.getByTestId("auth-login-link")).toHaveAttribute(
        "href",
        "/login",
      );
      expect(screen.getByTestId("auth-signup-link")).toHaveAttribute(
        "href",
        "/register",
      );
      expect(screen.queryByTestId("auth-logout-button")).not.toBeInTheDocument();
    });

    it("adds Favourites, a log out button and the profile link when signed in", () => {
      vi.mocked(authClient.useSession).mockReturnValue(sessionState());

      renderWithProviders(<NavItems />);

      expect(screen.getByTestId("nav-link-favourites")).toHaveAttribute(
        "href",
        "/favourites",
      );
      expect(screen.getByTestId("auth-logout-button")).toBeInTheDocument();
      expect(screen.getByTestId("auth-profile-link")).toHaveAttribute(
        "href",
        "/profile",
      );
      expect(screen.queryByTestId("auth-login-link")).not.toBeInTheDocument();
    });

    it("logs out from the log out button", async () => {
      vi.mocked(authClient.useSession).mockReturnValue(sessionState());

      renderWithProviders(<NavItems />);
      await userEvent.click(screen.getByTestId("auth-logout-button"));

      expect(authClient.signOut).toHaveBeenCalledOnce();
    });
  });

  describe("mobile drawer", () => {
    async function openDrawer() {
      const trigger = screen.getByTestId("nav-drawer-trigger");
      expect(trigger).toHaveAccessibleName("Open menu");
      await userEvent.click(trigger);
      return screen.findByTestId("nav-drawer");
    }

    it("opens with the nav links and a login link when signed out", async () => {
      vi.mocked(authClient.useSession).mockReturnValue(sessionState(null));

      renderWithProviders(<NavItems />);
      await openDrawer();

      expect(screen.getByTestId("nav-drawer-link-browse")).toHaveAttribute(
        "href",
        "/search",
      );
      expect(screen.getByTestId("nav-drawer-login")).toHaveAttribute(
        "href",
        "/login",
      );
      expect(
        screen.queryByTestId("nav-drawer-link-favourites"),
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId("nav-drawer-profile")).not.toBeInTheDocument();
    });

    it("shows Favourites, log out and the user's profile when signed in", async () => {
      vi.mocked(authClient.useSession).mockReturnValue(sessionState());

      renderWithProviders(<NavItems />);
      await openDrawer();

      expect(
        screen.getByTestId("nav-drawer-link-favourites"),
      ).toBeInTheDocument();
      expect(screen.getByTestId("nav-drawer-logout")).toBeInTheDocument();
      expect(screen.queryByTestId("nav-drawer-login")).not.toBeInTheDocument();

      const profile = screen.getByTestId("nav-drawer-profile");
      expect(profile).toHaveAttribute("href", "/profile");
      expect(profile).toHaveTextContent(testUser.name);
    });

    it("closes from the close button", async () => {
      vi.mocked(authClient.useSession).mockReturnValue(sessionState(null));

      renderWithProviders(<NavItems />);
      const drawer = await openDrawer();
      expect(drawer).toHaveAttribute("data-state", "open");

      const close = screen.getByTestId("nav-drawer-close");
      expect(close).toHaveAccessibleName("Close menu");
      await userEvent.click(close);

      // vaul unmounts after its exit animation, which jsdom never finishes.
      await waitFor(() =>
        expect(drawer).toHaveAttribute("data-state", "closed"),
      );
    });
  });
});
