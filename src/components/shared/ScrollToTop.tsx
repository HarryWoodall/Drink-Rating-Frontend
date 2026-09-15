import { useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Resets the window scroll on forward navigation.
 *
 * React Router only restores scroll for data routers (`createBrowserRouter`
 * + `<ScrollRestoration>`); with `<BrowserRouter>` + `<Routes>` the browser
 * keeps the previous offset, so a new page opens scrolled to wherever the
 * last one was. Render this once inside the router.
 */
export function ScrollToTop() {
  const { pathname, search, hash } = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    // Back/forward: leave the reader where they were.
    if (navigationType === "POP") return;

    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView();
        return;
      }
    }

    // `html { scroll-behavior: smooth }` (index.css) would otherwise animate
    // the jump on every navigation; a page change should land at the top
    // immediately.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, search, hash, navigationType]);

  return null;
}
