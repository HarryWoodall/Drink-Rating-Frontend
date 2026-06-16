import { Star } from "lucide-react";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { cn } from "@/lib/utils";
import type { Feedback } from "@/types/cocktail";
import { authClient } from "@/lib/auth";
import { UpdateFeedbackModal } from "../FeedbackModal/UpdateFeedbackModal";

export function CommentItem({ feedback }: { feedback: Feedback }) {
  const name = feedback.user?.name ?? "Anonymous";
  const { data: session } = authClient.useSession();

  const isUserComment =
    session !== null && feedback.user?.id == session?.user.id;

  const date = new Date(feedback.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className={cn(
        "flex gap-3",
        isUserComment ? "bg-accent p-2 rounded-md" : null,
      )}
    >
      <UserAvatar user={feedback.user} size="xs" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 relative w-fit">
          <span className="text-sm font-medium">{name}</span>
          <span className="text-xs text-muted-foreground">{date}</span>
          {isUserComment ? (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2">
              <UpdateFeedbackModal
                drinkId={feedback.drinkId.toString()}
                feedbackId={feedback.id}
                currentState={{
                  comment: feedback.comment,
                  rating: feedback.rating ?? 0,
                }}
                variant="inline"
              />
            </div>
          ) : null}
        </div>
        {feedback.rating !== null && (
          <div className="mt-1 flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={cn(
                  "h-3.5 w-3.5",
                  s <= feedback.rating!
                    ? "fill-amber text-amber"
                    : "fill-none text-amber/25",
                )}
              />
            ))}
          </div>
        )}
        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
          {feedback.comment}
        </p>
      </div>
    </div>
  );
}
