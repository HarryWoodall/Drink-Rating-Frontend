import { register } from "./registerService";
import { authClient } from "@/lib/auth";

vi.mock("@/lib/auth", () => ({
  authClient: { signUp: { email: vi.fn() } },
}));

describe("register", () => {
  it("signs up by email with the chosen name", async () => {
    const result = { data: null, error: null };
    vi.mocked(authClient.signUp.email).mockResolvedValue(result as never);

    await expect(
      register("user@example.test", "hunter22", "Alex"),
    ).resolves.toBe(result);

    expect(authClient.signUp.email).toHaveBeenCalledWith({
      email: "user@example.test",
      password: "hunter22",
      name: "Alex",
      callbackURL: "/",
    });
  });
});
