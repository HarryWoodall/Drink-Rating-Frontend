import { loginPath, registerPath } from "@/lib/paths";
import { Link } from "react-router-dom";

export function CreateSessionLinks() {
  return (
    <div className="hidden items-center gap-4 sm:flex">
      <Link
        to={loginPath()}
        className="text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-amber"
      >
        Log in
      </Link>
      <Link
        to={registerPath()}
        className="rounded-full bg-amber px-4 py-2 text-xs font-semibold text-background transition-opacity hover:opacity-80"
      >
        Sign up
      </Link>
    </div>
  );
}
