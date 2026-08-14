import { authClient } from "@/lib/auth";
import { UserProfileIconButton } from "./UserProfileIconButton";
import { CreateSessionLinks } from "./CreateSessionLinks";
import { useLogout } from "./hooks/logoutHooks";

export function AuthItems() {
  const { data: session } = authClient.useSession();
  const logout = useLogout();

  if (session) {
    return (
      <div className="hidden gap-4 sm:flex items-center">
        <button
          onClick={logout}
          className="text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-amber"
        >
          Log out
        </button>
        <UserProfileIconButton />
      </div>
    );
  }

  return <CreateSessionLinks />;
}
