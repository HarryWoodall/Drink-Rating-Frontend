import { act, renderHook } from "@testing-library/react";
import { useScrolled } from "./useScrolled";

function scrollTo(y: number) {
  act(() => {
    Object.defineProperty(window, "scrollY", { value: y, configurable: true });
    window.dispatchEvent(new Event("scroll"));
  });
}

describe("useScrolled", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  });

  it("is false at the top of the page", () => {
    const { result } = renderHook(() => useScrolled());

    expect(result.current).toBe(false);
  });

  it("flips once the page scrolls past the threshold, and back", () => {
    const { result } = renderHook(() => useScrolled(8));

    scrollTo(8);
    expect(result.current).toBe(false);

    scrollTo(9);
    expect(result.current).toBe(true);

    scrollTo(0);
    expect(result.current).toBe(false);
  });

  it("starts true when the page is already scrolled", () => {
    Object.defineProperty(window, "scrollY", { value: 500, configurable: true });

    const { result } = renderHook(() => useScrolled());

    expect(result.current).toBe(true);
  });

  it("stops listening on unmount", () => {
    const remove = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useScrolled());

    unmount();

    expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function));
  });
});
