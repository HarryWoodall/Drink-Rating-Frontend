import { UserAvatar } from "@/components/shared/UserAvatar";
import { authClient } from "@/lib/auth";
import { profilePath } from "@/lib/paths";
import { User } from "@/types/cocktail";
import { Link } from "react-router-dom";

export function UserProfileIconButton() {
  const { data: session } = authClient.useSession();

  if (!session) {
    return null;
  }

  return (
    <Link to={profilePath()}>
      <UserAvatar user={session.user as User} size="lg" />
    </Link>
  );
}
