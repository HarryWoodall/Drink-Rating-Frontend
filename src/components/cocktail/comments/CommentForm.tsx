import { Button } from "@/components/ui/button";
import { usePostComment } from "@/pages/cocktail/hooks/useComments";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { CommentFormValues } from "./types/CommentFormValues";

export function CommentForm({ drinkId }: { drinkId: string }) {
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
    <form onSubmit={handleSubmit(onSubmit)}>
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
