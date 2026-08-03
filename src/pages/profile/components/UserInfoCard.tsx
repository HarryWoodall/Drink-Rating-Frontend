import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { UpdateProfileForm } from "./UpdateProfileForm";
import type { User } from "@/types/cocktail";
import { imagePath } from "@/lib/utils";

interface UserInfoCardProps {
  user: User & { email: string };
}

export function UserInfoCard({ user }: UserInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  // TODO - Seperate out read only view to own component
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <UpdateProfileForm
            name={user.name}
            image={imagePath(user.image) ?? null}
            onSuccess={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <UserAvatar user={user} size="xl" />
              <div>
                <p className="font-serif text-xl italic">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => setIsEditing(true)}
            >
              Edit profile
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
