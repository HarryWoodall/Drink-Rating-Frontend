import { waitFor } from "@testing-library/react";
import { useUserFeedback } from "./useUserFeedback";
import { fetchUserFeedback } from "../services/profileService";
import { renderHookWithProviders } from "@/test/utils";
import { makeUserFeedback } from "@/test/fixtures";

vi.mock("../services/profileService", () => ({ fetchUserFeedback: vi.fn() }));

describe("useUserFeedback", () => {
  it("defaults to an empty list, then loads the user's feedback", async () => {
    const feedback = [makeUserFeedback()];
    vi.mocked(fetchUserFeedback).mockResolvedValue(feedback);

    const { result } = renderHookWithProviders(() => useUserFeedback());

    expect(result.current).toEqual({ data: [], loading: true, error: null });
    await waitFor(() => expect(result.current.data).toEqual(feedback));
  });

  it("surfaces the error message", async () => {
    vi.mocked(fetchUserFeedback).mockRejectedValue(new Error("401"));

    const { result } = renderHookWithProviders(() => useUserFeedback());

    await waitFor(() => expect(result.current.error).toBe("401"));
  });
});
