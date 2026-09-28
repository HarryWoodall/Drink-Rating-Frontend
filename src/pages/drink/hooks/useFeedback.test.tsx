import { act, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { useFeedback, usePostFeedback, usePutFeedback } from "./useFeedback";
import { fetchFeedback, postFeedback, putFeedback } from "../services/drinkService";
import { HttpError } from "@/lib/errors";
import { renderHookWithProviders } from "@/test/utils";
import { makeFeedback } from "@/test/fixtures";

vi.mock("../services/drinkService", () => ({
  fetchFeedback: vi.fn(),
  postFeedback: vi.fn(),
  putFeedback: vi.fn(),
}));

vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));

function httpError(status: number, body: unknown) {
  return new HttpError(status, "Error", body, new Response());
}

const tooManyRequests = httpError(429, {
  error: "Too many requests",
  cooldown: { minutes: 2, seconds: 30 },
});

describe("useFeedback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads the drink's feedback", async () => {
    const response = { userHasCommented: true, feedback: [makeFeedback()] };
    vi.mocked(fetchFeedback).mockResolvedValue(response);

    const { result } = renderHookWithProviders(() => useFeedback("11007"));

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.data).toEqual(response));
    expect(result.current.error).toBeNull();
    expect(fetchFeedback).toHaveBeenCalledWith("11007");
  });

  it("surfaces the error message when loading fails", async () => {
    vi.mocked(fetchFeedback).mockRejectedValue(new Error("500 Server Error"));

    const { result } = renderHookWithProviders(() => useFeedback("11007"));

    await waitFor(() => expect(result.current.error).toBe("500 Server Error"));
    expect(result.current.data).toBeNull();
  });

  it("doesn't fetch without a drink id", () => {
    renderHookWithProviders(() => useFeedback(""));

    expect(fetchFeedback).not.toHaveBeenCalled();
  });
});

describe.each([
  {
    name: "usePostFeedback",
    useHook: () => usePostFeedback("11007"),
    request: postFeedback,
    expectedArgs: ["11007", "Great", 5],
  },
  {
    name: "usePutFeedback",
    useHook: () => usePutFeedback("11007", 42),
    request: putFeedback,
    expectedArgs: ["11007", 42, "Great", 5],
  },
])("$name", ({ useHook, request, expectedArgs }) => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends the feedback and refreshes the drink's feedback", async () => {
    vi.mocked(request).mockResolvedValue();

    const { result, queryClient } = renderHookWithProviders(useHook);
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");

    await act(() => result.current.mutateAsync({ comment: "Great", rating: 5 }));

    expect(request).toHaveBeenCalledWith(...expectedArgs);
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["feedback", "11007"] });
  });

  it("toasts the cooldown when rate limited", async () => {
    vi.mocked(request).mockRejectedValue(tooManyRequests);

    const { result } = renderHookWithProviders(useHook);

    await act(async () => {
      await result.current
        .mutateAsync({ comment: "Great", rating: 5 })
        .catch(() => {});
    });

    expect(toast.error).toHaveBeenCalledWith("Too many requests", {
      description: "Please wait 2 minutes 30 seconds",
      position: "top-center",
    });
  });

  it("toasts the server's message for other HTTP errors", async () => {
    vi.mocked(request).mockRejectedValue(
      httpError(400, { message: "Comment too rude" }),
    );

    const { result } = renderHookWithProviders(useHook);

    await act(async () => {
      await result.current
        .mutateAsync({ comment: "Great", rating: 5 })
        .catch(() => {});
    });

    expect(toast.error).toHaveBeenCalledWith("Comment too rude");
  });

  it("toasts a generic message for non-HTTP failures", async () => {
    vi.mocked(request).mockRejectedValue(new TypeError("Failed to fetch"));

    const { result } = renderHookWithProviders(useHook);

    await act(async () => {
      await result.current
        .mutateAsync({ comment: "Great", rating: 5 })
        .catch(() => {});
    });

    expect(toast.error).toHaveBeenCalledWith("Something went wrong.");
  });
});
