import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";

export function CommentSection({ drinkId }: { drinkId: string }) {
  return (
    <section className="border-t border-border px-8 py-8 md:px-10">
      <h2 className="mb-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Comments
      </h2>
      <div className="space-y-8">
        <CommentForm drinkId={drinkId} />
        <CommentList drinkId={drinkId} />
      </div>
    </section>
  );
}
