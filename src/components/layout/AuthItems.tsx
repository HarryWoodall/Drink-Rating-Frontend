import { Link, useNavigate } from "react-router-dom";
import { loginPath, registerPath } from "@/lib/paths";
import { authClient } from "@/lib/auth";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { User } from "@/types/cocktail";

export function AuthItems() {
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();

  if (session) {
    return (
      <div className="hidden gap-4 sm:flex">
        <button
          onClick={() =>
            authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  navigate("/login");
                },
              },
            })
          }
          className="text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-amber"
        >
          Log out
        </button>
        <UserAvatar user={session.user as User} size="lg" />
      </div>
    );
  }

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
