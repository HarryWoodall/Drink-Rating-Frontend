import { screen } from "@testing-library/react";
import { UserAvatar } from "./UserAvatar";
import { renderWithProviders } from "@/test/utils";

describe("UserAvatar", () => {
  it("shows up to two initials from the user's name", () => {
    renderWithProviders(
      <UserAvatar user={{ id: "u1", name: "alex james morgan", image: null }} />,
    );

    expect(screen.getByTestId("user-avatar-fallback")).toHaveTextContent(
      /^AJ$/,
    );
  });

  it("shows a single initial for a one-word name", () => {
    renderWithProviders(
      <UserAvatar user={{ id: "u1", name: "Cher", image: null }} />,
    );

    expect(screen.getByTestId("user-avatar-fallback")).toHaveTextContent(/^C$/);
  });

  it("falls back to Anonymous for a missing user", () => {
    renderWithProviders(<UserAvatar user={null} />);

    expect(screen.getByTestId("user-avatar-fallback")).toHaveTextContent(/^A$/);
  });

  // Radix only mounts the <img> once it has loaded, which never happens in jsdom.
  it("shows the initials until the profile image loads", () => {
    renderWithProviders(
      <UserAvatar user={{ id: "u1", name: "Alex", image: "img-123" }} />,
    );

    expect(screen.queryByTestId("user-avatar-image")).not.toBeInTheDocument();
    expect(screen.getByTestId("user-avatar-fallback")).toBeInTheDocument();
  });

  it.each([
    ["xs", "h-8"],
    ["lg", "h-14"],
    [undefined, "h-10"],
  ] as const)("sizes the avatar for size=%s", (size, className) => {
    renderWithProviders(
      <UserAvatar user={{ id: "u1", name: "Alex", image: null }} size={size} />,
    );

    expect(screen.getByTestId("user-avatar")).toHaveClass(className);
  });
});
