import { useRouteHistoryStore } from "@/store/routeHistoryStore";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function BackLink() {
  const { fullPreviousPath, previousBackText } = useRouteHistoryStore(
    (state) => state,
  );

  return (
    <Link
      to={fullPreviousPath()}
      className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-amber"
      data-testid="back-link"
    >
      <ArrowLeft className="h-4 w-4" />
      {previousBackText ?? "Home"}
    </Link>
  );
}
