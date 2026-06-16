import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { usePostFeedback } from "@/pages/cocktail/hooks/useFeedback";
import { FeedbackModal } from "./FeedbackModal";

export type ReviewModalProps = {
  drinkId: string;
};

export type FormValues = { comment: string; rating: number };

export function CreateFeedbackModal({ drinkId }: ReviewModalProps) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(0);

  const { mutate, isPending, error } = usePostFeedback(drinkId);
  const form = useForm<FormValues>();

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
        <Button variant="outline" className="rounded-full">
          Rate &amp; Review
        </Button>
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
