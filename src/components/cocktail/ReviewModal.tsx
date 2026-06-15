import { useState } from "react";
import { useForm } from "react-hook-form";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePostFeedback } from "@/pages/cocktail/hooks/useFeedback";
import { cn } from "@/lib/utils";

type FormValues = { comment: string };

export function ReviewModal({ drinkId }: { drinkId: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const { mutate, isPending, error } = usePostFeedback(drinkId);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const commentValue = watch("comment") ?? "";

  function onSubmit({ comment }: FormValues) {
    // if (!rating) return;
    mutate(
      { comment, rating },
      {
        onSuccess: () => {
          reset();
          setRating(0);
          setOpen(false);
        },
      },
    );
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      reset();
      setRating(0);
      setHover(0);
    }
    setOpen(next);
  }

  console.log(error);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full">
          Rate &amp; Review
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-normal italic">
            Leave your verdict
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-5">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Rating
            </p>
            <div className="flex gap-1.5" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-label={`Rate ${s} star${s > 1 ? "s" : ""}`}
                  onMouseEnter={() => setHover(s)}
                  onClick={() => setRating(s)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "h-7 w-7",
                      (hover || rating) >= s
                        ? "fill-amber text-amber"
                        : "fill-none text-amber/25",
                    )}
                  />
                </button>
              ))}
            </div>
            {!rating && errors.comment && (
              <p className="mt-1 text-xs text-red-400">
                Please select a rating
              </p>
            )}
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Comment
            </p>
            <textarea
              {...register("comment", {
                minLength: {
                  value: 3,
                  message: "Must be at least 3 characters",
                },
                maxLength: {
                  value: 500,
                  message: "Cannot exceed 500 characters",
                },
              })}
              placeholder="Leave a note about this drink…"
              rows={4}
              className="w-full resize-none rounded-xl border border-border bg-black/20 px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber"
            />
            <div className="mt-1 flex items-center justify-between">
              {errors.comment ? (
                <p className="text-xs text-red-400">{errors.comment.message}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-muted-foreground">
                {commentValue.length}/500
              </span>
            </div>
            {error && <p className="text-xs text-red-400">{error.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full"
          >
            {isPending && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
            Submit review
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
