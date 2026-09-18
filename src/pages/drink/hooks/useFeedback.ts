import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { HttpError } from "@/lib/errors";
import { TooManyRequestsErrorBody } from "@/lib/errorResponses";
import {
  postFeedback,
  putFeedback,
  fetchFeedback,
} from "../services/drinkService";

export function usePostFeedback(drinkId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ comment, rating }: { comment: string; rating: number }) =>
      postFeedback(drinkId, comment, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback", drinkId] });
    },
    onError: (error) => {
      if (error instanceof HttpError && error.status === 429) {
        const body = error.body as TooManyRequestsErrorBody;
        toast.error("Too many requests", {
          description: `Please wait ${body.cooldown.minutes} minutes ${body.cooldown.seconds} seconds`,
          position: "top-center",
        });
      } else {
        toast.error(
          error instanceof HttpError ? error.message : "Something went wrong.",
        );
      }
    },
  });
}

export function usePutFeedback(drinkId: string, feedbackId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ comment, rating }: { comment: string; rating: number }) =>
      putFeedback(drinkId, feedbackId, comment, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback", drinkId] });
    },
    onError: (error) => {
      // TODO - move this into own hook
      if (error instanceof HttpError && error.status === 429) {
        const body = error.body as TooManyRequestsErrorBody;
        toast.error("Too many requests", {
          description: `Please wait ${body.cooldown.minutes} minutes ${body.cooldown.seconds} seconds`,
          position: "top-center",
        });
      } else {
        toast.error(
          error instanceof HttpError ? error.message : "Something went wrong.",
        );
      }
    },
  });
}

export function useFeedback(drinkId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["feedback", drinkId],
    queryFn: () => fetchFeedback(drinkId),
    enabled: !!drinkId,
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
