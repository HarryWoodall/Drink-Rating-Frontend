import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth";
import { loginPath } from "@/lib/paths";
import { useRouteHistoryStore } from "@/store/routeHistoryStore";
import { useFavourites } from "./hooks/useFavourites";
import { FavouritesSection } from "./components/FavouritesSection";

export function FavouritesPage() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();
  const setPath = useRouteHistoryStore((state) => state.setPath);

  useEffect(() => {
    if (!isPending && !session) {
      navigate(loginPath(), { replace: true });
    }
  }, [session, isPending, navigate]);

  useEffect(() => {
    setPath(location.pathname, "Back to favourites");
  }, [setPath]);

  const { data, isLoading, error } = useFavourites(!!session);

  if (isPending || !session) return null;

  return (
    <div className="py-8">
      <div className="mb-6 flex items-center gap-3.5 text-[0.7rem] uppercase tracking-[0.46em] text-amber">
        <span className="h-px w-12 bg-amber/60" />
        Your collection
      </div>

      <h1 className="mb-8 font-serif text-4xl font-light italic leading-none">
        Saved for later.
      </h1>

      <FavouritesSection
        favourites={data ?? []}
        loading={isLoading}
        error={error}
      />
    </div>
  );
}
