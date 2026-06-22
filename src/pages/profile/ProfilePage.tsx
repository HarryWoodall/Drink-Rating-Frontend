import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { authClient } from "@/lib/auth";
import { loginPath } from "@/lib/paths";
import { UpdateProfileForm } from "./components/UpdateProfileForm";
import { FeedbackHistory } from "./components/FeedbackHistory";
import type { User } from "@/types/cocktail";
import { Button } from "@/components/ui/button";

export function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !session) {
      navigate(loginPath(), { replace: true });
    }
  }, [session, isPending, navigate]);

  if (isPending || !session) return null;

  const user = session.user as User & { email: string };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-8">
      <div className="flex items-center gap-4">
        <UserAvatar user={user} size="xl" />
        <div>
          <h1 className="font-serif text-3xl italic">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Edit profile</CardTitle>
        </CardHeader>
        <CardContent>
          <UpdateProfileForm name={user.name} image={user.image ?? null} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() =>
              navigate("/reset-password-request", { replace: true })
            }
          >
            Reset Password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Feedback history</CardTitle>
        </CardHeader>
        <CardContent>
          <FeedbackHistory />
        </CardContent>
      </Card>
    </div>
  );
}
