import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  usePostFeedback,
  usePutFeedback,
} from "@/pages/cocktail/hooks/useFeedback";
import { FeedbackModal } from "./FeedbackModal";
import { PencilIcon } from "lucide-react";

export type ReviewModalProps = {
  drinkId: string;
  feedbackId: number;
  currentState: FormValues;
  variant?: "inline" | "full";
};

export type FormValues = { comment: string; rating: number };

export function UpdateFeedbackModal({
  drinkId,
  feedbackId,
  currentState,
  variant = "full",
}: ReviewModalProps) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(0);

  const { mutate, isPending, error } = usePutFeedback(drinkId, feedbackId);

  const form = useForm<FormValues>({
    values: currentState,
    resetOptions: { keepDirtyValues: true },
  });

  function onSubmit({ comment, rating }: FormValues) {
    mutate(
      { comment, rating },
      {
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
      },
    );
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      form.reset();
      setHover(0);
    }
    setOpen(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {variant === "full" ? (
          <Button variant="outline" className="rounded-full">
            Update Review
          </Button>
        ) : (
          <Button size="sm" variant="ghost" className="ml-1 rounded-full">
            <PencilIcon />
          </Button>
        )}
      </DialogTrigger>

      <FeedbackModal
        form={form}
        onSubmit={onSubmit}
        useHover={[hover, setHover]}
        error={error}
        isPending={isPending}
      />
    </Dialog>
  );
}
