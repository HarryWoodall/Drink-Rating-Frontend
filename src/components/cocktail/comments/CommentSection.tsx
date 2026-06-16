import { useFeedback } from "@/pages/cocktail/hooks/useFeedback";
import { CommentList } from "./CommentList";
import { CreateFeedbackModal } from "../FeedbackModal/CreateFeedbackModal";
import { UpdateFeedbackModal } from "../FeedbackModal/UpdateFeedbackModal";
import { authClient } from "@/lib/auth";

export function CommentSection({ drinkId }: { drinkId: string }) {
  const feedback = useFeedback(drinkId);
  const { data: session } = authClient.useSession();

  if (!feedback.data) {
    return null; // TODO better error state
  }

  const currentComment = () =>
    feedback.data!.feedback.find((x) => x.userId == session?.user.id)!;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-5 border-t border-border bg-black/20 p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Your verdict
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Rate this cocktail and leave a comment
          </p>
        </div>
        {feedback.data.userHasCommented ? (
          <UpdateFeedbackModal
            drinkId={drinkId}
            feedbackId={currentComment().id}
            currentState={{
              comment: currentComment().comment,
              rating: currentComment().rating ?? 0,
            }}
          />
        ) : (
          <CreateFeedbackModal drinkId={drinkId} />
        )}
      </div>
      <section className="border-t border-border px-8 py-8 md:px-10">
        <h2 className="mb-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Comments
        </h2>
        <div className="space-y-8">
          <CommentList feedback={feedback} />
        </div>
      </section>
    </>
  );
}
