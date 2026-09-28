import { signIn } from "./loginService";
import { authClient } from "@/lib/auth";

vi.mock("@/lib/auth", () => ({
  authClient: { signIn: { email: vi.fn() } },
}));

describe("signIn", () => {
  it("signs in by email, remembering the user and returning home", async () => {
    const result = { data: null, error: null };
    vi.mocked(authClient.signIn.email).mockResolvedValue(result as never);

    await expect(signIn("user@example.test", "hunter22")).resolves.toBe(
      result,
    );

    expect(authClient.signIn.email).toHaveBeenCalledWith({
      email: "user@example.test",
      password: "hunter22",
      callbackURL: "/",
      rememberMe: true,
    });
  });
});
