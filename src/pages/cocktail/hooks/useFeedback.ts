import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFeedback, postFeedback } from "@/services/api";

export function usePostFeedback(drinkId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ comment, rating }: { comment: string; rating: number }) =>
      postFeedback(drinkId, comment, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", drinkId] });
    },
  });
}

export function useFeedback(drinkId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["comments", drinkId],
    queryFn: () => fetchFeedback(drinkId),
    enabled: !!drinkId,
  });

  return {
    comments: data ?? [],
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}
