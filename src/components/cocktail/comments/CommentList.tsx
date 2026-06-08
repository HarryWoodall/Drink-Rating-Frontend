import { Skeleton } from "@/components/ui/skeleton";
import { useComments } from "@/pages/cocktail/hooks/useComments";
import { CommentItem } from "./CommentItem";

export function CommentList({ drinkId }: { drinkId: string }) {
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
