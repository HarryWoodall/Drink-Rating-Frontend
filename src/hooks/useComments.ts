import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchComments, postComment } from "@/services/api";

export function useComments(drinkId: string) {
  const { data, isLoading } = useQuery({
    queryKey: ["comments", drinkId],
    queryFn: () => fetchComments(drinkId),
    enabled: !!drinkId,
  });

  return { comments: data ?? [], loading: isLoading };
}

export function usePostComment(drinkId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (comment: string) => postComment(drinkId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", drinkId] });
    },
  });
}
