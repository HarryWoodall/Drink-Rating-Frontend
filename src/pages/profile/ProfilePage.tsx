import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth";
import { loginPath } from "@/lib/paths";
import { UserInfoCard } from "./components/UserInfoCard";
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
      <UserInfoCard user={user} />

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
