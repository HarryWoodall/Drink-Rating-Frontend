import { act } from "@testing-library/react";
import { useLocation } from "react-router-dom";
import { useLogout } from "./logoutHooks";
import { authClient } from "@/lib/auth";
import { renderHookWithProviders } from "@/test/utils";

vi.mock("@/lib/auth", () => ({
  authClient: { signOut: vi.fn() },
}));

type SignOutOptions = { fetchOptions: { onSuccess: () => void } };

describe("useLogout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("signs out, then sends the user to the login page", async () => {
    vi.mocked(authClient.signOut).mockImplementation((async (
      options: SignOutOptions,
    ) => {
      options.fetchOptions.onSuccess();
    }) as never);

    const { result } = renderHookWithProviders(
      () => ({ logout: useLogout(), location: useLocation() }),
      { route: "/profile" },
    );

    await act(() => result.current.logout());

    expect(authClient.signOut).toHaveBeenCalledOnce();
    expect(result.current.location.pathname).toBe("/login");
  });

  it("stays put if sign-out doesn't succeed", async () => {
    vi.mocked(authClient.signOut).mockResolvedValue(undefined as never);

    const { result } = renderHookWithProviders(
      () => ({ logout: useLogout(), location: useLocation() }),
      { route: "/profile" },
    );

    await act(() => result.current.logout());

    expect(result.current.location.pathname).toBe("/profile");
  });
});
