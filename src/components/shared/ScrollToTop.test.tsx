import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { ScrollToTop } from "./ScrollToTop";
import { renderWithProviders, screen } from "@/test/utils";

function BackButton() {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(-1)} data-testid="back-button">
      Back
    </button>
  );
}

function TestApp() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Link to="/second" data-testid="second-link">
                Go to second
              </Link>
              <Link to="/second#anchor" data-testid="second-anchor-link">
                Go to second anchor
              </Link>
            </>
          }
        />
        <Route
          path="/second"
          element={
            <>
              <BackButton />
              <div id="anchor">Anchor target</div>
            </>
          }
        />
      </Routes>
    </>
  );
}

describe("ScrollToTop", () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
    // jsdom doesn't implement scrollIntoView.
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("scrolls to the top when navigating to a new page", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TestApp />, { route: "/" });
    vi.mocked(window.scrollTo).mockClear();

    await user.click(screen.getByTestId("second-link"));

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  });

  it("scrolls to the element named by the hash instead of the top", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TestApp />, { route: "/" });
    vi.mocked(window.scrollTo).mockClear();

    await user.click(screen.getByTestId("second-anchor-link"));

    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("leaves the scroll position alone on back/forward", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TestApp />, { route: "/" });
    await user.click(screen.getByTestId("second-link"));
    vi.mocked(window.scrollTo).mockClear();

    await user.click(screen.getByTestId("back-button"));
    await screen.findByTestId("second-link");

    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
