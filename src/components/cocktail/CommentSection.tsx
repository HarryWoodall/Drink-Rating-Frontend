import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useComments, usePostComment } from "@/hooks/useComments";
import type { Comment } from "@/types/cocktail";

type CommentFormValues = { comment: string };

function CommentForm({ drinkId }: { drinkId: string }) {
  const { mutate, isPending } = usePostComment(drinkId);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CommentFormValues>();

  const value = watch("comment") ?? "";

  function onSubmit({ comment }: CommentFormValues) {
    mutate(comment, { onSuccess: () => reset() });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <textarea
          {...register("comment", {
            required: "Comment cannot be empty",
            minLength: { value: 3, message: "Must be at least 3 characters" },
            maxLength: { value: 500, message: "Cannot exceed 500 characters" },
          })}
          placeholder="Leave a note about this drink…"
          rows={3}
          className="w-full resize-none rounded-xl border border-border bg-black/20 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber"
        />
        <div className="mt-1 flex items-center justify-between">
          {errors.comment ? (
            <p className="text-xs text-red-400">{errors.comment.message}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-muted-foreground">
            {value.length}/500
          </span>
        </div>
      </div>
      <Button
        type="submit"
        disabled={isPending}
        variant="outline"
        className="rounded-full"
      >
        {isPending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
        Post comment
      </Button>
    </form>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
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
      <Avatar className="h-8 w-8 shrink-0">
        {comment.user?.image && (
          <AvatarImage src={comment.user.image} alt={name} />
        )}
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>
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

function CommentList({ drinkId }: { drinkId: string }) {
  const { comments, loading } = useComments(drinkId);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <p className="text-sm italic text-muted-foreground">
        No comments yet. Be the first to pour your thoughts.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {comments.map((c) => (
        <CommentItem key={c.id} comment={c} />
      ))}
    </div>
  );
}

export function CommentSection({ drinkId }: { drinkId: string }) {
  return (
    <section className="border-t border-border px-8 py-8 md:px-10">
      <h2 className="mb-6 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Comments
      </h2>
      <div className="space-y-8">
        <CommentForm drinkId={drinkId} />
        <CommentList drinkId={drinkId} />
      </div>
    </section>
  );
}
