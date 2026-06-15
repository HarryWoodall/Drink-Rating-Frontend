import { Star } from "lucide-react";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { cn } from "@/lib/utils";
import type { Feedback } from "@/types/cocktail";

export function CommentItem({ comment }: { comment: Feedback }) {
  const name = comment.user?.name ?? "Anonymous";

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
        {comment.rating !== null && (
          <div className="mt-1 flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={cn(
                  "h-3.5 w-3.5",
                  s <= comment.rating!
                    ? "fill-amber text-amber"
                    : "fill-none text-amber/25",
                )}
              />
            ))}
          </div>
        )}
        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
          {comment.comment}
        </p>
      </div>
    </div>
  );
}
