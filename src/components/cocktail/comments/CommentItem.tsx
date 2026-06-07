import { UserAvatar } from "@/components/shared/UserAvatar";
import { Comment } from "@/types/cocktail";

export function CommentItem({ comment }: { comment: Comment }) {
  const name = comment.user?.name ?? "Anonymous";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const date = new Date(comment.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex gap-3">
      <UserAvatar user={comment.user} size="xs" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium">{name}</span>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
          {comment.comment}
        </p>
      </div>
    </div>
  );
}
