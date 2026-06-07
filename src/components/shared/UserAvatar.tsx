import { cn } from "@/lib/utils";
import { User } from "@/types/cocktail";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

export type UserAvatarProps = {
  user: User | null;
  size?: Size;
};

const avatarContainerSize = {
  xs: "h-8 w-8",
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-14 w-14",
  xl: "h-16 w-16",
} as const;

type Size = keyof typeof avatarContainerSize;

export function UserAvatar({ user, size = "sm" }: UserAvatarProps) {
  const name = user?.name ?? "Anonymous";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Avatar
      className={cn(
        "shrink-0 bg-gray-500 rounded-full flex justify-center items-center",
        avatarContainerSize[size],
      )}
    >
      {user?.image && <AvatarImage src={user.image} alt={name} />}
      <AvatarFallback className={`text-${size}`}>{initials}</AvatarFallback>
    </Avatar>
  );
}
